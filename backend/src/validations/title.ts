import { z } from "zod";

const protestStatuses = [
  "IMPORTADO",
  "AGUARDANDO_ANALISE",
  "ENVIADO_CARTORIO",
  "INTIMADO",
  "AGUARDANDO_PAGAMENTO",
  "PAGO",
  "PROTESTADO",
  "SUSTADO",
  "RETIRADO",
  "CANCELADO",
  "DEVOLVIDO",
  "PENDENTE_BOLETO",
  "PENDENTE_PAGAMENTO",
  "PENDENTE_RETORNO",
  "ERRO_IMPORTACAO"
] as const;
const paymentStatuses = ["PENDENTE", "INFORMADO", "CONFIRMADO", "CANCELADO"] as const;

export const createTitleSchema = z.object({
  body: z.object({
    creditorId: z.string().uuid(),
    debtorId: z.string().uuid(),
    importBatchId: z.string().uuid().optional(),
    titleNumber: z.string().min(1).optional(),
    amount: z.coerce.number().positive(),
    issueDate: z.coerce.date(),
    dueDate: z.coerce.date(),
    presentationDate: z.coerce.date().optional(),
    paymentStatus: z.enum(paymentStatuses).optional(),
    hasBoleto: z.coerce.boolean().optional(),
    boletoDueDate: z.coerce.date().optional(),
    boletoAmount: z.coerce.number().positive().optional(),
    description: z.string().optional()
  }).refine((data) => data.dueDate >= data.issueDate, {
    path: ["dueDate"],
    message: "Data de vencimento deve ser igual ou posterior a data de emissao"
  })
});

export const updateTitleSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    creditorId: z.string().uuid().optional(),
    debtorId: z.string().uuid().optional(),
    importBatchId: z.string().uuid().nullable().optional(),
    titleNumber: z.string().min(1).optional(),
    amount: z.coerce.number().positive().optional(),
    issueDate: z.coerce.date().optional(),
    dueDate: z.coerce.date().optional(),
    presentationDate: z.coerce.date().optional(),
    paymentStatus: z.enum(paymentStatuses).optional(),
    hasBoleto: z.coerce.boolean().optional(),
    boletoDueDate: z.coerce.date().nullable().optional(),
    boletoAmount: z.coerce.number().positive().nullable().optional(),
    description: z.string().optional()
  })
});

export const statusSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    status: z.enum(protestStatuses),
    note: z.string().optional()
  })
});

export const titleQuerySchema = z.object({
  query: z.object({
    protocol: z.string().optional(),
    document: z.string().optional(),
    name: z.string().optional(),
    status: z.enum(protestStatuses).optional(),
    date: z.coerce.date().optional(),
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().max(100).default(20)
  })
});
