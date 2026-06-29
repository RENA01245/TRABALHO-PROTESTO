import { Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { AuthenticatedRequest } from '../middlewares/authenticate';

export class AuthController {
  async login(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async me(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const usuario = await authService.me(req.user!.id);
      res.json(usuario);
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await authService.forgotPassword(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await authService.resetPassword(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
