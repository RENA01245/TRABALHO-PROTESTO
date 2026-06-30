# Tasks: Sistema de Monitoramento de Protestos Importados

**Input**: `specs/001-protest-monitoring/spec.md`

## Phase 1: Setup

- [X] T001 Inicializar projeto full stack com backend, frontend, docs e README.
- [X] T002 Configurar Prisma com Supabase usando `DATABASE_URL` e `DIRECT_URL`.
- [X] T003 Inicializar estrutura oficial Spec Kit com `.specify`, comandos e `specs/001-protest-monitoring`.

## Phase 2: Foundation

- [X] T004 Implementar autenticação JWT e Bcrypt.
- [X] T005 Criar modelos Prisma para User, ImportBatch, ImportError, Debtor, Creditor, Protest, ProtestAttachment, ProtestHistory e PaymentInfo.
- [X] T006 Criar migrations e seed.
- [X] T007 Configurar validações Zod e middlewares de autenticação/autorização.

## Phase 3: Importação

- [X] T008 Criar rota `POST /api/imports` com Multer.
- [X] T009 Validar extensões CSV/TXT/JSON, arquivo vazio e cabeçalho CSV.
- [X] T010 Processar CSV de exemplo e criar lotes, erros, credores, devedores e protestos.
- [X] T011 Criar tela `/importar` com upload, loading, mensagens e resumo.
- [X] T012 Criar `backend/examples/protestos-exemplo.csv`.

## Phase 4: Monitoramento

- [X] T013 Implementar listagem de protestos com filtros.
- [X] T014 Implementar dashboard com indicadores por status.
- [X] T015 Implementar detalhes do protesto.
- [X] T016 Implementar alteração de status e histórico.
- [X] T017 Implementar anexos/boletos.
- [X] T018 Implementar registro de pagamento.
- [X] T019 Implementar relatórios de importação.

## Phase 5: UI e Qualidade

- [X] T020 Melhorar layout com menu lateral, cabeçalho, cards, tabelas, badges e mensagens.
- [X] T021 Testar login, dashboard, importação, filtros, detalhes, boleto, pagamento e histórico.
- [X] T022 Rodar `npm run build` no backend.
- [X] T023 Rodar `npm run build` no frontend.
- [X] T024 Rodar `npm audit --audit-level=moderate`.
- [X] T025 Atualizar README e docs SDD.
- [X] T026 Criar `docs/verification-report.md`.

## Final Status

Sistema pronto para apresentação acadêmica, com fluxo Spec Kit registrado e implementação validada.
