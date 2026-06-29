"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tituloController = exports.TituloController = void 0;
const titulo_service_1 = require("../services/titulo.service");
const params_1 = require("../utils/params");
class TituloController {
    async findAll(req, res, next) {
        try {
            const result = await titulo_service_1.tituloService.findAll(req.query);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async findById(req, res, next) {
        try {
            const titulo = await titulo_service_1.tituloService.findById((0, params_1.getParamId)(req.params));
            res.json(titulo);
        }
        catch (error) {
            next(error);
        }
    }
    async create(req, res, next) {
        try {
            const titulo = await titulo_service_1.tituloService.create(req.body, req.user.id);
            res.status(201).json(titulo);
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const titulo = await titulo_service_1.tituloService.update((0, params_1.getParamId)(req.params), req.body, req.user.id);
            res.json(titulo);
        }
        catch (error) {
            next(error);
        }
    }
    async updateStatus(req, res, next) {
        try {
            const titulo = await titulo_service_1.tituloService.updateStatus((0, params_1.getParamId)(req.params), req.body, req.user.id);
            res.json(titulo);
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            await titulo_service_1.tituloService.delete((0, params_1.getParamId)(req.params), req.user.id);
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
    async getHistorico(req, res, next) {
        try {
            const historico = await titulo_service_1.tituloService.getHistorico((0, params_1.getParamId)(req.params));
            res.json(historico);
        }
        catch (error) {
            next(error);
        }
    }
    async generatePdf(req, res, next) {
        try {
            const pdf = await titulo_service_1.tituloService.generatePdf((0, params_1.getParamId)(req.params));
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="comprovante-${(0, params_1.getParamId)(req.params)}.pdf"`);
            res.send(pdf);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.TituloController = TituloController;
exports.tituloController = new TituloController();
//# sourceMappingURL=titulo.controller.js.map