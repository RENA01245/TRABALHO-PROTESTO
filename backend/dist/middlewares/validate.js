"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
const zod_1 = require("zod");
const AppError_1 = require("../utils/AppError");
function validate(schema, target = 'body') {
    return (req, _res, next) => {
        try {
            const source = req[target];
            const parsed = schema.parse(source);
            if (target === 'body') {
                Object.assign(req.body, parsed);
            }
            else if (target === 'query') {
                Object.assign(req.query, parsed);
            }
            else {
                Object.assign(req.params, parsed);
            }
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const messages = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
                next(new AppError_1.AppError(`Dados inválidos: ${messages}`, 400));
                return;
            }
            next(error);
        }
    };
}
//# sourceMappingURL=validate.js.map