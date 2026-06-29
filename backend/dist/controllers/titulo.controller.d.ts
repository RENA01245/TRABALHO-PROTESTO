import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/authenticate';
export declare class TituloController {
    findAll(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    findById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    updateStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    delete(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    getHistorico(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    generatePdf(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
}
export declare const tituloController: TituloController;
//# sourceMappingURL=titulo.controller.d.ts.map