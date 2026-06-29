import { Response, NextFunction } from 'express';
import { usuarioService } from '../services/usuario.service';
import { AuthenticatedRequest } from '../middlewares/authenticate';
import { getParamId } from '../utils/params';

export class UsuarioController {
  async findAll(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const usuarios = await usuarioService.findAll();
      res.json(usuarios);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const usuario = await usuarioService.findById(getParamId(req.params));
      res.json(usuario);
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const usuario = await usuarioService.create(req.body);
      res.status(201).json(usuario);
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const usuario = await usuarioService.update(getParamId(req.params), req.body);
      res.json(usuario);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await usuarioService.delete(getParamId(req.params));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const usuarioController = new UsuarioController();
