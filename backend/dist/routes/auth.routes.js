"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const validate_1 = require("../middlewares/validate");
const authenticate_1 = require("../middlewares/authenticate");
const auth_validation_1 = require("../validations/auth.validation");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Autenticar usuário
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', (0, validate_1.validate)(auth_validation_1.loginSchema), auth_controller_1.authController.login.bind(auth_controller_1.authController));
/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: Solicitar recuperação de senha
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Token gerado (implementação simplificada)
 */
router.post('/forgot-password', (0, validate_1.validate)(auth_validation_1.forgotPasswordSchema), auth_controller_1.authController.forgotPassword.bind(auth_controller_1.authController));
/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     tags: [Auth]
 *     summary: Redefinir senha com token
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, senha]
 *             properties:
 *               token:
 *                 type: string
 *               senha:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Senha redefinida com sucesso
 */
router.post('/reset-password', (0, validate_1.validate)(auth_validation_1.resetPasswordSchema), auth_controller_1.authController.resetPassword.bind(auth_controller_1.authController));
/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Obter dados do usuário autenticado
 *     responses:
 *       200:
 *         description: Dados do usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsuarioResponse'
 */
router.get('/me', authenticate_1.authenticate, auth_controller_1.authController.me.bind(auth_controller_1.authController));
exports.default = router;
//# sourceMappingURL=auth.routes.js.map