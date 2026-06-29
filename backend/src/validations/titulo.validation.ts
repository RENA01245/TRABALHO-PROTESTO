import { z } from 'zod';

const tituloStatusEnum = z.enum([
  'PENDENTE',
  'EM_ANALISE',
  'PROTESTADO',
  'CANCELADO',
  'RETIRADO',
  'PAGO',
]);

export const createTituloSchema = z.object({
  credorId: z.string().uuid('ID do credor inválido'),
  devedorId: z.string().uuid('ID do devedor inválido'),
  valor: z.coerce.number().positive('Valor deve ser maior que zero'),
  dataVencimento: z.coerce.date({ invalid_type_error: 'Data de vencimento inválida' }),
  dataProtesto: z.coerce.date().optional().nullable(),
  tipoTitulo: z.string().min(1, 'Tipo de título é obrigatório'),
  observacoes: z.string().optional().nullable(),
});

export const updateTituloSchema = z.object({
  credorId: z.string().uuid('ID do credor inválido').optional(),
  devedorId: z.string().uuid('ID do devedor inválido').optional(),
  valor: z.coerce.number().positive('Valor deve ser maior que zero').optional(),
  dataVencimento: z.coerce.date().optional(),
  dataProtesto: z.coerce.date().optional().nullable(),
  tipoTitulo: z.string().min(1).optional(),
  observacoes: z.string().optional().nullable(),
});

export const updateTituloStatusSchema = z.object({
  status: tituloStatusEnum,
  dataProtesto: z.coerce.date().optional().nullable(),
});

export const tituloParamsSchema = z.object({
  id: z.string().uuid('ID inválido'),
});

export const tituloFiltersSchema = z.object({
  protocolo: z.string().optional(),
  documento: z.string().optional(),
  nome: z.string().optional(),
  status: tituloStatusEnum.optional(),
  dataInicio: z.coerce.date().optional(),
  dataFim: z.coerce.date().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type CreateTituloInput = z.infer<typeof createTituloSchema>;
export type UpdateTituloInput = z.infer<typeof updateTituloSchema>;
export type UpdateTituloStatusInput = z.infer<typeof updateTituloStatusSchema>;
export type TituloFiltersInput = z.infer<typeof tituloFiltersSchema>;
