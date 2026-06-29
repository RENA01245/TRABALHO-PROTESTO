import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6)
  })
});

export const recoverPasswordSchema = z.object({
  body: z.object({
    email: z.string().email(),
    newPassword: z.string().min(8)
  })
});
