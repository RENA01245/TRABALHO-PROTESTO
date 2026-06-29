import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from '../utils/AppError';

type ValidationTarget = 'body' | 'query' | 'params';

export function validate(schema: ZodSchema, target: ValidationTarget = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const source = req[target] as unknown;
      const parsed = schema.parse(source);

      if (target === 'body') {
        Object.assign(req.body, parsed);
      } else if (target === 'query') {
        Object.assign(req.query as object, parsed);
      } else {
        Object.assign(req.params as object, parsed);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
        next(new AppError(`Dados inválidos: ${messages}`, 400));
        return;
      }
      next(error);
    }
  };
}
