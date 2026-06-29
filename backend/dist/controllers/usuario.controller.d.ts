import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/authenticate';
export declare class UsuarioController {
    findAll(_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    findById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    delete(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
}
export declare const usuarioController: UsuarioController;
//# sourceMappingURL=usuario.controller.d.ts.map