"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usuarioParamsSchema = exports.updateUsuarioSchema = exports.createUsuarioSchema = void 0;
const zod_1 = require("zod");
exports.createUsuarioSchema = zod_1.z.object({
    nome: zod_1.z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
    email: zod_1.z.string().email('E-mail inválido'),
    senha: zod_1.z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    role: zod_1.z.enum(['ADMIN', 'FUNCIONARIO']).default('FUNCIONARIO'),
    ativo: zod_1.z.boolean().default(true),
});
exports.updateUsuarioSchema = zod_1.z.object({
    nome: zod_1.z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').optional(),
    email: zod_1.z.string().email('E-mail inválido').optional(),
    senha: zod_1.z.string().min(6, 'Senha deve ter no mínimo 6 caracteres').optional(),
    role: zod_1.z.enum(['ADMIN', 'FUNCIONARIO']).optional(),
    ativo: zod_1.z.boolean().optional(),
});
exports.usuarioParamsSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('ID inválido'),
});
//# sourceMappingURL=usuario.validation.js.map