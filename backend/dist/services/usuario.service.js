"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usuarioService = exports.UsuarioService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = require("../config/database");
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
class UsuarioService {
    async findAll() {
        return database_1.prisma.usuario.findMany({
            select: usuarioSelect,
            orderBy: { nome: 'asc' },
        });
    }
    async findById(id) {
        const usuario = await database_1.prisma.usuario.findUnique({
            where: { id },
            select: usuarioSelect,
        });
        if (!usuario) {
            throw new AppError_1.AppError('Usuário não encontrado', 404);
        }
        return usuario;
    }
    async create(data) {
        const existing = await database_1.prisma.usuario.findUnique({
            where: { email: data.email },
        });
        if (existing) {
            throw new AppError_1.AppError('E-mail já cadastrado', 409);
        }
        const senhaHash = await bcrypt_1.default.hash(data.senha, 10);
        return database_1.prisma.usuario.create({
            data: {
                nome: data.nome,
                email: data.email,
                senha: senhaHash,
                role: data.role,
                ativo: data.ativo,
            },
            select: usuarioSelect,
        });
    }
    async update(id, data) {
        await this.findById(id);
        if (data.email) {
            const existing = await database_1.prisma.usuario.findFirst({
                where: { email: data.email, NOT: { id } },
            });
            if (existing) {
                throw new AppError_1.AppError('E-mail já cadastrado', 409);
            }
        }
        const updateData = { ...data };
        if (data.senha) {
            updateData.senha = await bcrypt_1.default.hash(data.senha, 10);
        }
        return database_1.prisma.usuario.update({
            where: { id },
            data: updateData,
            select: usuarioSelect,
        });
    }
    async delete(id) {
        await this.findById(id);
        await database_1.prisma.usuario.delete({ where: { id } });
    }
}
exports.UsuarioService = UsuarioService;
exports.usuarioService = new UsuarioService();
//# sourceMappingURL=usuario.service.js.map