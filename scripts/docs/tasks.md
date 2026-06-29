# Tasks — Roadmap Detalhado

## Fase 1 — Repositório

### T1.1 Configurar estrutura inicial
- **Descrição:** Criar monorepo backend/frontend/docs
- **Subtarefas:** .gitignore, README, pastas
- **Dependências:** Nenhuma
- **Resultado:** Estrutura versionada

### T1.2 Configuração Git
- **Descrição:** Inicializar repo, Conventional Commits
- **Subtarefas:** git init, branch main
- **Dependências:** T1.1
- **Resultado:** Repositório GitHub pronto

## Fase 2 — Supabase

### T2.1 Criar projeto Supabase
- **Descrição:** Projeto PostgreSQL no Supabase
- **Subtarefas:** Copiar DATABASE_URL e DIRECT_URL
- **Dependências:** T1.1
- **Resultado:** Banco disponível

### T2.2 Configurar variáveis Prisma
- **Descrição:** .env com DATABASE_URL e DIRECT_URL
- **Dependências:** T2.1
- **Resultado:** Prisma conecta ao Supabase

## Fase 3 — Backend

### T3.1 Setup Express + TypeScript
- **Commit sugerido:** `chore: configurar estrutura inicial do projeto`
- **Resultado:** npm run dev funcional

### T3.2 Schema Prisma + migrations
- **Commit:** `feat: criar schema prisma e migrations`
- **Resultado:** Tabelas criadas

### T3.3 Seed
- **Commit:** `chore: adicionar seed de dados iniciais`
- **Resultado:** Admin e dados exemplo

### T3.4 Autenticação JWT
- **Commit:** `feat: implementar autenticação JWT`
- **Resultado:** Login/logout/me

### T3.5 CRUD Usuários
- **Commit:** `feat: implementar CRUD de usuários`

### T3.6 CRUD Credores
- **Commit:** `feat: implementar CRUD de credores`

### T3.7 CRUD Devedores
- **Commit:** `feat: implementar CRUD de devedores`

### T3.8 CRUD Títulos + protocolo + histórico
- **Commit:** `feat: implementar CRUD de títulos`

### T3.9 Dashboard
- **Commit:** `feat: implementar dashboard administrativo`

### T3.10 PDF + Swagger
- **Commit:** `feat: implementar geração de PDF`

## Fase 4 — Frontend

### T4.1 Setup Vite + React
- **Resultado:** npm run dev

### T4.2 Auth + rotas protegidas
- **Commit:** `feat: implementar telas de autenticação`

### T4.3 Páginas CRUD
- **Commits:** feat por módulo

### T4.4 Dashboard + filtros
- **Resultado:** UI completa responsiva

## Fase 5 — Deploy

### T5.1 Render
- **Commit:** `chore: configurar deploy`

### T5.2 Vercel
- **Resultado:** App publicada

## Commits Sugeridos

```
chore: configurar estrutura inicial do projeto
docs: adicionar documentação SDD
feat: implementar autenticação JWT
feat: implementar CRUD de usuários
feat: implementar CRUD de credores
feat: implementar CRUD de devedores
feat: implementar CRUD de títulos
feat: implementar dashboard administrativo
feat: implementar geração de PDF
fix: ajustar validações de CPF e CNPJ
refactor: organizar serviços e controllers
chore: configurar deploy
```
