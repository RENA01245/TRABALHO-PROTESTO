import { z } from "zod";

const attachmentTypes = ["BOLETO", "COMPROVANTE", "DOCUMENTO", "OUTRO"] as const;
const paymentStatuses = ["PENDENTE", "INFORMADO", "CONFIRMADO", "CANCELADO"] as const;

export const attachmentSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    fileName: z.string().min(1),
    fileUrl: z.string().url(),
    fileType: z.string().min(1),
    attachmentType: z.enum(attachmentTypes).default("OUTRO")
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
