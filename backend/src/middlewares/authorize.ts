import { Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { AuthenticatedRequest } from './authenticate';
import { AppError } from '../utils/AppError';

export function authorize(...roles: Role[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError('Usuário não autenticado', 401));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(new AppError('Acesso negado. Permissão insuficiente', 403));
      return;
    }

    next();
  };
}
