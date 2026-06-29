"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.credorService = exports.CredorService = void 0;
const database_1 = require("../config/database");
const AppError_1 = require("../utils/AppError");
function formatDocumento(documento) {
    return documento.replace(/\D/g, '');
}
class CredorService {
    async findAll() {
        return database_1.prisma.credor.findMany({ orderBy: { nome: 'asc' } });
    }
    async findById(id) {
        const credor = await database_1.prisma.credor.findUnique({ where: { id } });
        if (!credor) {
            throw new AppError_1.AppError('Credor não encontrado', 404);
        }
        return credor;
    }
    async create(data) {
        const documento = formatDocumento(data.documento);
        const existing = await database_1.prisma.credor.findUnique({ where: { documento } });
        if (existing) {
            throw new AppError_1.AppError('Documento já cadastrado', 409);
        }
        return database_1.prisma.credor.create({
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
            const existing = await database_1.prisma.credor.findFirst({
                where: { documento, NOT: { id } },
            });
            if (existing) {
                throw new AppError_1.AppError('Documento já cadastrado', 409);
            }
            updateData.documento = documento;
        }
        return database_1.prisma.credor.update({
            where: { id },
            data: updateData,
        });
    }
    async delete(id) {
        const titulosCount = await database_1.prisma.titulo.count({ where: { credorId: id } });
        if (titulosCount > 0) {
            throw new AppError_1.AppError('Não é possível excluir credor com títulos vinculados', 400);
        }
        await database_1.prisma.credor.delete({ where: { id } });
    }
}
exports.CredorService = CredorService;
exports.credorService = new CredorService();
//# sourceMappingURL=credor.service.js.map