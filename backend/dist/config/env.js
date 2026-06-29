"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    PORT: zod_1.z.coerce.number().default(3333),
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    JWT_SECRET: zod_1.z.string().min(1, 'JWT_SECRET é obrigatório'),
    JWT_EXPIRES_IN: zod_1.z.string().default('7d'),
    DATABASE_URL: zod_1.z.string().min(1, 'DATABASE_URL é obrigatório'),
    DIRECT_URL: zod_1.z.string().min(1, 'DIRECT_URL é obrigatório'),
    CORS_ORIGIN: zod_1.z.string().default('http://localhost:5173'),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.error('Erro na configuração de variáveis de ambiente:', parsed.error.flatten().fieldErrors);
    process.exit(1);
}
exports.env = parsed.data;
//# sourceMappingURL=env.js.map