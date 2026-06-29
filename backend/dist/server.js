"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const database_1 = require("./config/database");
async function main() {
    try {
        await database_1.prisma.$connect();
        console.log('Conexão com banco de dados estabelecida');
        app_1.default.listen(env_1.env.PORT, () => {
            console.log(`Servidor rodando na porta ${env_1.env.PORT}`);
            console.log(`Documentação Swagger: http://localhost:${env_1.env.PORT}/api-docs`);
        });
    }
    catch (error) {
        console.error('Erro ao iniciar servidor:', error);
        process.exit(1);
    }
}
main();
process.on('SIGINT', async () => {
    await database_1.prisma.$disconnect();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    await database_1.prisma.$disconnect();
    process.exit(0);
});
//# sourceMappingURL=server.js.map