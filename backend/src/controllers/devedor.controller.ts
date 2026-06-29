import { Response, NextFunction } from 'express';
import { devedorService } from '../services/devedor.service';
import { AuthenticatedRequest } from '../middlewares/authenticate';
import { getParamId } from '../utils/params';

export class DevedorController {
  async findAll(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const devedores = await devedorService.findAll();
      res.json(devedores);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const devedor = await devedorService.findById(getParamId(req.params));
      res.json(devedor);
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const devedor = await devedorService.create(req.body);
      res.status(201).json(devedor);
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const devedor = await devedorService.update(getParamId(req.params), req.body);
      res.json(devedor);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await devedorService.delete(getParamId(req.params));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const devedorController = new DevedorController();
