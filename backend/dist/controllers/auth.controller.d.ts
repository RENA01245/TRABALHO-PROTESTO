import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/authenticate';
export declare class AuthController {
    login(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    me(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    forgotPassword(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    resetPassword(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
}
export declare const authController: AuthController;
//# sourceMappingURL=auth.controller.d.ts.map