import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
export interface JwtPayload {
    sub: string;
    email: string;
    role: Role;
}
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: Role;
        nome: string;
    };
}
export declare function authenticate(req: AuthenticatedRequest, _res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=authenticate.d.ts.map