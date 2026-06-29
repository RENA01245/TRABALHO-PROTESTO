# Tasks — Roadmap Detalhado de Implementação

Roadmap completo para o Sistema de Gerenciamento de Protesto de Títulos, seguindo SDD/Spec Kit.

---

## Fase 1 — Configuração do Repositório

### T1.1 — Estrutura inicial do monorepo
- **Descrição:** Criar estrutura `backend/`, `frontend/`, `docs/` na raiz
- **Subtarefas:**
  - Criar pastas conforme constitution
  - Adicionar `.gitignore` (node_modules, .env, dist)
  - Criar README inicial
- **Dependências:** Nenhuma
- **Resultado esperado:** Repositório organizado e versionável
- **Commit sugerido:** `chore: configurar estrutura inicial do projeto`

### T1.2 — Configuração Git e GitHub
- **Descrição:** Inicializar Git e publicar no GitHub
- **Subtarefas:**
  - `git init`, branch `main`
  - Conectar remote origin
  - Definir Conventional Commits
- **Dependências:** T1.1
- **Resultado esperado:** Repositório remoto acessível

---

## Fase 2 — Supabase e Banco de Dados

### T2.1 — Criar projeto no Supabase
- **Descrição:** Provisionar PostgreSQL gerenciado
- **Subtarefas:**
  - Criar conta/projeto em supabase.com
  - Anotar senha do banco
  - Habilitar acesso por IP se necessário
- **Dependências:** T1.1
- **Resultado esperado:** Instância PostgreSQL ativa

### T2.2 — Configurar DATABASE_URL e DIRECT_URL
- **Descrição:** Obter strings de conexão para Prisma
- **Subtarefas:**
  - Copiar Transaction pooler (6543, pgbouncer) → `DATABASE_URL`
  - Copiar Direct connection (5432) → `DIRECT_URL`
  - Criar `backend/.env` a partir de `.env.example`
- **Dependências:** T2.1
- **Resultado esperado:** Variáveis configuradas localmente

### T2.3 — Configurar Prisma
- **Descrição:** Inicializar ORM com Supabase
- **Subtarefas:**
  - `npm install prisma @prisma/client`
  - Configurar `schema.prisma` com `directUrl`
  - `npx prisma generate`
- **Dependências:** T2.2
- **Resultado esperado:** Prisma Client gerado

### T2.4 — Schema Prisma completo
- **Descrição:** Modelar entidades do domínio
- **Subtarefas:**
  - Enums: Role, TipoDocumento, TituloStatus
  - Models: Usuario, Credor, Devedor, Titulo, HistoricoTitulo, PasswordResetToken
  - Relacionamentos e constraints unique
  - Índices em protocolo, status, documento
- **Dependências:** T2.3
- **Resultado esperado:** `schema.prisma` completo
- **Commit sugerido:** `feat: criar schema prisma e migrations`

### T2.5 — Migrations
- **Descrição:** Versionar DDL no repositório
- **Subtarefas:**
  - `npx prisma migrate dev --name init`
  - Verificar tabelas no Supabase Table Editor
- **Dependências:** T2.4
- **Resultado esperado:** Migration SQL em `prisma/migrations/`

### T2.6 — Seed
- **Descrição:** Dados iniciais para desenvolvimento
- **Subtarefas:**
  - Admin: admin@protesto.com / admin123
  - Funcionário: funcionario@protesto.com / func123
  - Credor, devedor e título exemplo
  - `npm run prisma:seed`
- **Dependências:** T2.5
- **Resultado esperado:** Banco populado
- **Commit sugerido:** `chore: adicionar seed de dados iniciais`

---

## Fase 3 — Back-end

### T3.1 — Setup Express + TypeScript
- **Descrição:** Bootstrap da API REST
- **Subtarefas:**
  - package.json, tsconfig.json
  - `app.ts`, `server.ts`
  - CORS, JSON parser, error handler
  - Health check `/health`
- **Dependências:** T1.1
- **Resultado esperado:** `npm run dev` na porta 3333

### T3.2 — Config e utilitários
- **Descrição:** Env, Prisma singleton, helpers
- **Subtarefas:**
  - `config/env.ts`, `config/database.ts`
  - `validateCPF.ts`, `validateCNPJ.ts`
  - `generateProtocolo.ts`, `AppError.ts`
- **Dependências:** T3.1, T2.3
- **Resultado esperado:** Utilitários reutilizáveis

### T3.3 — Autenticação JWT + Bcrypt
- **Descrição:** RF02, RN09, RN10, RN13
- **Subtarefas:**
  - POST `/api/auth/login`
  - Middleware `authenticate`
  - Middleware `authorize(roles)`
  - GET `/api/auth/me`
- **Dependências:** T3.2, T2.6
- **Resultado esperado:** Login funcional com token JWT
- **Commit sugerido:** `feat: implementar autenticação JWT`

### T3.4 — Recuperação de senha
- **Descrição:** RF03
- **Subtarefas:**
  - POST `/api/auth/forgot-password` (gera token)
  - POST `/api/auth/reset-password`
  - Model PasswordResetToken
  - **(A DEFINIR)** integração SMTP
- **Dependências:** T3.3
- **Resultado esperado:** Reset de senha via token

### T3.5 — CRUD Usuários
- **Descrição:** RF01, perfil ADMIN
- **Subtarefas:**
  - Validação Zod
  - Service + Controller
  - Rotas protegidas (create/delete ADMIN)
  - Hash Bcrypt na criação/atualização
- **Dependências:** T3.3
- **Resultado esperado:** Gestão completa de usuários
- **Commit sugerido:** `feat: implementar CRUD de usuários`

### T3.6 — CRUD Credores
- **Descrição:** RF05, RN03, RN04
- **Subtarefas:**
  - Validação CPF/CNPJ
  - CRUD REST completo
  - Delete apenas ADMIN (RN08)
- **Dependências:** T3.3
- **Resultado esperado:** API de credores funcional
- **Commit sugerido:** `feat: implementar CRUD de credores`

### T3.7 — CRUD Devedores
- **Descrição:** RF04
- **Subtarefas:** Idêntico a T3.6 para devedores
- **Dependências:** T3.3
- **Resultado esperado:** API de devedores funcional
- **Commit sugerido:** `feat: implementar CRUD de devedores`

### T3.8 — CRUD Títulos
- **Descrição:** RF06, RF07, RF12, RN01, RN02, RN05, RN06
- **Subtarefas:**
  - Geração automática de protocolo
  - Status inicial PENDENTE
  - Registro histórico CREATE (RN07)
  - Validação valor e datas
- **Dependências:** T3.6, T3.7
- **Resultado esperado:** Títulos cadastrados com protocolo
- **Commit sugerido:** `feat: implementar CRUD de títulos`

### T3.9 — Pesquisa e filtros
- **Descrição:** RF09, RF10
- **Subtarefas:**
  - Query params: protocolo, documento, nome, status, dataInicio, dataFim
  - Paginação page/limit
  - Join credor/devedor para busca por nome/documento
- **Dependências:** T3.8
- **Resultado esperado:** Listagem filtrada performática

### T3.10 — Alteração de status
- **Descrição:** RF11, RN07
- **Subtarefas:**
  - PATCH `/api/titulos/:id/status`
  - Histórico STATUS_CHANGE
  - Restrição ADMIN (ou **A DEFINIR** para funcionário)
- **Dependências:** T3.8
- **Resultado esperado:** Status atualizado com auditoria

### T3.11 — Histórico
- **Descrição:** RF13
- **Subtarefas:**
  - GET `/api/titulos/:id/historico`
  - Registrar UPDATE e DELETE no histórico
- **Dependências:** T3.8
- **Resultado esperado:** Trilha de auditoria completa

### T3.12 — Dashboard
- **Descrição:** RF15
- **Subtarefas:**
  - GET `/api/dashboard` (ADMIN)
  - Contagem por status, total valor, títulos recentes
- **Dependências:** T3.8
- **Resultado esperado:** Métricas para painel admin
- **Commit sugerido:** `feat: implementar dashboard administrativo`

### T3.13 — Geração PDF
- **Descrição:** RF14
- **Subtarefas:**
  - GET `/api/titulos/:id/pdf` com PDFKit
  - Dados: protocolo, partes, valor, status, datas
- **Dependências:** T3.8
- **Resultado esperado:** Download de comprovante PDF
- **Commit sugerido:** `feat: implementar geração de PDF`

### T3.14 — Swagger/OpenAPI
- **Descrição:** Documentação interativa da API
- **Subtarefas:**
  - swagger-jsdoc + swagger-ui-express
  - `/api-docs` e `/api-docs.json`
  - Documentar rotas principais
- **Dependências:** T3.3–T3.13
- **Resultado esperado:** Swagger UI acessível

---

## Fase 4 — Front-end

### T4.1 — Setup Vite + React + TypeScript
- **Descrição:** Bootstrap SPA
- **Subtarefas:**
  - vite.config.ts, tsconfig, alias @/
  - Estrutura pages/components/services
- **Dependências:** T1.1
- **Resultado esperado:** `npm run dev` porta 5173

### T4.2 — Axios e autenticação
- **Descrição:** Cliente HTTP com JWT
- **Subtarefas:**
  - api.ts com interceptors
  - AuthContext, localStorage token
  - ProtectedRoute, AdminRoute
- **Dependências:** T4.1, T3.3
- **Resultado esperado:** Sessão persistente
- **Commit sugerido:** `feat: implementar telas de autenticação`

### T4.3 — Layout responsivo
- **Descrição:** RNF09
- **Subtarefas:**
  - Sidebar, header, logout
  - CSS variables, mobile menu
- **Dependências:** T4.2
- **Resultado esperado:** Shell da aplicação

### T4.4 — Páginas de autenticação
- **Descrição:** Login, forgot/reset password
- **Subtarefas:**
  - React Hook Form + Zod
  - Redirect após login por role
- **Dependências:** T4.2
- **Resultado esperado:** Fluxo auth completo

### T4.5 — Módulo Títulos
- **Descrição:** RF06–RF11, RF09–RF10
- **Subtarefas:**
  - Listagem com filtros
  - Form create/edit
  - Detalhe: status, histórico, PDF
- **Dependências:** T4.3, T3.8–T3.13
- **Resultado esperado:** Gestão de títulos na UI

### T4.6 — Módulos Credores e Devedores
- **Subtarefas:** List + Form com validação documento
- **Dependências:** T4.3, T3.6, T3.7
- **Resultado esperado:** CRUD na interface

### T4.7 — Módulo Usuários (ADMIN)
- **Subtarefas:** List + Form, apenas AdminRoute
- **Dependências:** T4.3, T3.5
- **Resultado esperado:** Gestão de usuários

### T4.8 — Dashboard
- **Subtarefas:** Cards métricas, títulos recentes
- **Dependências:** T4.3, T3.12
- **Resultado esperado:** Painel administrativo

---

## Fase 5 — Testes e Qualidade

### T5.1 — Validações CPF/CNPJ
- **Descrição:** RN03, RN04
- **Subtarefas:** Testar casos válidos/inválidos via API
- **Commit sugerido:** `fix: ajustar validações de CPF e CNPJ`

### T5.2 — Testes manuais E2E
- **Subtarefas:** Fluxos login → CRUD → status → PDF
- **Resultado esperado:** Checklist de aceite preenchido

### T5.3 — Refatoração
- **Commit sugerido:** `refactor: organizar serviços e controllers`

---

## Fase 6 — Deploy

### T6.1 — Deploy Render (back-end)
- **Subtarefas:**
  - render.yaml ou config manual
  - Env: DATABASE_URL, DIRECT_URL, JWT_SECRET, CORS_ORIGIN
  - Build + migrate deploy + start
- **Commit sugerido:** `chore: configurar deploy`

### T6.2 — Deploy Vercel (front-end)
- **Subtarefas:**
  - Root `frontend`
  - VITE_API_URL apontando Render

### T6.3 — Validar produção
- **Subtarefas:** Login, CORS, migrations, seed produção

---

## Commits Sugeridos (Ordem)

```
chore: configurar estrutura inicial do projeto
docs: adicionar documentação SDD
feat: criar schema prisma e migrations
chore: adicionar seed de dados iniciais
feat: implementar autenticação JWT
feat: implementar CRUD de usuários
feat: implementar CRUD de credores
feat: implementar CRUD de devedores
feat: implementar CRUD de títulos
feat: implementar dashboard administrativo
feat: implementar geração de PDF
feat: implementar telas de autenticação
fix: ajustar validações de CPF e CNPJ
refactor: organizar serviços e controllers
chore: configurar deploy
```
