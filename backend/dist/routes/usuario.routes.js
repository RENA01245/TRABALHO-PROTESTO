"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuario_controller_1 = require("../controllers/usuario.controller");
const authenticate_1 = require("../middlewares/authenticate");
const authorize_1 = require("../middlewares/authorize");
const validate_1 = require("../middlewares/validate");
const usuario_validation_1 = require("../validations/usuario.validation");
const router = (0, express_1.Router)();
router.use(authenticate_1.authenticate);
/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     tags: [Usuários]
 *     summary: Listar usuários
 *     responses:
 *       200:
 *         description: Lista de usuários
 */
router.get('/', usuario_controller_1.usuarioController.findAll.bind(usuario_controller_1.usuarioController));
/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     tags: [Usuários]
 *     summary: Buscar usuário por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/:id', (0, validate_1.validate)(usuario_validation_1.usuarioParamsSchema, 'params'), usuario_controller_1.usuarioController.findById.bind(usuario_controller_1.usuarioController));
/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     tags: [Usuários]
 *     summary: Criar usuário (ADMIN)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, email, senha]
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [ADMIN, FUNCIONARIO]
 *     responses:
 *       201:
 *         description: Usuário criado
 *       403:
 *         description: Acesso negado
 */
router.post('/', (0, authorize_1.authorize)('ADMIN'), (0, validate_1.validate)(usuario_validation_1.createUsuarioSchema), usuario_controller_1.usuarioController.create.bind(usuario_controller_1.usuarioController));
/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     tags: [Usuários]
 *     summary: Atualizar usuário
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Usuário atualizado
 */
router.put('/:id', (0, validate_1.validate)(usuario_validation_1.usuarioParamsSchema, 'params'), (0, validate_1.validate)(usuario_validation_1.updateUsuarioSchema), usuario_controller_1.usuarioController.update.bind(usuario_controller_1.usuarioController));
/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     tags: [Usuários]
 *     summary: Excluir usuário (ADMIN)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Usuário excluído
 *       403:
 *         description: Acesso negado
 */
router.delete('/:id', (0, authorize_1.authorize)('ADMIN'), (0, validate_1.validate)(usuario_validation_1.usuarioParamsSchema, 'params'), usuario_controller_1.usuarioController.delete.bind(usuario_controller_1.usuarioController));
exports.default = router;
//# sourceMappingURL=usuario.routes.js.map