"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const env_1 = require("./config/env");
const swagger_1 = require("./config/swagger");
const errorHandler_1 = require("./middlewares/errorHandler");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const usuario_routes_1 = __importDefault(require("./routes/usuario.routes"));
const credor_routes_1 = __importDefault(require("./routes/credor.routes"));
const devedor_routes_1 = __importDefault(require("./routes/devedor.routes"));
const titulo_routes_1 = __importDefault(require("./routes/titulo.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: env_1.env.CORS_ORIGIN }));
app.use(express_1.default.json());
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
app.get('/api-docs.json', (_req, res) => {
    res.json(swagger_1.swaggerSpec);
});
app.use('/api/auth', auth_routes_1.default);
app.use('/api/usuarios', usuario_routes_1.default);
app.use('/api/credores', credor_routes_1.default);
app.use('/api/devedores', devedor_routes_1.default);
app.use('/api/titulos', titulo_routes_1.default);
app.use('/api/dashboard', dashboard_routes_1.default);
app.use(errorHandler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map