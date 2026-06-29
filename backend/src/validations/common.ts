import { z } from "zod";
import { isValidCpfOrCnpj, normalizeDocument } from "../utils/document";

export const idParamSchema = z.object({ params: z.object({ id: z.string().uuid() }) });

export const partyBodySchema = z.object({
  name: z.string().min(2),
  document: z.string().transform(normalizeDocument).refine(isValidCpfOrCnpj, "CPF ou CNPJ invalido"),
  documentType: z.enum(["CPF", "CNPJ"]).optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().max(2).optional(),
  zipCode: z.string().optional()
});

export const partySchema = z.object({ body: partyBodySchema });
export const partyUpdateSchema = z.object({ params: idParamSchema.shape.params, body: partyBodySchema.partial() });

export const paginationQuerySchema = z.object({
  query: z.object({
    search: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().max(100).default(20)
  })
});
