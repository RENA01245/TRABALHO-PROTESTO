import { z } from 'zod';

export const createUsuarioSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  role: z.enum(['ADMIN', 'FUNCIONARIO']).default('FUNCIONARIO'),
  ativo: z.boolean().default(true),
});

export const updateUsuarioSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').optional(),
  email: z.string().email('E-mail inválido').optional(),
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres').optional(),
  role: z.enum(['ADMIN', 'FUNCIONARIO']).optional(),
  ativo: z.boolean().optional(),
});

export const usuarioParamsSchema = z.object({
  id: z.string().uuid('ID inválido'),
});

export type CreateUsuarioInput = z.infer<typeof createUsuarioSchema>;
export type UpdateUsuarioInput = z.infer<typeof updateUsuarioSchema>;
