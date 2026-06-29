# Sistema de Gerenciamento de Protesto de Títulos

Sistema web completo para gerenciamento de títulos encaminhados para protesto, simulando o funcionamento de um cartório de protesto. Desenvolvido como trabalho acadêmico da disciplina de **Engenharia de Software**, aplicando a metodologia **Spec-Driven Development (SDD)** com o fluxo **Spec Kit**.

---

## Objetivo Acadêmico

Demonstrar a transformação de requisitos em software funcional seguindo rigorosamente as etapas SDD:

1. **Constitution** — `docs/constitution.md`
2. **Specify** — `docs/schema.md`
3. **Plan** — `docs/plan.md`
4. **Tasks** — `docs/tasks.md`
5. **Implement** — código em `backend/` e `frontend/`

---

## Funcionalidades

- Cadastro e autenticação de usuários (JWT + Bcrypt)
- Controle de acesso por perfil (Administrador / Funcionário)
- CRUD de credores, devedores e títulos
- Pesquisa e filtros (protocolo, CPF/CNPJ, nome, status, data)
- Geração automática de protocolo (`PROT-YYYYMMDD-NNNNN`)
- Alteração de status do protesto com histórico
- Dashboard administrativo com indicadores
- Emissão de comprovante em PDF
- Recuperação de senha (token temporário)
- Documentação Swagger/OpenAPI

---

## Tecnologias

| Camada | Stack |
|---|---|
| Front-end | React 18, TypeScript, Vite, React Router, Axios, React Hook Form, Zod |
| Back-end | Node.js, Express, TypeScript, Prisma, JWT, Bcrypt, Zod, PDFKit, Swagger |
| Banco | PostgreSQL (Supabase) |
| Deploy | Vercel (front), Render (back), Supabase (DB) |

---

## Estrutura do Projeto

```
projeto-protesto/
├── backend/          # API REST
│   ├── prisma/       # Schema, migrations, seed
│   └── src/          # Código fonte MVC
├── frontend/         # SPA React
│   └── src/          # Pages, components, services
├── docs/             # Documentação SDD
├── render.yaml       # Config deploy Render
└── README.md
```

---

## Pré-requisitos

- Node.js 18+
- npm 9+
- Conta [Supabase](https://supabase.com) (PostgreSQL)
- Conta [Render](https://render.com) (back-end) — opcional para deploy
- Conta [Vercel](https://vercel.com) (front-end) — opcional para deploy

---

## Configuração do Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um novo projeto
2. Vá em **Project Settings → Database**
3. Copie as connection strings:
   - **Transaction pooler** (porta 6543) → `DATABASE_URL`
   - **Direct connection** (porta 5432) → `DIRECT_URL`
4. Formato esperado:

```env
DATABASE_URL="postgresql://postgres.[ref]:[senha]@aws-0-[regiao].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[ref]:[senha]@aws-0-[regiao].pooler.supabase.com:5432/postgres"
```

---

## Instalação e Execução Local

### Back-end

```bash
cd backend
cp .env.example .env
# Edite .env com DATABASE_URL, DIRECT_URL e JWT_SECRET

npm install
npx prisma generate
npx prisma migrate deploy
npm run prisma:seed
npm run dev
```

API disponível em `http://localhost:3333`  
Swagger em `http://localhost:3333/api-docs`  
Health check em `http://localhost:3333/health`

### Front-end

```bash
cd frontend
cp .env.example .env
# VITE_API_URL=http://localhost:3333/api

npm install
npm run dev
```

App disponível em `http://localhost:5173`

---

## Variáveis de Ambiente

### Back-end (`backend/.env`)

| Variável | Descrição |
|---|---|
| `PORT` | Porta do servidor (padrão: 3333) |
| `JWT_SECRET` | Chave secreta para JWT |
| `JWT_EXPIRES_IN` | Expiração do token (ex: 7d) |
| `DATABASE_URL` | Connection string pooler Supabase |
| `DIRECT_URL` | Connection string direta Supabase |
| `CORS_ORIGIN` | URL do front-end (ex: http://localhost:5173) |

### Front-end (`frontend/.env`)

| Variável | Descrição |
|---|---|
| `VITE_API_URL` | URL base da API (ex: http://localhost:3333/api) |

---

## Comandos Prisma

```bash
cd backend

# Gerar client
npm run prisma:generate

# Criar migration (desenvolvimento)
npm run prisma:migrate

# Aplicar migrations (produção)
npm run prisma:migrate:deploy

# Seed (dados iniciais)
npm run prisma:seed

# Interface visual
npm run prisma:studio
```

---

## Credenciais do Seed

| Perfil | E-mail | Senha |
|---|---|---|
| Administrador | admin@protesto.com | admin123 |
| Funcionário | funcionario@protesto.com | func123 |

---

## Deploy

### Back-end — Render

1. Conecte o repositório GitHub ao Render
2. Use o arquivo `render.yaml` ou configure manualmente:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `npx prisma migrate deploy && npm start`
3. Configure as variáveis de ambiente:
   - `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `CORS_ORIGIN` (URL Vercel)

### Front-end — Vercel

1. Importe o repositório na Vercel
2. **Root Directory:** `frontend`
3. Configure `VITE_API_URL` com a URL do back-end Render (ex: `https://protesto-api.onrender.com/api`)

### Banco — Supabase

- Migrations executadas automaticamente no start do Render
- Ou manualmente: `npx prisma migrate deploy` com `.env` de produção

---

## Prints do Sistema

> Espaço reservado para capturas de tela

| Tela | Print |
|---|---|
| Login | _[inserir print]_ |
| Dashboard | _[inserir print]_ |
| Listagem de Títulos | _[inserir print]_ |
| Cadastro de Título | _[inserir print]_ |
| Detalhe + Histórico | _[inserir print]_ |
| Swagger API | _[inserir print]_ |

---

## Commits Sugeridos (Conventional Commits)

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

---

## Organização do GitHub

- Branch `main` — código estável
- README com instruções completas
- Documentação SDD em `docs/`
- Issues e PRs com descrição clara
- Secrets apenas nas plataformas de deploy (nunca no repositório)

---

## Documentação SDD

| Etapa | Arquivo |
|---|---|
| Constitution | [docs/constitution.md](docs/constitution.md) |
| Specify | [docs/schema.md](docs/schema.md) |
| Plan | [docs/plan.md](docs/plan.md) |
| Tasks | [docs/tasks.md](docs/tasks.md) |

---

## Pontos em Aberto (A DEFINIR)

- Tipos formais de título protestável (duplicata, cheque, etc.)
- Regras legais de transição de status
- Envio de e-mail SMTP para recuperação de senha
- Suite de testes automatizados

---

## Licença

Projeto acadêmico — uso educacional.
