"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const AppError_1 = require("../utils/AppError");
const env_1 = require("../config/env");
function errorHandler(error, _req, res, _next) {
    if (error instanceof AppError_1.AppError) {
        res.status(error.statusCode).json({
            status: 'error',
            message: error.message,
        });
        return;
    }
    if (error instanceof zod_1.ZodError) {
        const messages = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
        res.status(400).json({
            status: 'error',
            message: `Dados inválidos: ${messages}`,
        });
        return;
    }
    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
            const field = error.meta?.target?.join(', ') ?? 'campo';
            res.status(409).json({
                status: 'error',
                message: `Registro duplicado: ${field} já existe`,
            });
            return;
        }
        if (error.code === 'P2025') {
            res.status(404).json({
                status: 'error',
                message: 'Registro não encontrado',
            });
            return;
        }
        if (error.code === 'P2003') {
            res.status(400).json({
                status: 'error',
                message: 'Operação inválida: registro referenciado não existe',
            });
            return;
        }
    }
    console.error('Erro interno:', error);
    res.status(500).json({
        status: 'error',
        message: env_1.env.NODE_ENV === 'production' ? 'Erro interno do servidor' : error.message,
    });
}
//# sourceMappingURL=errorHandler.js.map