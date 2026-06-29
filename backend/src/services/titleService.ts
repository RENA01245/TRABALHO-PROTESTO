import { PaymentStatus, Prisma, ProtestStatus } from "@prisma/client";
import { prisma } from "../config/prisma";
import { AppError } from "../utils/AppError";
import { buildProtocol } from "../utils/protocol";

type CreateProtest = {
  creditorId: string;
  debtorId: string;
  importBatchId?: string | null;
  titleNumber?: string;
  amount: number;
  issueDate?: Date;
  dueDate: Date;
  presentationDate?: Date;
  paymentStatus?: PaymentStatus;
  hasBoleto?: boolean;
  boletoDueDate?: Date | null;
  boletoAmount?: number | null;
  description?: string;
};

type ProtestFilters = {
  protocol?: string;
  document?: string;
  name?: string;
  status?: ProtestStatus;
  date?: Date;
  startDate?: Date;
  endDate?: Date;
  page: number;
  pageSize: number;
};

async function nextProtocol() {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const protocol = buildProtocol();
    const exists = await prisma.protest.findUnique({ where: { protocol } });
    if (!exists) return protocol;
  }
  throw new AppError("Nao foi possivel gerar protocolo unico", 500);
}

function toProtestData(data: CreateProtest) {
  return {
    creditorId: data.creditorId,
    debtorId: data.debtorId,
    importBatchId: data.importBatchId,
    titleNumber: data.titleNumber ?? `MANUAL-${Date.now()}`,
    amount: data.amount,
    dueDate: data.dueDate,
    presentationDate: data.presentationDate ?? data.issueDate ?? new Date(),
    paymentStatus: data.paymentStatus,
    hasBoleto: data.hasBoleto,
    boletoDueDate: data.boletoDueDate,
    boletoAmount: data.boletoAmount,
    notes: data.description
  };
}

function toProtestUpdateData(data: Partial<CreateProtest>) {
  return {
    creditorId: data.creditorId,
    debtorId: data.debtorId,
    importBatchId: data.importBatchId,
    titleNumber: data.titleNumber,
    amount: data.amount,
    dueDate: data.dueDate,
    presentationDate: data.presentationDate ?? data.issueDate,
    paymentStatus: data.paymentStatus,
    hasBoleto: data.hasBoleto,
    boletoDueDate: data.boletoDueDate,
    boletoAmount: data.boletoAmount,
    notes: data.description
  };
}

function includeRelations() {
  return {
    creditor: true,
    debtor: true,
    importBatch: true,
    payments: true,
    attachments: true
  };
}

export async function listTitles(filters: ProtestFilters) {
  const where: Prisma.ProtestWhereInput = {};
  const and: Prisma.ProtestWhereInput[] = [];
  if (filters.protocol) where.protocol = { contains: filters.protocol, mode: "insensitive" };
  if (filters.status) where.status = filters.status;
  if (filters.document) and.push({ OR: [{ creditor: { document: { contains: filters.document } } }, { debtor: { document: { contains: filters.document } } }] });
  if (filters.name) and.push({ OR: [{ creditor: { name: { contains: filters.name, mode: "insensitive" } } }, { debtor: { name: { contains: filters.name, mode: "insensitive" } } }] });
  if (and.length) where.AND = and;
  if (filters.date) {
    const start = new Date(filters.date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    where.presentationDate = { gte: start, lt: end };
  }
  if (filters.startDate || filters.endDate) {
    where.presentationDate = {
      gte: filters.startDate,
      lte: filters.endDate
    };
  }
  const skip = (filters.page - 1) * filters.pageSize;
  const [items, total] = await Promise.all([
    prisma.protest.findMany({ where, include: includeRelations(), orderBy: { createdAt: "desc" }, skip, take: filters.pageSize }),
    prisma.protest.count({ where })
  ]);
  return { items, total, page: filters.page, pageSize: filters.pageSize };
}

export async function getTitle(id: string) {
  const protest = await prisma.protest.findUnique({
    where: { id },
    include: {
      creditor: true,
      debtor: true,
      importBatch: true,
      attachments: true,
      payments: true,
      histories: { include: { user: { select: { name: true } } }, orderBy: { createdAt: "desc" } }
    }
  });
  if (!protest) throw new AppError("Protesto nao encontrado", 404);
  return protest;
}

export async function createTitle(data: CreateProtest, userId: string) {
  const protocol = await nextProtocol();
  return prisma.$transaction(async (tx) => {
    const protest = await tx.protest.create({
      data: { ...toProtestData(data), protocol, status: ProtestStatus.IMPORTADO },
      include: includeRelations()
    });
    await tx.protestHistory.create({
      data: {
        protestId: protest.id,
        userId,
        action: "CADASTRO_MANUAL",
        newValue: protest.status,
        description: "Protesto cadastrado manualmente no painel."
      }
    });
    return protest;
  });
}

export async function updateTitle(id: string, data: Partial<CreateProtest>, userId: string) {
  const previous = await prisma.protest.findUnique({ where: { id } });
  if (!previous) throw new AppError("Protesto nao encontrado", 404);
  const updated = await prisma.protest.update({ where: { id }, data: toProtestUpdateData(data), include: includeRelations() });
  await prisma.protestHistory.create({
    data: {
      protestId: id,
      userId,
      action: "ATUALIZACAO_DADOS",
      oldValue: JSON.stringify(previous),
      newValue: JSON.stringify(data),
      description: "Dados importantes do protesto atualizados."
    }
  });
  return updated;
}

export async function deleteTitle(id: string) {
  return prisma.protest.delete({ where: { id } });
}

export async function changeTitleStatus(id: string, status: ProtestStatus, note: string | undefined, userId: string) {
  const previous = await prisma.protest.findUnique({ where: { id } });
  if (!previous) throw new AppError("Protesto nao encontrado", 404);
  const updated = await prisma.protest.update({ where: { id }, data: { status }, include: includeRelations() });
  await prisma.protestHistory.create({
    data: {
      protestId: id,
      userId,
      action: "ALTERACAO_STATUS",
      oldValue: previous.status,
      newValue: status,
      description: note
    }
  });
  return updated;
}

export async function dashboard() {
  const [totalTitles, totalCreditors, totalDebtors, totalBatches, byStatus, byPaymentStatus, amount, recent] = await Promise.all([
    prisma.protest.count(),
    prisma.creditor.count(),
    prisma.debtor.count(),
    prisma.importBatch.count(),
    prisma.protest.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.protest.groupBy({ by: ["paymentStatus"], _count: { _all: true } }),
    prisma.protest.aggregate({ _sum: { amount: true } }),
    prisma.protest.findMany({ take: 5, orderBy: { createdAt: "desc" }, include: { creditor: true, debtor: true } })
  ]);
  return { totalTitles, totalProtests: totalTitles, totalCreditors, totalDebtors, totalBatches, totalAmount: Number(amount._sum.amount ?? 0), byStatus, byPaymentStatus, recent };
}
