import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
    return;
  }

  if (error instanceof ZodError) {
    const messages = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
    res.status(400).json({
      status: 'error',
      message: `Dados inválidos: ${messages}`,
    });
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      const field = (error.meta?.target as string[])?.join(', ') ?? 'campo';
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
    message: env.NODE_ENV === 'production' ? 'Erro interno do servidor' : error.message,
  });
}
