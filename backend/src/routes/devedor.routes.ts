import { Router } from 'express';
import { devedorController } from '../controllers/devedor.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import {
  createDevedorSchema,
  updateDevedorSchema,
  devedorParamsSchema,
} from '../validations/devedor.validation';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/devedores:
 *   get:
 *     tags: [Devedores]
 *     summary: Listar devedores
 *     responses:
 *       200:
 *         description: Lista de devedores
 */
router.get('/', devedorController.findAll.bind(devedorController));

/**
 * @swagger
 * /api/devedores/{id}:
 *   get:
 *     tags: [Devedores]
 *     summary: Buscar devedor por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Devedor encontrado
 */
router.get(
  '/:id',
  validate(devedorParamsSchema, 'params'),
  devedorController.findById.bind(devedorController)
);

/**
 * @swagger
 * /api/devedores:
 *   post:
 *     tags: [Devedores]
 *     summary: Criar devedor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Devedor'
 *     responses:
 *       201:
 *         description: Devedor criado
 */
router.post('/', validate(createDevedorSchema), devedorController.create.bind(devedorController));

/**
 * @swagger
 * /api/devedores/{id}:
 *   put:
 *     tags: [Devedores]
 *     summary: Atualizar devedor
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Devedor atualizado
 */
router.put(
  '/:id',
  validate(devedorParamsSchema, 'params'),
  validate(updateDevedorSchema),
  devedorController.update.bind(devedorController)
);

/**
 * @swagger
 * /api/devedores/{id}:
 *   delete:
 *     tags: [Devedores]
 *     summary: Excluir devedor (ADMIN)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Devedor excluído
 */
router.delete(
  '/:id',
  authorize('ADMIN'),
  validate(devedorParamsSchema, 'params'),
  devedorController.delete.bind(devedorController)
);

export default router;
