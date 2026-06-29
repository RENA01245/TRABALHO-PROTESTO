import { Router } from 'express';
import { credorController } from '../controllers/credor.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import {
  createCredorSchema,
  updateCredorSchema,
  credorParamsSchema,
} from '../validations/credor.validation';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/credores:
 *   get:
 *     tags: [Credores]
 *     summary: Listar credores
 *     responses:
 *       200:
 *         description: Lista de credores
 */
router.get('/', credorController.findAll.bind(credorController));

/**
 * @swagger
 * /api/credores/{id}:
 *   get:
 *     tags: [Credores]
 *     summary: Buscar credor por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Credor encontrado
 */
router.get(
  '/:id',
  validate(credorParamsSchema, 'params'),
  credorController.findById.bind(credorController)
);

/**
 * @swagger
 * /api/credores:
 *   post:
 *     tags: [Credores]
 *     summary: Criar credor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Credor'
 *     responses:
 *       201:
 *         description: Credor criado
 */
router.post('/', validate(createCredorSchema), credorController.create.bind(credorController));

/**
 * @swagger
 * /api/credores/{id}:
 *   put:
 *     tags: [Credores]
 *     summary: Atualizar credor
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Credor atualizado
 */
router.put(
  '/:id',
  validate(credorParamsSchema, 'params'),
  validate(updateCredorSchema),
  credorController.update.bind(credorController)
);

/**
 * @swagger
 * /api/credores/{id}:
 *   delete:
 *     tags: [Credores]
 *     summary: Excluir credor (ADMIN)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Credor excluído
 */
router.delete(
  '/:id',
  authorize('ADMIN'),
  validate(credorParamsSchema, 'params'),
  credorController.delete.bind(credorController)
);

export default router;
