import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/authenticate';
export declare class CredorController {
    findAll(_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    findById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    delete(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
}
export declare const credorController: CredorController;
//# sourceMappingURL=credor.controller.d.ts.map