import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';

const router = Router();

router.use(authenticate, authorize('ADMIN'));

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
router.get('/', dashboardController.getDashboard.bind(dashboardController));

export default router;
