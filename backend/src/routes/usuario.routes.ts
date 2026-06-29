import { Router } from 'express';
import { usuarioController } from '../controllers/usuario.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import {
  createUsuarioSchema,
  updateUsuarioSchema,
  usuarioParamsSchema,
} from '../validations/usuario.validation';

const router = Router();

router.use(authenticate);

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
router.get('/', usuarioController.findAll.bind(usuarioController));

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
router.get(
  '/:id',
  validate(usuarioParamsSchema, 'params'),
  usuarioController.findById.bind(usuarioController)
);

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
router.post(
  '/',
  authorize('ADMIN'),
  validate(createUsuarioSchema),
  usuarioController.create.bind(usuarioController)
);

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
router.put(
  '/:id',
  validate(usuarioParamsSchema, 'params'),
  validate(updateUsuarioSchema),
  usuarioController.update.bind(usuarioController)
);

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
router.delete(
  '/:id',
  authorize('ADMIN'),
  validate(usuarioParamsSchema, 'params'),
  usuarioController.delete.bind(usuarioController)
);

export default router;
