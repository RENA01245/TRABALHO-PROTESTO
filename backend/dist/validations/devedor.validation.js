"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.devedorParamsSchema = exports.updateDevedorSchema = exports.createDevedorSchema = void 0;
const zod_1 = require("zod");
const validateCPF_1 = require("../utils/validateCPF");
const validateCNPJ_1 = require("../utils/validateCNPJ");
function validateDocumento(documento, tipoDocumento, ctx, path = ['documento']) {
    const cleaned = documento.replace(/\D/g, '');
    if (tipoDocumento === 'CPF' && !(0, validateCPF_1.validateCPF)(cleaned)) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: 'CPF inválido',
            path,
        });
    }
    if (tipoDocumento === 'CNPJ' && !(0, validateCNPJ_1.validateCNPJ)(cleaned)) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: 'CNPJ inválido',
            path,
        });
    }
}
exports.createDevedorSchema = zod_1.z
    .object({
    nome: zod_1.z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
    documento: zod_1.z.string().min(1, 'Documento é obrigatório'),
    tipoDocumento: zod_1.z.enum(['CPF', 'CNPJ']),
    email: zod_1.z.string().email('E-mail inválido').optional().nullable(),
    telefone: zod_1.z.string().optional().nullable(),
    endereco: zod_1.z.string().optional().nullable(),
})
    .superRefine((data, ctx) => {
    validateDocumento(data.documento, data.tipoDocumento, ctx);
});
exports.updateDevedorSchema = zod_1.z
    .object({
    nome: zod_1.z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').optional(),
    documento: zod_1.z.string().min(1).optional(),
    tipoDocumento: zod_1.z.enum(['CPF', 'CNPJ']).optional(),
    email: zod_1.z.string().email('E-mail inválido').optional().nullable(),
    telefone: zod_1.z.string().optional().nullable(),
    endereco: zod_1.z.string().optional().nullable(),
})
    .superRefine((data, ctx) => {
    if (data.documento && data.tipoDocumento) {
        validateDocumento(data.documento, data.tipoDocumento, ctx);
    }
});
exports.devedorParamsSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('ID inválido'),
});
//# sourceMappingURL=devedor.validation.js.map