"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.devedorService = exports.DevedorService = void 0;
const database_1 = require("../config/database");
const AppError_1 = require("../utils/AppError");
function formatDocumento(documento) {
    return documento.replace(/\D/g, '');
}
class DevedorService {
    async findAll() {
        return database_1.prisma.devedor.findMany({ orderBy: { nome: 'asc' } });
    }
    async findById(id) {
        const devedor = await database_1.prisma.devedor.findUnique({ where: { id } });
        if (!devedor) {
            throw new AppError_1.AppError('Devedor não encontrado', 404);
        }
        return devedor;
    }
    async create(data) {
        const documento = formatDocumento(data.documento);
        const existing = await database_1.prisma.devedor.findUnique({ where: { documento } });
        if (existing) {
            throw new AppError_1.AppError('Documento já cadastrado', 409);
        }
        return database_1.prisma.devedor.create({
            data: {
                nome: data.nome,
                documento,
                tipoDocumento: data.tipoDocumento,
                email: data.email ?? null,
                telefone: data.telefone ?? null,
                endereco: data.endereco ?? null,
            },
        });
    }
    async update(id, data) {
        await this.findById(id);
        const updateData = { ...data };
        if (data.documento) {
            const documento = formatDocumento(data.documento);
            const existing = await database_1.prisma.devedor.findFirst({
                where: { documento, NOT: { id } },
            });
            if (existing) {
                throw new AppError_1.AppError('Documento já cadastrado', 409);
            }
            updateData.documento = documento;
        }
        return database_1.prisma.devedor.update({
            where: { id },
            data: updateData,
        });
    }
    async delete(id) {
        const titulosCount = await database_1.prisma.titulo.count({ where: { devedorId: id } });
        if (titulosCount > 0) {
            throw new AppError_1.AppError('Não é possível excluir devedor com títulos vinculados', 400);
        }
        await database_1.prisma.devedor.delete({ where: { id } });
    }
}
exports.DevedorService = DevedorService;
exports.devedorService = new DevedorService();
//# sourceMappingURL=devedor.service.js.map