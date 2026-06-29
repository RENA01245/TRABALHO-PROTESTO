"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tituloService = exports.TituloService = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const database_1 = require("../config/database");
const AppError_1 = require("../utils/AppError");
const generateProtocolo_1 = require("../utils/generateProtocolo");
const tituloInclude = {
    credor: true,
    devedor: true,
};
class TituloService {
    async findAll(filters) {
        const { page, limit, protocolo, documento, nome, status, dataInicio, dataFim } = filters;
        const skip = (page - 1) * limit;
        const where = {};
        if (protocolo) {
            where.protocolo = { contains: protocolo, mode: 'insensitive' };
        }
        if (status) {
            where.status = status;
        }
        if (dataInicio || dataFim) {
            where.createdAt = {};
            if (dataInicio)
                where.createdAt.gte = dataInicio;
            if (dataFim) {
                const fim = new Date(dataFim);
                fim.setHours(23, 59, 59, 999);
                where.createdAt.lte = fim;
            }
        }
        if (documento || nome) {
            where.OR = [];
            if (documento) {
                const doc = documento.replace(/\D/g, '');
                where.OR.push({ credor: { documento: { contains: doc } } }, { devedor: { documento: { contains: doc } } });
            }
            if (nome) {
                where.OR.push({ credor: { nome: { contains: nome, mode: 'insensitive' } } }, { devedor: { nome: { contains: nome, mode: 'insensitive' } } });
            }
        }
        const [titulos, total] = await Promise.all([
            database_1.prisma.titulo.findMany({
                where,
                include: tituloInclude,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            database_1.prisma.titulo.count({ where }),
        ]);
        return {
            data: titulos.map((t) => this.formatTitulo(t)),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findById(id) {
        const titulo = await database_1.prisma.titulo.findUnique({
            where: { id },
            include: tituloInclude,
        });
        if (!titulo) {
            throw new AppError_1.AppError('Título não encontrado', 404);
        }
        return this.formatTitulo(titulo);
    }
    async create(data, usuarioId) {
        const [credor, devedor] = await Promise.all([
            database_1.prisma.credor.findUnique({ where: { id: data.credorId } }),
            database_1.prisma.devedor.findUnique({ where: { id: data.devedorId } }),
        ]);
        if (!credor)
            throw new AppError_1.AppError('Credor não encontrado', 404);
        if (!devedor)
            throw new AppError_1.AppError('Devedor não encontrado', 404);
        const protocolo = await (0, generateProtocolo_1.generateProtocolo)();
        const titulo = await database_1.prisma.$transaction(async (tx) => {
            const created = await tx.titulo.create({
                data: {
                    protocolo,
                    credorId: data.credorId,
                    devedorId: data.devedorId,
                    valor: data.valor,
                    dataVencimento: data.dataVencimento,
                    dataProtesto: data.dataProtesto ?? null,
                    tipoTitulo: data.tipoTitulo,
                    observacoes: data.observacoes ?? null,
                    status: 'PENDENTE',
                },
                include: tituloInclude,
            });
            await tx.historicoTitulo.create({
                data: {
                    tituloId: created.id,
                    usuarioId,
                    acao: 'CREATE',
                    campo: null,
                    valorAnterior: null,
                    valorNovo: `Protocolo ${protocolo} criado com status PENDENTE`,
                },
            });
            return created;
        });
        return this.formatTitulo(titulo);
    }
    async update(id, data, usuarioId) {
        const tituloAtual = await database_1.prisma.titulo.findUnique({ where: { id } });
        if (!tituloAtual) {
            throw new AppError_1.AppError('Título não encontrado', 404);
        }
        if (data.credorId) {
            const credor = await database_1.prisma.credor.findUnique({ where: { id: data.credorId } });
            if (!credor)
                throw new AppError_1.AppError('Credor não encontrado', 404);
        }
        if (data.devedorId) {
            const devedor = await database_1.prisma.devedor.findUnique({ where: { id: data.devedorId } });
            if (!devedor)
                throw new AppError_1.AppError('Devedor não encontrado', 404);
        }
        const titulo = await database_1.prisma.$transaction(async (tx) => {
            const updated = await tx.titulo.update({
                where: { id },
                data,
                include: tituloInclude,
            });
            const camposAlterados = Object.keys(data);
            for (const campo of camposAlterados) {
                const valorAnterior = String(tituloAtual[campo] ?? '');
                const valorNovo = String(data[campo] ?? '');
                if (valorAnterior !== valorNovo) {
                    await tx.historicoTitulo.create({
                        data: {
                            tituloId: id,
                            usuarioId,
                            acao: 'UPDATE',
                            campo,
                            valorAnterior,
                            valorNovo,
                        },
                    });
                }
            }
            return updated;
        });
        return this.formatTitulo(titulo);
    }
    async updateStatus(id, data, usuarioId) {
        const tituloAtual = await database_1.prisma.titulo.findUnique({ where: { id } });
        if (!tituloAtual) {
            throw new AppError_1.AppError('Título não encontrado', 404);
        }
        const updateData = {
            status: data.status,
        };
        if (data.status === 'PROTESTADO' && data.dataProtesto) {
            updateData.dataProtesto = data.dataProtesto;
        }
        else if (data.status === 'PROTESTADO' && !tituloAtual.dataProtesto) {
            updateData.dataProtesto = new Date();
        }
        const titulo = await database_1.prisma.$transaction(async (tx) => {
            const updated = await tx.titulo.update({
                where: { id },
                data: updateData,
                include: tituloInclude,
            });
            await tx.historicoTitulo.create({
                data: {
                    tituloId: id,
                    usuarioId,
                    acao: 'STATUS_CHANGE',
                    campo: 'status',
                    valorAnterior: tituloAtual.status,
                    valorNovo: data.status,
                },
            });
            return updated;
        });
        return this.formatTitulo(titulo);
    }
    async delete(id, usuarioId) {
        const titulo = await database_1.prisma.titulo.findUnique({ where: { id } });
        if (!titulo) {
            throw new AppError_1.AppError('Título não encontrado', 404);
        }
        await database_1.prisma.$transaction(async (tx) => {
            await tx.historicoTitulo.create({
                data: {
                    tituloId: id,
                    usuarioId,
                    acao: 'DELETE',
                    campo: null,
                    valorAnterior: titulo.protocolo,
                    valorNovo: null,
                },
            });
            await tx.titulo.delete({ where: { id } });
        });
    }
    async getHistorico(id) {
        const titulo = await database_1.prisma.titulo.findUnique({ where: { id } });
        if (!titulo) {
            throw new AppError_1.AppError('Título não encontrado', 404);
        }
        return database_1.prisma.historicoTitulo.findMany({
            where: { tituloId: id },
            include: {
                usuario: {
                    select: { id: true, nome: true, email: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async generatePdf(id) {
        const titulo = await database_1.prisma.titulo.findUnique({
            where: { id },
            include: tituloInclude,
        });
        if (!titulo) {
            throw new AppError_1.AppError('Título não encontrado', 404);
        }
        return new Promise((resolve, reject) => {
            const doc = new pdfkit_1.default({ margin: 50 });
            const chunks = [];
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);
            doc.fontSize(18).text('Comprovante de Protesto de Título', { align: 'center' });
            doc.moveDown();
            doc.fontSize(10).text(`Emitido em: ${new Date().toLocaleString('pt-BR')}`, { align: 'center' });
            doc.moveDown(2);
            doc.fontSize(12).text('Dados do Protocolo', { underline: true });
            doc.moveDown(0.5);
            doc.fontSize(10);
            doc.text(`Protocolo: ${titulo.protocolo}`);
            doc.text(`Status: ${titulo.status}`);
            doc.text(`Tipo de Título: ${titulo.tipoTitulo}`);
            doc.text(`Valor: R$ ${Number(titulo.valor).toFixed(2)}`);
            doc.text(`Data de Vencimento: ${titulo.dataVencimento.toLocaleDateString('pt-BR')}`);
            if (titulo.dataProtesto) {
                doc.text(`Data de Protesto: ${titulo.dataProtesto.toLocaleDateString('pt-BR')}`);
            }
            doc.moveDown();
            doc.fontSize(12).text('Credor', { underline: true });
            doc.moveDown(0.5);
            doc.fontSize(10);
            doc.text(`Nome: ${titulo.credor.nome}`);
            doc.text(`Documento: ${this.formatDocumentoDisplay(titulo.credor.documento, titulo.credor.tipoDocumento)}`);
            if (titulo.credor.email)
                doc.text(`E-mail: ${titulo.credor.email}`);
            doc.moveDown();
            doc.fontSize(12).text('Devedor', { underline: true });
            doc.moveDown(0.5);
            doc.fontSize(10);
            doc.text(`Nome: ${titulo.devedor.nome}`);
            doc.text(`Documento: ${this.formatDocumentoDisplay(titulo.devedor.documento, titulo.devedor.tipoDocumento)}`);
            if (titulo.devedor.email)
                doc.text(`E-mail: ${titulo.devedor.email}`);
            doc.moveDown();
            if (titulo.observacoes) {
                doc.fontSize(12).text('Observações', { underline: true });
                doc.moveDown(0.5);
                doc.fontSize(10).text(titulo.observacoes);
            }
            doc.end();
        });
    }
    formatDocumentoDisplay(documento, tipo) {
        if (tipo === 'CPF' && documento.length === 11) {
            return documento.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        }
        if (tipo === 'CNPJ' && documento.length === 14) {
            return documento.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        }
        return documento;
    }
    formatTitulo(titulo) {
        return {
            ...titulo,
            valor: Number(titulo.valor),
        };
    }
}
exports.TituloService = TituloService;
exports.tituloService = new TituloService();
//# sourceMappingURL=titulo.service.js.map