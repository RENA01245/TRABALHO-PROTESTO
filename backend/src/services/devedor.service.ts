import { prisma } from '../config/database';
import { AppError } from '../utils/AppError';
import { CreateDevedorInput, UpdateDevedorInput } from '../validations/devedor.validation';

function formatDocumento(documento: string): string {
  return documento.replace(/\D/g, '');
}

export class DevedorService {
  async findAll() {
    return prisma.devedor.findMany({ orderBy: { nome: 'asc' } });
  }

  async findById(id: string) {
    const devedor = await prisma.devedor.findUnique({ where: { id } });
    if (!devedor) {
      throw new AppError('Devedor não encontrado', 404);
    }
    return devedor;
  }

  async create(data: CreateDevedorInput) {
    const documento = formatDocumento(data.documento);

    const existing = await prisma.devedor.findUnique({ where: { documento } });
    if (existing) {
      throw new AppError('Documento já cadastrado', 409);
    }

    return prisma.devedor.create({
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

  async update(id: string, data: UpdateDevedorInput) {
    await this.findById(id);

    const updateData: Record<string, unknown> = { ...data };

    if (data.documento) {
      const documento = formatDocumento(data.documento);
      const existing = await prisma.devedor.findFirst({
        where: { documento, NOT: { id } },
      });
      if (existing) {
        throw new AppError('Documento já cadastrado', 409);
      }
      updateData.documento = documento;
    }

    return prisma.devedor.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string) {
    const titulosCount = await prisma.titulo.count({ where: { devedorId: id } });
    if (titulosCount > 0) {
      throw new AppError('Não é possível excluir devedor com títulos vinculados', 400);
    }
    await prisma.devedor.delete({ where: { id } });
  }
}

export const devedorService = new DevedorService();
