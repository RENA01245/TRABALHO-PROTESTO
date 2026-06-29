import { Response, NextFunction } from 'express';
import { dashboardService } from '../services/dashboard.service';
import { AuthenticatedRequest } from '../middlewares/authenticate';

export class DashboardController {
  async getDashboard(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dashboard = await dashboardService.getDashboard();
      res.json(dashboard);
    } catch (error) {
      next(error);
    }
  }
}

export const dashboardController = new DashboardController();
