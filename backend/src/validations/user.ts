import { Role } from "@prisma/client";
import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.nativeEnum(Role).default(Role.EMPLOYEE),
    active: z.boolean().default(true)
  })
});

export const updateUserSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    password: z.string().min(8).optional(),
    role: z.nativeEnum(Role).optional(),
    active: z.boolean().optional()
  })
});
