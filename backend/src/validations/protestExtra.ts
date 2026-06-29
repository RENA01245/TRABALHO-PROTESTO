import { z } from "zod";

const attachmentTypes = ["BOLETO", "COMPROVANTE", "DOCUMENTO", "OUTRO"] as const;
const paymentStatuses = ["PENDENTE", "INFORMADO", "CONFIRMADO", "CANCELADO"] as const;

export const attachmentSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    fileName: z.string().min(1).optional(),
    fileUrl: z.string().url().optional(),
    fileType: z.string().min(1).optional(),
    attachmentType: z.enum(attachmentTypes).default("OUTRO"),
    boletoDueDate: z.coerce.date().optional(),
    boletoAmount: z.coerce.number().positive().optional(),
    notes: z.string().optional()
  })
});

export const paymentSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    amount: z.coerce.number().positive(),
    paymentDate: z.coerce.date().optional(),
    paymentMethod: z.string().optional(),
    status: z.enum(paymentStatuses).default("PENDENTE"),
    notes: z.string().optional()
  })
});
