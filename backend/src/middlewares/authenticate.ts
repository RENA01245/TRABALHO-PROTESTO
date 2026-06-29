import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { env } from '../config/env';
import { prisma } from '../config/database';
import { AppError } from '../utils/AppError';

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: Role;
    nome: string;
  };
}

export async function authenticate(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Token de autenticação não fornecido', 401);
    }

    const token = authHeader.split(' ')[1];

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    } catch {
      throw new AppError('Token inválido ou expirado', 401);
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.sub },
      select: { id: true, email: true, role: true, nome: true, ativo: true },
    });

    if (!usuario || !usuario.ativo) {
      throw new AppError('Usuário não encontrado ou inativo', 401);
    }

    req.user = {
      id: usuario.id,
      email: usuario.email,
      role: usuario.role,
      nome: usuario.nome,
    };

    next();
  } catch (error) {
    next(error);
  }
}
