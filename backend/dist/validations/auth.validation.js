"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('E-mail inválido'),
    senha: zod_1.z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email('E-mail inválido'),
});
exports.resetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string().min(1, 'Token é obrigatório'),
    senha: zod_1.z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});
//# sourceMappingURL=auth.validation.js.map