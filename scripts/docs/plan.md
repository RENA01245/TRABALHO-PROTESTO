# Plan — Plano de Implementação

## Arquitetura

Request → Routes → Middleware → Controller → Service → Prisma → PostgreSQL

## APIs

- `/api/auth/*` — login, forgot/reset password, me
- `/api/usuarios` — CRUD (ADMIN create/delete)
- `/api/credores`, `/api/devedores` — CRUD (delete ADMIN)
- `/api/titulos` — CRUD, filtros, status, histórico, PDF
- `/api/dashboard` — indicadores (ADMIN)

## Autenticação

JWT + Bcrypt, middleware authenticate + authorize.

## Deploy

**Supabase:** DATABASE_URL (pooler 6543), DIRECT_URL (5432).

**Render:** root backend, build + prisma migrate deploy + start.

**Vercel:** root frontend, VITE_API_URL.

## Riscos

Pooler vs migrations, cold start Render, CORS, domínio incompleto.
