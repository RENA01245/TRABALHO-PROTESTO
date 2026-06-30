# Implementation Plan: Sistema de Monitoramento de Protestos Importados

**Branch**: `001-protest-monitoring` | **Date**: 2026-06-29 | **Spec**: `specs/001-protest-monitoring/spec.md`

**Input**: Feature specification from `/specs/001-protest-monitoring/spec.md`

## Summary

Implementar sistema full stack para monitoramento de protestos importados por arquivo, usando React, Node.js, Express, Prisma e Supabase PostgreSQL. O fluxo principal cobre login, importacao CSV, lotes, erros, protestos, filtros, detalhes, boleto, pagamento, historico, dashboard e relatorios.

## Technical Context

**Language/Version**: TypeScript, Node.js, React.

**Primary Dependencies**: Express, Prisma, PostgreSQL/Supabase, JWT, Bcrypt, Zod, Multer, PDFKit, Axios, React Router, React Hook Form.

**Storage**: Supabase PostgreSQL via Prisma; Supabase Storage opcional para boletos.

**Testing**: Builds TypeScript, auditoria npm, testes manuais ponta a ponta e verificacao de API.

**Target Platform**: Web app com backend Render, frontend Vercel e banco Supabase.

**Project Type**: Full stack web application.

**Performance Goals**: Operacoes comuns abaixo de 2 segundos em uso academico/local.

**Constraints**: JWT obrigatorio, Bcrypt, Prisma, Supabase PostgreSQL, variaveis `DATABASE_URL` e `DIRECT_URL`.

**Scale/Scope**: Trabalho academico; dados de teste por CSV; SIMPROT/CRA real (A DEFINIR).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Documentacao SDD presente: `docs/constitution.md`, `docs/schema.md`, `docs/plan.md`, `docs/tasks.md`.
- Estrutura oficial Spec Kit presente: `.specify/`, `.codex/commands/speckit.*`, `specs/001-protest-monitoring/`.
- Tecnologias obrigatorias atendidas.
- Supabase PostgreSQL e Prisma atendidos.
- Autenticacao JWT/Bcrypt atendida.
- Pontos de dominio nao especificados marcados como (A DEFINIR).

## Project Structure

### Documentation (this feature)

```text
specs/001-protest-monitoring/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── openapi.yaml
└── tasks.md
```

### Source Code

```text
backend/
├── examples/
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
└── src/
    ├── controllers/
    ├── middlewares/
    ├── routes/
    ├── services/
    ├── utils/
    └── validations/

frontend/
└── src/
    ├── components/
    ├── pages/
    ├── schemas/
    ├── services/
    ├── styles/
    └── utils/
```

**Structure Decision**: Monorepo com `backend`, `frontend`, `docs` e `specs`, mantendo separacao de responsabilidades entre API, UI, banco e artefatos SDD/Spec Kit.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |
