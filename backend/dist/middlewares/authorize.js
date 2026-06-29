"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = authorize;
const AppError_1 = require("../utils/AppError");
function authorize(...roles) {
    return (req, _res, next) => {
        if (!req.user) {
            next(new AppError_1.AppError('Usuário não autenticado', 401));
            return;
        }
        if (!roles.includes(req.user.role)) {
            next(new AppError_1.AppError('Acesso negado. Permissão insuficiente', 403));
            return;
        }
        next();
    };
}
//# sourceMappingURL=authorize.js.map