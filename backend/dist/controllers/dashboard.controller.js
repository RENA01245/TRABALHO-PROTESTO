"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardController = exports.DashboardController = void 0;
const dashboard_service_1 = require("../services/dashboard.service");
class DashboardController {
    async getDashboard(_req, res, next) {
        try {
            const dashboard = await dashboard_service_1.dashboardService.getDashboard();
            res.json(dashboard);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.DashboardController = DashboardController;
exports.dashboardController = new DashboardController();
//# sourceMappingURL=dashboard.controller.js.map