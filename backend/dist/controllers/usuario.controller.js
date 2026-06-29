"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usuarioController = exports.UsuarioController = void 0;
const usuario_service_1 = require("../services/usuario.service");
const params_1 = require("../utils/params");
class UsuarioController {
    async findAll(_req, res, next) {
        try {
            const usuarios = await usuario_service_1.usuarioService.findAll();
            res.json(usuarios);
        }
        catch (error) {
            next(error);
        }
    }
    async findById(req, res, next) {
        try {
            const usuario = await usuario_service_1.usuarioService.findById((0, params_1.getParamId)(req.params));
            res.json(usuario);
        }
        catch (error) {
            next(error);
        }
    }
    async create(req, res, next) {
        try {
            const usuario = await usuario_service_1.usuarioService.create(req.body);
            res.status(201).json(usuario);
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const usuario = await usuario_service_1.usuarioService.update((0, params_1.getParamId)(req.params), req.body);
            res.json(usuario);
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            await usuario_service_1.usuarioService.delete((0, params_1.getParamId)(req.params));
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UsuarioController = UsuarioController;
exports.usuarioController = new UsuarioController();
//# sourceMappingURL=usuario.controller.js.map