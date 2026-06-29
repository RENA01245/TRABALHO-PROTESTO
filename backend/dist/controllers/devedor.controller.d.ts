import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/authenticate';
export declare class DevedorController {
    findAll(_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    findById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    delete(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
}
export declare const devedorController: DevedorController;
//# sourceMappingURL=devedor.controller.d.ts.map