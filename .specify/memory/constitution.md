# Project Constitution

## Principles

### I. Spec-Driven Development

Toda alteração funcional deve partir de especificação, plano e tarefas antes da implementação. Os artefatos oficiais ficam em `specs/001-protest-monitoring/` e os documentos acadêmicos equivalentes ficam em `docs/`.

### II. Supabase PostgreSQL Como Banco Oficial

O projeto deve usar PostgreSQL hospedado no Supabase. Neon ou outro banco gerenciado não deve ser usado. O Prisma deve conectar com `DATABASE_URL` e `DIRECT_URL`.

### III. Autenticação Própria

A autenticação deve ser implementada no backend com JWT e Bcrypt, usando tabela própria `User`. Supabase Auth permanece fora do escopo salvo decisão futura (A DEFINIR).

### IV. Monitoramento de Protestos Importados

O foco do sistema é importar arquivos de protesto, registrar lotes, erros, credores, devedores, protestos, boletos, pagamentos, pendências e histórico. O layout real SIMPROT/CRA permanece (A DEFINIR).

### V. Rastreabilidade e Auditoria

Alterações importantes devem registrar histórico: importação, status, boleto, pagamento, pendência e observações.

## Required Stack

- Frontend: React, Vite, TypeScript, React Router, Axios, React Hook Form e Zod.
- Backend: Node.js, Express, TypeScript, Prisma, JWT, Bcrypt, Zod, Multer e Swagger/OpenAPI.
- Banco: Supabase PostgreSQL.
- Deploy: Vercel, Render e Supabase.

## Quality Gates

- `npm run build` deve passar no backend.
- `npm run build` deve passar no frontend.
- `npm audit --audit-level=moderate` deve passar no backend e frontend.
- Fluxo manual deve validar login, importação CSV, listagem, filtros, detalhes, status, boleto, pagamento e histórico.

## Governance

Esta constituição orienta os artefatos Spec Kit e SDD do projeto. Mudanças relevantes devem atualizar `specs/001-protest-monitoring/`, `docs/` e `README.md`.

**Version**: 1.0.0 | **Ratified**: 2026-06-29 | **Last Amended**: 2026-06-29
