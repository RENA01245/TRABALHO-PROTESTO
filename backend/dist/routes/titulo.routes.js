"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const titulo_controller_1 = require("../controllers/titulo.controller");
const authenticate_1 = require("../middlewares/authenticate");
const authorize_1 = require("../middlewares/authorize");
const validate_1 = require("../middlewares/validate");
const titulo_validation_1 = require("../validations/titulo.validation");
const router = (0, express_1.Router)();
router.use(authenticate_1.authenticate);
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
router.get('/', (0, validate_1.validate)(titulo_validation_1.tituloFiltersSchema, 'query'), titulo_controller_1.tituloController.findAll.bind(titulo_controller_1.tituloController));
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
router.get('/:id', (0, validate_1.validate)(titulo_validation_1.tituloParamsSchema, 'params'), titulo_controller_1.tituloController.findById.bind(titulo_controller_1.tituloController));
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
router.post('/', (0, validate_1.validate)(titulo_validation_1.createTituloSchema), titulo_controller_1.tituloController.create.bind(titulo_controller_1.tituloController));
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
router.put('/:id', (0, validate_1.validate)(titulo_validation_1.tituloParamsSchema, 'params'), (0, validate_1.validate)(titulo_validation_1.updateTituloSchema), titulo_controller_1.tituloController.update.bind(titulo_controller_1.tituloController));
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
router.patch('/:id/status', (0, authorize_1.authorize)('ADMIN'), (0, validate_1.validate)(titulo_validation_1.tituloParamsSchema, 'params'), (0, validate_1.validate)(titulo_validation_1.updateTituloStatusSchema), titulo_controller_1.tituloController.updateStatus.bind(titulo_controller_1.tituloController));
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
router.get('/:id/historico', (0, validate_1.validate)(titulo_validation_1.tituloParamsSchema, 'params'), titulo_controller_1.tituloController.getHistorico.bind(titulo_controller_1.tituloController));
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
router.get('/:id/pdf', (0, validate_1.validate)(titulo_validation_1.tituloParamsSchema, 'params'), titulo_controller_1.tituloController.generatePdf.bind(titulo_controller_1.tituloController));
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
router.delete('/:id', (0, authorize_1.authorize)('ADMIN'), (0, validate_1.validate)(titulo_validation_1.tituloParamsSchema, 'params'), titulo_controller_1.tituloController.delete.bind(titulo_controller_1.tituloController));
exports.default = router;
//# sourceMappingURL=titulo.routes.js.map