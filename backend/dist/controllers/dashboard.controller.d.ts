import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/authenticate';
export declare class DashboardController {
    getDashboard(_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
}
export declare const dashboardController: DashboardController;
//# sourceMappingURL=dashboard.controller.d.ts.map