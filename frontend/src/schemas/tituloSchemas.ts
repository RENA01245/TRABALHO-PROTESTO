import { z } from 'zod';

export const tituloSchema = z.object({
  credorId: z.string().min(1, 'Credor é obrigatório'),
  devedorId: z.string().min(1, 'Devedor é obrigatório'),
  valor: z.coerce.number({ invalid_type_error: 'Valor inválido' }).positive('Valor deve ser maior que zero'),
  dataVencimento: z.string().min(1, 'Data de vencimento é obrigatória'),
  tipoTitulo: z.string().min(1, 'Tipo de título é obrigatório'),
  observacoes: z.string().optional(),
});

export const statusChangeSchema = z.object({
  status: z.enum(['PENDENTE', 'EM_ANALISE', 'PROTESTADO', 'CANCELADO', 'RETIRADO', 'PAGO'], {
    required_error: 'Status é obrigatório',
  }),
});

export type TituloFormData = z.infer<typeof tituloSchema>;
export type StatusChangeFormData = z.infer<typeof statusChangeSchema>;
