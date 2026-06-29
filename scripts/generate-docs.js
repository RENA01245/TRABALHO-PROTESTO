const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const docsDir = path.join(root, 'docs');
fs.mkdirSync(docsDir, { recursive: true });

const files = {
  'constitution.md': `# Constitution — Sistema de Gerenciamento de Protesto de Títulos

## 1. Objetivo do Projeto

Desenvolver um sistema web completo para gerenciamento de títulos encaminhados para protesto, simulando o funcionamento de um cartório de protesto. Trabalho acadêmico de Engenharia de Software aplicando **Spec-Driven Development (SDD)** com **Spec Kit**.

## 2. Tecnologias

**Front-end:** React 18, TypeScript, Vite, React Router, Axios, React Hook Form, Zod, CSS responsivo.

**Back-end:** Node.js, Express, TypeScript, Prisma, PostgreSQL (Supabase), JWT, Bcrypt, Zod, Swagger, PDFKit.

**Deploy:** Vercel (front), Render (back), Supabase (banco).

## 3. Arquitetura

- **Back-end:** Routes → Controllers → Services → Prisma (MVC)
- **Front-end:** Pages → Components → Services → API

## 4. Padrões

SDD, Clean Code, REST, validação Zod nas bordas, Conventional Commits.

## 5. Estrutura de Pastas

\`\`\`
projeto-protesto/
├── backend/
├── frontend/
└── docs/
\`\`\`

## 6. Testes

Validação manual via Swagger e fluxos E2E manuais. **(A DEFINIR)** suite automatizada.

## 7. Versionamento

Git, .gitignore, secrets apenas em .env.example.

## 8. Deploy

| Componente | Plataforma |
|---|---|
| Front-end | Vercel |
| Back-end | Render |
| Banco | Supabase |

## 9. Princípios

Especificação antes de código, segurança por padrão, rastreabilidade via histórico, simplicidade, responsividade.

## 10. Supabase + Prisma

\`\`\`prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
\`\`\`

Autenticação própria JWT — Supabase Auth não obrigatório.

## 11. Pontos em Aberto

- **(A DEFINIR)** Tipos formais de título protestável
- **(A DEFINIR)** SMTP para recuperação de senha
- **(A DEFINIR)** Prazos legais de protesto
`,

  'schema.md': `# Specify — Especificação do Sistema

## 1. Visão Geral

Sistema web para gerenciamento de títulos encaminhados para protesto em ambiente cartorial simulado.

## 2. Requisitos Funcionais

RF01–RF15: cadastro usuários, auth, recuperação senha, CRUD credores/devedores/títulos, filtros, status, protocolo, histórico, PDF, dashboard.

## 3. Requisitos Não Funcionais

RNF01–RNF18: React, Node, TypeScript, Supabase, REST, Prisma, JWT, Bcrypt, responsivo, deploy Vercel/Render.

## 4. Casos de Uso

UC01 Login, UC02 Cadastro usuário (ADMIN), UC03 Devedor, UC04 Credor, UC05 Título, UC06 Status, UC07 Pesquisa, UC08 PDF, UC09 Dashboard, UC10 Recuperar senha **(A DEFINIR SMTP)**.

## 5. Entidades

Usuario, Credor, Devedor, Titulo, HistoricoTitulo, PasswordResetToken — ver schema Prisma.

## 6. Status do Protesto

PENDENTE, EM_ANALISE, PROTESTADO, CANCELADO, RETIRADO, PAGO.

> **(A DEFINIR):** Transições válidas entre statuses.

## 7. Regras de Negócio

RN01–RN14 conforme especificação do projeto.

## 8. DER

\`\`\`mermaid
erDiagram
    Usuario ||--o{ HistoricoTitulo : registra
    Credor ||--o{ Titulo : possui
    Devedor ||--o{ Titulo : possui
    Titulo ||--o{ HistoricoTitulo : possui
\`\`\`

## 9. Validações

CPF/CNPJ com dígitos verificadores, valor > 0, protocolo PROT-YYYYMMDD-NNNNN.

## 10. Pontos em Aberto

- **(A DEFINIR)** Tipos de título (duplicata, cheque, etc.)
- **(A DEFINIR)** Regras de transição de status
- **(A DEFINIR)** Campos obrigatórios de endereço
`,

  'plan.md': `# Plan — Plano de Implementação

## Arquitetura

Request → Routes → Middleware → Controller → Service → Prisma → PostgreSQL

## APIs

- \`/api/auth/*\` — login, forgot/reset password, me
- \`/api/usuarios\` — CRUD (ADMIN create/delete)
- \`/api/credores\`, \`/api/devedores\` — CRUD (delete ADMIN)
- \`/api/titulos\` — CRUD, filtros, status, histórico, PDF
- \`/api/dashboard\` — indicadores (ADMIN)

## Autenticação

JWT + Bcrypt, middleware authenticate + authorize.

## Deploy

**Supabase:** DATABASE_URL (pooler 6543), DIRECT_URL (5432).

**Render:** root backend, build + prisma migrate deploy + start.

**Vercel:** root frontend, VITE_API_URL.

## Riscos

Pooler vs migrations, cold start Render, CORS, domínio incompleto.
`,

  'tasks.md': `# Tasks — Roadmap Detalhado

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
- **Commit sugerido:** \`chore: configurar estrutura inicial do projeto\`
- **Resultado:** npm run dev funcional

### T3.2 Schema Prisma + migrations
- **Commit:** \`feat: criar schema prisma e migrations\`
- **Resultado:** Tabelas criadas

### T3.3 Seed
- **Commit:** \`chore: adicionar seed de dados iniciais\`
- **Resultado:** Admin e dados exemplo

### T3.4 Autenticação JWT
- **Commit:** \`feat: implementar autenticação JWT\`
- **Resultado:** Login/logout/me

### T3.5 CRUD Usuários
- **Commit:** \`feat: implementar CRUD de usuários\`

### T3.6 CRUD Credores
- **Commit:** \`feat: implementar CRUD de credores\`

### T3.7 CRUD Devedores
- **Commit:** \`feat: implementar CRUD de devedores\`

### T3.8 CRUD Títulos + protocolo + histórico
- **Commit:** \`feat: implementar CRUD de títulos\`

### T3.9 Dashboard
- **Commit:** \`feat: implementar dashboard administrativo\`

### T3.10 PDF + Swagger
- **Commit:** \`feat: implementar geração de PDF\`

## Fase 4 — Frontend

### T4.1 Setup Vite + React
- **Resultado:** npm run dev

### T4.2 Auth + rotas protegidas
- **Commit:** \`feat: implementar telas de autenticação\`

### T4.3 Páginas CRUD
- **Commits:** feat por módulo

### T4.4 Dashboard + filtros
- **Resultado:** UI completa responsiva

## Fase 5 — Deploy

### T5.1 Render
- **Commit:** \`chore: configurar deploy\`

### T5.2 Vercel
- **Resultado:** App publicada

## Commits Sugeridos

\`\`\`
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
\`\`\`
`
};

for (const [name, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(docsDir, name), content, 'utf8');
  console.log('Written', name);
}
