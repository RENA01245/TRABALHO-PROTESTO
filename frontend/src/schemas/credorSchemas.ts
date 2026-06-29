import { z } from 'zod';

function validateCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, '');
  if (digits.length !== 11 || /^(\d)\1+$/.test(digits)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i);
  let rest = (sum * 10) % 11;
  if (rest === 10) rest = 0;
  if (rest !== parseInt(digits[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i);
  rest = (sum * 10) % 11;
  if (rest === 10) rest = 0;
  return rest === parseInt(digits[10]);
}

function validateCNPJ(cnpj: string): boolean {
  const digits = cnpj.replace(/\D/g, '');
  if (digits.length !== 14 || /^(\d)\1+$/.test(digits)) return false;
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += parseInt(digits[i]) * weights1[i];
  let rest = sum % 11;
  const d1 = rest < 2 ? 0 : 11 - rest;
  if (d1 !== parseInt(digits[12])) return false;
  sum = 0;
  for (let i = 0; i < 13; i++) sum += parseInt(digits[i]) * weights2[i];
  rest = sum % 11;
  const d2 = rest < 2 ? 0 : 11 - rest;
  return d2 === parseInt(digits[13]);
}

export const credorSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  tipoDocumento: z.enum(['CPF', 'CNPJ'], { required_error: 'Tipo de documento é obrigatório' }),
  documento: z.string().min(1, 'Documento é obrigatório'),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  telefone: z.string().optional(),
  endereco: z.string().optional(),
}).superRefine((data, ctx) => {
  const digits = data.documento.replace(/\D/g, '');
  if (data.tipoDocumento === 'CPF') {
    if (digits.length !== 11 || !validateCPF(digits)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'CPF inválido', path: ['documento'] });
    }
  } else {
    if (digits.length !== 14 || !validateCNPJ(digits)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'CNPJ inválido', path: ['documento'] });
    }
  }
});

export type CredorFormData = z.infer<typeof credorSchema>;
