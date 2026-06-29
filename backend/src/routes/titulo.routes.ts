import { Router } from 'express';
import { tituloController } from '../controllers/titulo.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import {
  createTituloSchema,
  updateTituloSchema,
  updateTituloStatusSchema,
  tituloParamsSchema,
  tituloFiltersSchema,
} from '../validations/titulo.validation';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/titulos:
 *   get:
 *     tags: [Títulos]
 *     summary: Listar títulos com filtros
 *     parameters:
 *       - in: query
 *         name: protocolo
 *         schema:
 *           type: string
 *       - in: query
 *         name: documento
 *         schema:
 *           type: string
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDENTE, EM_ANALISE, PROTESTADO, CANCELADO, RETIRADO, PAGO]
 *       - in: query
 *         name: dataInicio
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: dataFim
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Lista paginada de títulos
 */
router.get(
  '/',
  validate(tituloFiltersSchema, 'query'),
  tituloController.findAll.bind(tituloController)
);

/**
 * @swagger
 * /api/titulos/{id}:
 *   get:
 *     tags: [Títulos]
 *     summary: Buscar título por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Título encontrado
 */
router.get(
  '/:id',
  validate(tituloParamsSchema, 'params'),
  tituloController.findById.bind(tituloController)
);

/**
 * @swagger
 * /api/titulos:
 *   post:
 *     tags: [Títulos]
 *     summary: Criar título
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Titulo'
 *     responses:
 *       201:
 *         description: Título criado com protocolo gerado
 */
router.post('/', validate(createTituloSchema), tituloController.create.bind(tituloController));

/**
 * @swagger
 * /api/titulos/{id}:
 *   put:
 *     tags: [Títulos]
 *     summary: Atualizar título
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Título atualizado
 */
router.put(
  '/:id',
  validate(tituloParamsSchema, 'params'),
  validate(updateTituloSchema),
  tituloController.update.bind(tituloController)
);

/**
 * @swagger
 * /api/titulos/{id}/status:
 *   patch:
 *     tags: [Títulos]
 *     summary: Alterar status do título (ADMIN)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDENTE, EM_ANALISE, PROTESTADO, CANCELADO, RETIRADO, PAGO]
 *               dataProtesto:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Status atualizado
 */
router.patch(
  '/:id/status',
  authorize('ADMIN'),
  validate(tituloParamsSchema, 'params'),
  validate(updateTituloStatusSchema),
  tituloController.updateStatus.bind(tituloController)
);

/**
 * @swagger
 * /api/titulos/{id}/historico:
 *   get:
 *     tags: [Títulos]
 *     summary: Obter histórico de alterações do título
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Histórico do título
 */
router.get(
  '/:id/historico',
  validate(tituloParamsSchema, 'params'),
  tituloController.getHistorico.bind(tituloController)
);

/**
 * @swagger
 * /api/titulos/{id}/pdf:
 *   get:
 *     tags: [Títulos]
 *     summary: Gerar comprovante PDF do título
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Arquivo PDF
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get(
  '/:id/pdf',
  validate(tituloParamsSchema, 'params'),
  tituloController.generatePdf.bind(tituloController)
);

/**
 * @swagger
 * /api/titulos/{id}:
 *   delete:
 *     tags: [Títulos]
 *     summary: Excluir título (ADMIN)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Título excluído
 */
router.delete(
  '/:id',
  authorize('ADMIN'),
  validate(tituloParamsSchema, 'params'),
  tituloController.delete.bind(tituloController)
);

export default router;
