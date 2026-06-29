import bcrypt from 'bcrypt';
import { prisma } from '../config/database';
import { AppError } from '../utils/AppError';
import { CreateUsuarioInput, UpdateUsuarioInput } from '../validations/usuario.validation';

const usuarioSelect = {
  id: true,
  nome: true,
  email: true,
  role: true,
  ativo: true,
  createdAt: true,
  updatedAt: true,
};

export class UsuarioService {
  async findAll() {
    return prisma.usuario.findMany({
      select: usuarioSelect,
      orderBy: { nome: 'asc' },
    });
  }

  async findById(id: string) {
    const usuario = await prisma.usuario.findUnique({
      where: { id },
      select: usuarioSelect,
    });

    if (!usuario) {
      throw new AppError('Usuário não encontrado', 404);
    }

    return usuario;
  }

  async create(data: CreateUsuarioInput) {
    const existing = await prisma.usuario.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new AppError('E-mail já cadastrado', 409);
    }

    const senhaHash = await bcrypt.hash(data.senha, 10);

    return prisma.usuario.create({
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

  async update(id: string, data: UpdateUsuarioInput) {
    await this.findById(id);

    if (data.email) {
      const existing = await prisma.usuario.findFirst({
        where: { email: data.email, NOT: { id } },
      });
      if (existing) {
        throw new AppError('E-mail já cadastrado', 409);
      }
    }

    const updateData: Record<string, unknown> = { ...data };
    if (data.senha) {
      updateData.senha = await bcrypt.hash(data.senha, 10);
    }

    return prisma.usuario.update({
      where: { id },
      data: updateData,
      select: usuarioSelect,
    });
  }

  async delete(id: string) {
    await this.findById(id);
    await prisma.usuario.delete({ where: { id } });
  }
}

export const usuarioService = new UsuarioService();
