"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
class AuthController {
    async login(req, res, next) {
        try {
            const result = await auth_service_1.authService.login(req.body);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async me(req, res, next) {
        try {
            const usuario = await auth_service_1.authService.me(req.user.id);
            res.json(usuario);
        }
        catch (error) {
            next(error);
        }
    }
    async forgotPassword(req, res, next) {
        try {
            const result = await auth_service_1.authService.forgotPassword(req.body);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async resetPassword(req, res, next) {
        try {
            const result = await auth_service_1.authService.resetPassword(req.body);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
//# sourceMappingURL=auth.controller.js.map