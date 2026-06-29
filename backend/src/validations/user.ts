import { z } from "zod";

const userRoles = ["ADMIN", "EMPLOYEE"] as const;

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(userRoles).default("EMPLOYEE"),
    active: z.boolean().default(true)
  })
});

export const updateUserSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    password: z.string().min(8).optional(),
    role: z.enum(userRoles).optional(),
    active: z.boolean().optional()
  })
});
