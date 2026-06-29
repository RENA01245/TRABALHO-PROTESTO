"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tituloFiltersSchema = exports.tituloParamsSchema = exports.updateTituloStatusSchema = exports.updateTituloSchema = exports.createTituloSchema = void 0;
const zod_1 = require("zod");
const tituloStatusEnum = zod_1.z.enum([
    'PENDENTE',
    'EM_ANALISE',
    'PROTESTADO',
    'CANCELADO',
    'RETIRADO',
    'PAGO',
]);
exports.createTituloSchema = zod_1.z.object({
    credorId: zod_1.z.string().uuid('ID do credor inválido'),
    devedorId: zod_1.z.string().uuid('ID do devedor inválido'),
    valor: zod_1.z.coerce.number().positive('Valor deve ser maior que zero'),
    dataVencimento: zod_1.z.coerce.date({ invalid_type_error: 'Data de vencimento inválida' }),
    dataProtesto: zod_1.z.coerce.date().optional().nullable(),
    tipoTitulo: zod_1.z.string().min(1, 'Tipo de título é obrigatório'),
    observacoes: zod_1.z.string().optional().nullable(),
});
exports.updateTituloSchema = zod_1.z.object({
    credorId: zod_1.z.string().uuid('ID do credor inválido').optional(),
    devedorId: zod_1.z.string().uuid('ID do devedor inválido').optional(),
    valor: zod_1.z.coerce.number().positive('Valor deve ser maior que zero').optional(),
    dataVencimento: zod_1.z.coerce.date().optional(),
    dataProtesto: zod_1.z.coerce.date().optional().nullable(),
    tipoTitulo: zod_1.z.string().min(1).optional(),
    observacoes: zod_1.z.string().optional().nullable(),
});
exports.updateTituloStatusSchema = zod_1.z.object({
    status: tituloStatusEnum,
    dataProtesto: zod_1.z.coerce.date().optional().nullable(),
});
exports.tituloParamsSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('ID inválido'),
});
exports.tituloFiltersSchema = zod_1.z.object({
    protocolo: zod_1.z.string().optional(),
    documento: zod_1.z.string().optional(),
    nome: zod_1.z.string().optional(),
    status: tituloStatusEnum.optional(),
    dataInicio: zod_1.z.coerce.date().optional(),
    dataFim: zod_1.z.coerce.date().optional(),
    page: zod_1.z.coerce.number().int().positive().default(1),
    limit: zod_1.z.coerce.number().int().positive().max(100).default(20),
});
//# sourceMappingURL=titulo.validation.js.map