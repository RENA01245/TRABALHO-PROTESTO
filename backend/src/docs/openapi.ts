export const openApiDocument = {
  openapi: "3.0.0",
  info: { title: "Sistema de Protesto de Titulos API", version: "1.0.0" },
  servers: [{ url: "/api" }],
  components: {
    securitySchemes: { bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" } }
  },
  security: [{ bearerAuth: [] }],
  paths: {
    "/auth/login": { post: { summary: "Autentica usuario" } },
    "/auth/me": { get: { summary: "Retorna usuario autenticado" } },
    "/users": { get: { summary: "Lista usuarios" }, post: { summary: "Cria usuario" } },
    "/creditors": { get: { summary: "Lista credores" }, post: { summary: "Cria credor" } },
    "/debtors": { get: { summary: "Lista devedores" }, post: { summary: "Cria devedor" } },
    "/titles": { get: { summary: "Lista titulos com filtros" }, post: { summary: "Cria titulo com protocolo automatico" } },
    "/titles/{id}/status": { patch: { summary: "Altera status e registra historico" } },
    "/titles/{id}/receipt": { get: { summary: "Gera comprovante PDF" } },
    "/dashboard": { get: { summary: "Indicadores administrativos" } }
  }
};
