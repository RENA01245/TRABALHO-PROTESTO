import { DocumentType, ImportStatus, PaymentStatus, ProtestStatus } from "@prisma/client";
import { prisma } from "../config/prisma";
import { AppError } from "../utils/AppError";

type ImportErrorInput = {
  lineNumber: number;
  field?: string;
  message: string;
  rawContent?: string;
};

type CreateImportBatch = {
  fileName: string;
  fileType: string;
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
  status: "PROCESSING" | "COMPLETED" | "COMPLETED_WITH_ERRORS" | "FAILED";
  errors: ImportErrorInput[];
};

const requiredHeaders = [
  "protocolo",
  "numero_titulo",
  "nome_devedor",
  "documento_devedor",
  "tipo_documento_devedor",
  "nome_credor",
  "documento_credor",
  "tipo_documento_credor",
  "valor",
  "data_vencimento",
  "data_apresentacao",
  "status"
];

function parseCsvLine(line: string) {
  const values: string[] = [];
  let current = "";
  let quoted = false;
  for (const char of line) {
    if (char === "\"") {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      values.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  return values.map((value) => value.replace(/^"|"$/g, ""));
}

function normalizeDocument(value: string) {
  return value.replace(/\D/g, "");
}

function toDate(value: string) {
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function parseMoney(value: string) {
  const trimmed = value.trim();
  const normalized = trimmed.includes(",") ? trimmed.replace(/\./g, "").replace(",", ".") : trimmed;
  const number = Number(normalized);
  return Number.isFinite(number) && number > 0 ? number : null;
}

function mapRecord(headers: string[], values: string[]) {
  return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
}

function validateRecord(record: Record<string, string>, lineNumber: number) {
  const errors: ImportErrorInput[] = [];
  const debtorDocumentType = record.tipo_documento_devedor as DocumentType;
  const creditorDocumentType = record.tipo_documento_credor as DocumentType;
  const status = record.status as ProtestStatus;
  const amount = parseMoney(record.valor);
  const dueDate = toDate(record.data_vencimento);
  const presentationDate = toDate(record.data_apresentacao);

  for (const header of requiredHeaders) {
    if (!record[header]) errors.push({ lineNumber, field: header, message: "Campo obrigatorio nao informado", rawContent: JSON.stringify(record) });
  }
  if (!Object.values(DocumentType).includes(debtorDocumentType)) errors.push({ lineNumber, field: "tipo_documento_devedor", message: "Tipo de documento do devedor invalido", rawContent: JSON.stringify(record) });
  if (!Object.values(DocumentType).includes(creditorDocumentType)) errors.push({ lineNumber, field: "tipo_documento_credor", message: "Tipo de documento do credor invalido", rawContent: JSON.stringify(record) });
  if (!Object.values(ProtestStatus).includes(status)) errors.push({ lineNumber, field: "status", message: "Status do protesto invalido", rawContent: JSON.stringify(record) });
  if (!amount) errors.push({ lineNumber, field: "valor", message: "Valor invalido", rawContent: JSON.stringify(record) });
  if (!dueDate) errors.push({ lineNumber, field: "data_vencimento", message: "Data de vencimento invalida", rawContent: JSON.stringify(record) });
  if (!presentationDate) errors.push({ lineNumber, field: "data_apresentacao", message: "Data de apresentacao invalida", rawContent: JSON.stringify(record) });

  return { errors, amount, dueDate, presentationDate, debtorDocumentType, creditorDocumentType, status };
}

export const importService = {
  list: () => prisma.importBatch.findMany({ include: { importedBy: { select: { name: true } }, errors: true, protests: true }, orderBy: { createdAt: "desc" } }),
  create: (data: CreateImportBatch, userId: string) => prisma.importBatch.create({
    data: {
      fileName: data.fileName,
      fileType: data.fileType,
      importedById: userId,
      totalRecords: data.totalRecords,
      validRecords: data.validRecords,
      invalidRecords: data.invalidRecords,
      status: data.status,
      errors: { create: data.errors }
    },
    include: { errors: true }
  }),
  processFile: async (file: Express.Multer.File | undefined, userId: string) => {
    if (!file) throw new AppError("Arquivo nao enviado", 400);
    if (!file.buffer.length) throw new AppError("Arquivo vazio", 400);

    const fileName = file.originalname;
    const lower = fileName.toLowerCase();
    if (![".csv", ".txt"].some((extension) => lower.endsWith(extension)) && !lower.endsWith(".json")) {
      throw new AppError("Formato de arquivo invalido. Use CSV, TXT ou JSON.", 400);
    }
    if (lower.endsWith(".json")) {
      throw new AppError("Importacao JSON ainda esta (A DEFINIR). Use CSV para o teste principal.", 400);
    }

    const content = file.buffer.toString("utf8").replace(/^\uFEFF/, "");
    const lines = content.split(/\r?\n/).filter((line) => line.trim().length > 0);
    if (lines.length < 2) throw new AppError("Arquivo sem registros para importacao", 400);

    const headers = parseCsvLine(lines[0]).map((header) => header.trim());
    const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header));
    if (missingHeaders.length) throw new AppError(`Cabecalho invalido. Campos ausentes: ${missingHeaders.join(", ")}`, 400);

    const rowResults = lines.slice(1).map((line, index) => {
      const lineNumber = index + 2;
      const record = mapRecord(headers, parseCsvLine(line));
      const validation = validateRecord(record, lineNumber);
      return { line, lineNumber, record, validation };
    });

    const validRows = rowResults.filter((row) => row.validation.errors.length === 0);
    const errors = rowResults.flatMap((row) => row.validation.errors);
    const status = errors.length === 0 ? ImportStatus.COMPLETED : validRows.length > 0 ? ImportStatus.COMPLETED_WITH_ERRORS : ImportStatus.FAILED;

    const batch = await prisma.$transaction(async (tx) => {
      const createdBatch = await tx.importBatch.create({
        data: {
          fileName,
          fileType: file.mimetype || "text/csv",
          importedById: userId,
          totalRecords: rowResults.length,
          validRecords: validRows.length,
          invalidRecords: errors.length ? rowResults.length - validRows.length : 0,
          status,
          errors: { create: errors }
        }
      });

      for (const row of validRows) {
        const record = row.record;
        const validation = row.validation;
        const debtorDocument = normalizeDocument(record.documento_devedor);
        const creditorDocument = normalizeDocument(record.documento_credor);
        const debtor = await tx.debtor.upsert({
          where: { document_documentType: { document: debtorDocument, documentType: validation.debtorDocumentType } },
          update: { name: record.nome_devedor },
          create: {
            name: record.nome_devedor,
            document: debtorDocument,
            documentType: validation.debtorDocumentType
          }
        });
        const creditor = await tx.creditor.upsert({
          where: { document_documentType: { document: creditorDocument, documentType: validation.creditorDocumentType } },
          update: { name: record.nome_credor },
          create: {
            name: record.nome_credor,
            document: creditorDocument,
            documentType: validation.creditorDocumentType
          }
        });
        const protest = await tx.protest.upsert({
          where: { protocol: record.protocolo },
          update: {
            titleNumber: record.numero_titulo,
            debtorId: debtor.id,
            creditorId: creditor.id,
            importBatchId: createdBatch.id,
            amount: validation.amount!,
            dueDate: validation.dueDate!,
            presentationDate: validation.presentationDate!,
            status: validation.status,
            paymentStatus: validation.status === ProtestStatus.PAGO ? PaymentStatus.CONFIRMADO : PaymentStatus.PENDENTE
          },
          create: {
            protocol: record.protocolo,
            titleNumber: record.numero_titulo,
            debtorId: debtor.id,
            creditorId: creditor.id,
            importBatchId: createdBatch.id,
            amount: validation.amount!,
            dueDate: validation.dueDate!,
            presentationDate: validation.presentationDate!,
            status: validation.status,
            paymentStatus: validation.status === ProtestStatus.PAGO ? PaymentStatus.CONFIRMADO : PaymentStatus.PENDENTE
          }
        });
        await tx.protestHistory.create({
          data: {
            protestId: protest.id,
            userId,
            action: "IMPORTACAO_ARQUIVO",
            newValue: validation.status,
            description: `Protesto importado do arquivo ${fileName}, linha ${row.lineNumber}.`
          }
        });
      }

      return tx.importBatch.findUnique({ where: { id: createdBatch.id }, include: { errors: true, protests: true } });
    });

    return {
      message: errors.length ? "Arquivo importado com inconsistencias" : "Arquivo importado com sucesso",
      batch
    };
  }
};
