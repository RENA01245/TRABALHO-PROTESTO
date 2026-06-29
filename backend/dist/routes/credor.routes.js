"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const credor_controller_1 = require("../controllers/credor.controller");
const authenticate_1 = require("../middlewares/authenticate");
const authorize_1 = require("../middlewares/authorize");
const validate_1 = require("../middlewares/validate");
const credor_validation_1 = require("../validations/credor.validation");
const router = (0, express_1.Router)();
router.use(authenticate_1.authenticate);
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
router.get('/', credor_controller_1.credorController.findAll.bind(credor_controller_1.credorController));
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
router.get('/:id', (0, validate_1.validate)(credor_validation_1.credorParamsSchema, 'params'), credor_controller_1.credorController.findById.bind(credor_controller_1.credorController));
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
router.post('/', (0, validate_1.validate)(credor_validation_1.createCredorSchema), credor_controller_1.credorController.create.bind(credor_controller_1.credorController));
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
router.put('/:id', (0, validate_1.validate)(credor_validation_1.credorParamsSchema, 'params'), (0, validate_1.validate)(credor_validation_1.updateCredorSchema), credor_controller_1.credorController.update.bind(credor_controller_1.credorController));
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
router.delete('/:id', (0, authorize_1.authorize)('ADMIN'), (0, validate_1.validate)(credor_validation_1.credorParamsSchema, 'params'), credor_controller_1.credorController.delete.bind(credor_controller_1.credorController));
exports.default = router;
//# sourceMappingURL=credor.routes.js.map