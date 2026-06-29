"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const devedor_controller_1 = require("../controllers/devedor.controller");
const authenticate_1 = require("../middlewares/authenticate");
const authorize_1 = require("../middlewares/authorize");
const validate_1 = require("../middlewares/validate");
const devedor_validation_1 = require("../validations/devedor.validation");
const router = (0, express_1.Router)();
router.use(authenticate_1.authenticate);
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
router.get('/', devedor_controller_1.devedorController.findAll.bind(devedor_controller_1.devedorController));
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
router.get('/:id', (0, validate_1.validate)(devedor_validation_1.devedorParamsSchema, 'params'), devedor_controller_1.devedorController.findById.bind(devedor_controller_1.devedorController));
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
router.post('/', (0, validate_1.validate)(devedor_validation_1.createDevedorSchema), devedor_controller_1.devedorController.create.bind(devedor_controller_1.devedorController));
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
router.put('/:id', (0, validate_1.validate)(devedor_validation_1.devedorParamsSchema, 'params'), (0, validate_1.validate)(devedor_validation_1.updateDevedorSchema), devedor_controller_1.devedorController.update.bind(devedor_controller_1.devedorController));
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
router.delete('/:id', (0, authorize_1.authorize)('ADMIN'), (0, validate_1.validate)(devedor_validation_1.devedorParamsSchema, 'params'), devedor_controller_1.devedorController.delete.bind(devedor_controller_1.devedorController));
exports.default = router;
//# sourceMappingURL=devedor.routes.js.map