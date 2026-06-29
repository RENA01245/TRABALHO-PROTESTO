import { Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { AuthenticatedRequest } from './authenticate';
export declare function authorize(...roles: Role[]): (req: AuthenticatedRequest, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=authorize.d.ts.map