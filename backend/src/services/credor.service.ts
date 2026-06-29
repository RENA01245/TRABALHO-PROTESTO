import { prisma } from '../config/database';
import { AppError } from '../utils/AppError';
import { CreateCredorInput, UpdateCredorInput } from '../validations/credor.validation';

function formatDocumento(documento: string): string {
  return documento.replace(/\D/g, '');
}

export class CredorService {
  async findAll() {
    return prisma.credor.findMany({ orderBy: { nome: 'asc' } });
  }

  async findById(id: string) {
    const credor = await prisma.credor.findUnique({ where: { id } });
    if (!credor) {
      throw new AppError('Credor não encontrado', 404);
    }
    return credor;
  }

  async create(data: CreateCredorInput) {
    const documento = formatDocumento(data.documento);

    const existing = await prisma.credor.findUnique({ where: { documento } });
    if (existing) {
      throw new AppError('Documento já cadastrado', 409);
    }

    return prisma.credor.create({
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

  async update(id: string, data: UpdateCredorInput) {
    await this.findById(id);

    const updateData: Record<string, unknown> = { ...data };

    if (data.documento) {
      const documento = formatDocumento(data.documento);
      const existing = await prisma.credor.findFirst({
        where: { documento, NOT: { id } },
      });
      if (existing) {
        throw new AppError('Documento já cadastrado', 409);
      }
      updateData.documento = documento;
    }

    return prisma.credor.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string) {
    const titulosCount = await prisma.titulo.count({ where: { credorId: id } });
    if (titulosCount > 0) {
      throw new AppError('Não é possível excluir credor com títulos vinculados', 400);
    }
    await prisma.credor.delete({ where: { id } });
  }
}

export const credorService = new CredorService();
