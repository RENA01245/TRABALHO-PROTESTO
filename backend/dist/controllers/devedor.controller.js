"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.devedorController = exports.DevedorController = void 0;
const devedor_service_1 = require("../services/devedor.service");
const params_1 = require("../utils/params");
class DevedorController {
    async findAll(_req, res, next) {
        try {
            const devedores = await devedor_service_1.devedorService.findAll();
            res.json(devedores);
        }
        catch (error) {
            next(error);
        }
    }
    async findById(req, res, next) {
        try {
            const devedor = await devedor_service_1.devedorService.findById((0, params_1.getParamId)(req.params));
            res.json(devedor);
        }
        catch (error) {
            next(error);
        }
    }
    async create(req, res, next) {
        try {
            const devedor = await devedor_service_1.devedorService.create(req.body);
            res.status(201).json(devedor);
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const devedor = await devedor_service_1.devedorService.update((0, params_1.getParamId)(req.params), req.body);
            res.json(devedor);
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            await devedor_service_1.devedorService.delete((0, params_1.getParamId)(req.params));
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
}
exports.DevedorController = DevedorController;
exports.devedorController = new DevedorController();
//# sourceMappingURL=devedor.controller.js.map