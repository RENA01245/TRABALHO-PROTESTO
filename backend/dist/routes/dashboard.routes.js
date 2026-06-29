"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const authenticate_1 = require("../middlewares/authenticate");
const authorize_1 = require("../middlewares/authorize");
const router = (0, express_1.Router)();
router.use(authenticate_1.authenticate, (0, authorize_1.authorize)('ADMIN'));
/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     tags: [Dashboard]
 *     summary: Obter indicadores do dashboard (ADMIN)
 *     responses:
 *       200:
 *         description: Dados do dashboard
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dashboard'
 */
router.get('/', dashboard_controller_1.dashboardController.getDashboard.bind(dashboard_controller_1.dashboardController));
exports.default = router;
//# sourceMappingURL=dashboard.routes.js.map