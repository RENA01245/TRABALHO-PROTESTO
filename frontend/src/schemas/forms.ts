import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("E-mail invalido"),
  password: z.string().min(6, "Informe a senha")
});

export const partySchema = z.object({
  name: z.string().min(2, "Nome obrigatorio"),
  document: z.string().min(11, "CPF/CNPJ obrigatorio"),
  email: z.string().email("E-mail invalido").or(z.literal("")).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().max(2).optional(),
  zipCode: z.string().optional()
});

export const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["ADMIN", "EMPLOYEE"]),
  active: z.boolean()
});

export const titleSchema = z.object({
  creditorId: z.string().uuid(),
  debtorId: z.string().uuid(),
  amount: z.coerce.number().positive(),
  issueDate: z.string(),
  dueDate: z.string(),
  description: z.string().optional()
});
