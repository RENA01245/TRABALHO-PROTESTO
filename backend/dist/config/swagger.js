"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const env_1 = require("./env");
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API - Sistema de Gerenciamento de Protesto de Títulos',
            version: '1.0.0',
            description: 'API REST para gerenciamento de títulos encaminhados para protesto',
        },
        servers: [
            {
                url: `http://localhost:${env_1.env.PORT}`,
                description: 'Servidor local',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'error' },
                        message: { type: 'string', example: 'Mensagem de erro' },
                    },
                },
                LoginRequest: {
                    type: 'object',
                    required: ['email', 'senha'],
                    properties: {
                        email: { type: 'string', format: 'email' },
                        senha: { type: 'string', minLength: 6 },
                    },
                },
                LoginResponse: {
                    type: 'object',
                    properties: {
                        token: { type: 'string' },
                        usuario: { $ref: '#/components/schemas/UsuarioResponse' },
                    },
                },
                UsuarioResponse: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        nome: { type: 'string' },
                        email: { type: 'string' },
                        role: { type: 'string', enum: ['ADMIN', 'FUNCIONARIO'] },
                        ativo: { type: 'boolean' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                Credor: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        nome: { type: 'string' },
                        documento: { type: 'string' },
                        tipoDocumento: { type: 'string', enum: ['CPF', 'CNPJ'] },
                        email: { type: 'string', nullable: true },
                        telefone: { type: 'string', nullable: true },
                        endereco: { type: 'string', nullable: true },
                    },
                },
                Devedor: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        nome: { type: 'string' },
                        documento: { type: 'string' },
                        tipoDocumento: { type: 'string', enum: ['CPF', 'CNPJ'] },
                        email: { type: 'string', nullable: true },
                        telefone: { type: 'string', nullable: true },
                        endereco: { type: 'string', nullable: true },
                    },
                },
                Titulo: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        protocolo: { type: 'string' },
                        credorId: { type: 'string', format: 'uuid' },
                        devedorId: { type: 'string', format: 'uuid' },
                        valor: { type: 'number' },
                        dataVencimento: { type: 'string', format: 'date-time' },
                        dataProtesto: { type: 'string', format: 'date-time', nullable: true },
                        tipoTitulo: { type: 'string' },
                        status: {
                            type: 'string',
                            enum: ['PENDENTE', 'EM_ANALISE', 'PROTESTADO', 'CANCELADO', 'RETIRADO', 'PAGO'],
                        },
                        observacoes: { type: 'string', nullable: true },
                    },
                },
                Dashboard: {
                    type: 'object',
                    properties: {
                        totaisPorStatus: { type: 'object' },
                        totalTitulos: { type: 'integer' },
                        valorTotal: { type: 'number' },
                        titulosRecentes: { type: 'array', items: { $ref: '#/components/schemas/Titulo' } },
                    },
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ['./src/routes/*.ts'],
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
//# sourceMappingURL=swagger.js.map