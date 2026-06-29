import { z } from 'zod';

export const usuarioSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres').optional().or(z.literal('')),
  role: z.enum(['ADMIN', 'FUNCIONARIO'], { required_error: 'Perfil é obrigatório' }),
  ativo: z.boolean().default(true),
});

export const usuarioCreateSchema = usuarioSchema.extend({
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export type UsuarioFormData = z.infer<typeof usuarioSchema>;
export type UsuarioCreateFormData = z.infer<typeof usuarioCreateSchema>;
