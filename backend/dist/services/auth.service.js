"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const database_1 = require("../config/database");
const env_1 = require("../config/env");
const AppError_1 = require("../utils/AppError");
const usuarioSelect = {
    id: true,
    nome: true,
    email: true,
    role: true,
    ativo: true,
    createdAt: true,
    updatedAt: true,
};
class AuthService {
    async login(data) {
        const usuario = await database_1.prisma.usuario.findUnique({
            where: { email: data.email },
        });
        if (!usuario) {
            throw new AppError_1.AppError('E-mail ou senha incorretos', 401);
        }
        if (!usuario.ativo) {
            throw new AppError_1.AppError('Usuário inativo. Entre em contato com o administrador', 401);
        }
        const senhaValida = await bcrypt_1.default.compare(data.senha, usuario.senha);
        if (!senhaValida) {
            throw new AppError_1.AppError('E-mail ou senha incorretos', 401);
        }
        const token = jsonwebtoken_1.default.sign({ sub: usuario.id, email: usuario.email, role: usuario.role }, env_1.env.JWT_SECRET, { expiresIn: env_1.env.JWT_EXPIRES_IN });
        const { senha: _, ...usuarioSemSenha } = usuario;
        return { token, usuario: usuarioSemSenha };
    }
    async me(userId) {
        const usuario = await database_1.prisma.usuario.findUnique({
            where: { id: userId },
            select: usuarioSelect,
        });
        if (!usuario) {
            throw new AppError_1.AppError('Usuário não encontrado', 404);
        }
        return usuario;
    }
    async forgotPassword(data) {
        const usuario = await database_1.prisma.usuario.findUnique({
            where: { email: data.email },
        });
        if (!usuario) {
            return {
                message: 'Se o e-mail estiver cadastrado, um token de recuperação será gerado',
            };
        }
        const token = crypto_1.default.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
        await database_1.prisma.passwordResetToken.updateMany({
            where: { usuarioId: usuario.id, used: false },
            data: { used: true },
        });
        await database_1.prisma.passwordResetToken.create({
            data: {
                usuarioId: usuario.id,
                token,
                expiresAt,
            },
        });
        return {
            message: 'Token de recuperação gerado com sucesso',
            token,
            expiresAt,
        };
    }
    async resetPassword(data) {
        const resetToken = await database_1.prisma.passwordResetToken.findUnique({
            where: { token: data.token },
            include: { usuario: true },
        });
        if (!resetToken || resetToken.used) {
            throw new AppError_1.AppError('Token inválido ou já utilizado', 400);
        }
        if (resetToken.expiresAt < new Date()) {
            throw new AppError_1.AppError('Token expirado. Solicite um novo token de recuperação', 400);
        }
        const senhaHash = await bcrypt_1.default.hash(data.senha, 10);
        await database_1.prisma.$transaction([
            database_1.prisma.usuario.update({
                where: { id: resetToken.usuarioId },
                data: { senha: senhaHash },
            }),
            database_1.prisma.passwordResetToken.update({
                where: { id: resetToken.id },
                data: { used: true },
            }),
        ]);
        return { message: 'Senha redefinida com sucesso' };
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
//# sourceMappingURL=auth.service.js.map