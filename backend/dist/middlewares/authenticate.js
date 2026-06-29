"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const database_1 = require("../config/database");
const AppError_1 = require("../utils/AppError");
async function authenticate(req, _res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError_1.AppError('Token de autenticação não fornecido', 401);
        }
        const token = authHeader.split(' ')[1];
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        }
        catch {
            throw new AppError_1.AppError('Token inválido ou expirado', 401);
        }
        const usuario = await database_1.prisma.usuario.findUnique({
            where: { id: decoded.sub },
            select: { id: true, email: true, role: true, nome: true, ativo: true },
        });
        if (!usuario || !usuario.ativo) {
            throw new AppError_1.AppError('Usuário não encontrado ou inativo', 401);
        }
        req.user = {
            id: usuario.id,
            email: usuario.email,
            role: usuario.role,
            nome: usuario.nome,
        };
        next();
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=authenticate.js.map