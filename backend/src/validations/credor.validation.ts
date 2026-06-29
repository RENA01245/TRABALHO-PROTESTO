import { z } from 'zod';
import { validateCPF } from '../utils/validateCPF';
import { validateCNPJ } from '../utils/validateCNPJ';

function validateDocumento(
  documento: string,
  tipoDocumento: 'CPF' | 'CNPJ',
  ctx: z.RefinementCtx,
  path: string[] = ['documento']
) {
  const cleaned = documento.replace(/\D/g, '');
  if (tipoDocumento === 'CPF' && !validateCPF(cleaned)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'CPF inválido',
      path,
    });
  }
  if (tipoDocumento === 'CNPJ' && !validateCNPJ(cleaned)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'CNPJ inválido',
      path,
    });
  }
}

export const createCredorSchema = z
  .object({
    nome: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
    documento: z.string().min(1, 'Documento é obrigatório'),
    tipoDocumento: z.enum(['CPF', 'CNPJ']),
    email: z.string().email('E-mail inválido').optional().nullable(),
    telefone: z.string().optional().nullable(),
    endereco: z.string().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    validateDocumento(data.documento, data.tipoDocumento, ctx);
  });

export const updateCredorSchema = z
  .object({
    nome: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').optional(),
    documento: z.string().min(1).optional(),
    tipoDocumento: z.enum(['CPF', 'CNPJ']).optional(),
    email: z.string().email('E-mail inválido').optional().nullable(),
    telefone: z.string().optional().nullable(),
    endereco: z.string().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.documento && data.tipoDocumento) {
      validateDocumento(data.documento, data.tipoDocumento, ctx);
    }
  });

export const credorParamsSchema = z.object({
  id: z.string().uuid('ID inválido'),
});

export type CreateCredorInput = z.infer<typeof createCredorSchema>;
export type UpdateCredorInput = z.infer<typeof updateCredorSchema>;
