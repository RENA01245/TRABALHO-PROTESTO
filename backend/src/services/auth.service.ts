import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../config/database';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';
import {
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from '../validations/auth.validation';

const usuarioSelect = {
  id: true,
  nome: true,
  email: true,
  role: true,
  ativo: true,
  createdAt: true,
  updatedAt: true,
};

export class AuthService {
  async login(data: LoginInput) {
    const usuario = await prisma.usuario.findUnique({
      where: { email: data.email },
    });

    if (!usuario) {
      throw new AppError('E-mail ou senha incorretos', 401);
    }

    if (!usuario.ativo) {
      throw new AppError('Usuário inativo. Entre em contato com o administrador', 401);
    }

    const senhaValida = await bcrypt.compare(data.senha, usuario.senha);
    if (!senhaValida) {
      throw new AppError('E-mail ou senha incorretos', 401);
    }

    const token = jwt.sign(
      { sub: usuario.id, email: usuario.email, role: usuario.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions
    );

    const { senha: _, ...usuarioSemSenha } = usuario;

    return { token, usuario: usuarioSemSenha };
  }

  async me(userId: string) {
    const usuario = await prisma.usuario.findUnique({
      where: { id: userId },
      select: usuarioSelect,
    });

    if (!usuario) {
      throw new AppError('Usuário não encontrado', 404);
    }

    return usuario;
  }

  async forgotPassword(data: ForgotPasswordInput) {
    const usuario = await prisma.usuario.findUnique({
      where: { email: data.email },
    });

    if (!usuario) {
      return {
        message: 'Se o e-mail estiver cadastrado, um token de recuperação será gerado',
      };
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.passwordResetToken.updateMany({
      where: { usuarioId: usuario.id, used: false },
      data: { used: true },
    });

    await prisma.passwordResetToken.create({
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

  async resetPassword(data: ResetPasswordInput) {
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token: data.token },
      include: { usuario: true },
    });

    if (!resetToken || resetToken.used) {
      throw new AppError('Token inválido ou já utilizado', 400);
    }

    if (resetToken.expiresAt < new Date()) {
      throw new AppError('Token expirado. Solicite um novo token de recuperação', 400);
    }

    const senhaHash = await bcrypt.hash(data.senha, 10);

    await prisma.$transaction([
      prisma.usuario.update({
        where: { id: resetToken.usuarioId },
        data: { senha: senhaHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used: true },
      }),
    ]);

    return { message: 'Senha redefinida com sucesso' };
  }
}

export const authService = new AuthService();
