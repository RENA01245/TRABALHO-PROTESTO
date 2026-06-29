"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.credorController = exports.CredorController = void 0;
const credor_service_1 = require("../services/credor.service");
const params_1 = require("../utils/params");
class CredorController {
    async findAll(_req, res, next) {
        try {
            const credores = await credor_service_1.credorService.findAll();
            res.json(credores);
        }
        catch (error) {
            next(error);
        }
    }
    async findById(req, res, next) {
        try {
            const credor = await credor_service_1.credorService.findById((0, params_1.getParamId)(req.params));
            res.json(credor);
        }
        catch (error) {
            next(error);
        }
    }
    async create(req, res, next) {
        try {
            const credor = await credor_service_1.credorService.create(req.body);
            res.status(201).json(credor);
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const credor = await credor_service_1.credorService.update((0, params_1.getParamId)(req.params), req.body);
            res.json(credor);
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            await credor_service_1.credorService.delete((0, params_1.getParamId)(req.params));
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CredorController = CredorController;
exports.credorController = new CredorController();
//# sourceMappingURL=credor.controller.js.map