import { Response, NextFunction } from 'express';
import { credorService } from '../services/credor.service';
import { AuthenticatedRequest } from '../middlewares/authenticate';
import { getParamId } from '../utils/params';

export class CredorController {
  async findAll(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const credores = await credorService.findAll();
      res.json(credores);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const credor = await credorService.findById(getParamId(req.params));
      res.json(credor);
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const credor = await credorService.create(req.body);
      res.status(201).json(credor);
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const credor = await credorService.update(getParamId(req.params), req.body);
      res.json(credor);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await credorService.delete(getParamId(req.params));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const credorController = new CredorController();
