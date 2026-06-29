import { Response, NextFunction } from 'express';
import { tituloService } from '../services/titulo.service';
import { AuthenticatedRequest } from '../middlewares/authenticate';
import { getParamId } from '../utils/params';

export class TituloController {
  async findAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await tituloService.findAll(req.query as never);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const titulo = await tituloService.findById(getParamId(req.params));
      res.json(titulo);
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const titulo = await tituloService.create(req.body, req.user!.id);
      res.status(201).json(titulo);
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const titulo = await tituloService.update(getParamId(req.params), req.body, req.user!.id);
      res.json(titulo);
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const titulo = await tituloService.updateStatus(getParamId(req.params), req.body, req.user!.id);
      res.json(titulo);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await tituloService.delete(getParamId(req.params), req.user!.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async getHistorico(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const historico = await tituloService.getHistorico(getParamId(req.params));
      res.json(historico);
    } catch (error) {
      next(error);
    }
  }

  async generatePdf(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const pdf = await tituloService.generatePdf(getParamId(req.params));
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="comprovante-${getParamId(req.params)}.pdf"`
      );
      res.send(pdf);
    } catch (error) {
      next(error);
    }
  }
}

export const tituloController = new TituloController();
