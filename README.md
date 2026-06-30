# Sistema de Gerenciamento de Protesto de Titulos

Projeto academico desenvolvido com Spec-Driven Development (SDD) seguindo o fluxo Constitution, Specify, Plan, Tasks e Implement.

## Spec Kit Oficial

Este repositorio tambem foi estruturado com o CLI oficial do GitHub Spec Kit (`specify`) a partir do pacote `github/spec-kit`.

Evidencias no projeto:

- `.specify/memory/constitution.md`
- `.specify/templates/`
- `.specify/scripts/`
- `.codex/commands/speckit.*.md`
- `specs/001-protest-monitoring/spec.md`
- `specs/001-protest-monitoring/plan.md`
- `specs/001-protest-monitoring/tasks.md`
- `specs/001-protest-monitoring/research.md`
- `specs/001-protest-monitoring/data-model.md`
- `specs/001-protest-monitoring/quickstart.md`
- `specs/001-protest-monitoring/contracts/openapi.yaml`

Comandos oficiais usados:

```bash
uvx --from git+https://github.com/github/spec-kit.git specify check
powershell -ExecutionPolicy Bypass -File .specify/scripts/powershell/create-new-feature.ps1 -Json -ShortName protest-monitoring "Sistema de Monitoramento de Protestos Importados por Arquivo"
powershell -ExecutionPolicy Bypass -File .specify/scripts/powershell/setup-plan.ps1 -Json
powershell -ExecutionPolicy Bypass -File .specify/scripts/powershell/setup-tasks.ps1 -Json
```

## Objetivo

O sistema simula a operacao de monitoramento de protestos importados por arquivo, permitindo autenticar usuarios, registrar lotes de importacao, auditar erros de arquivo, gerenciar credores, devedores e protestos, acompanhar pendencias de boleto e pagamento, alterar status, emitir protocolos, gerar comprovantes em PDF e consultar indicadores administrativos.

## Tecnologias

- Front-end: React, TypeScript, Vite, React Router, Axios, React Hook Form, Zod.
- Back-end: Node.js, Express, TypeScript, Prisma, JWT, Bcrypt, Zod, Swagger/OpenAPI.
- Banco: PostgreSQL hospedado no Supabase, acessado pelo Prisma.
- Deploy: Vercel para front-end, Render para back-end, Supabase para banco.

## Estrutura

```text
backend/   API REST, Prisma, regras de negocio e Swagger
frontend/  Aplicacao React responsiva
docs/      Artefatos SDD
```

Repositorio GitHub indicado para publicacao: [RENA01245/TRABALHO-PROTESTO.git](https://github.com/RENA01245/TRABALHO-PROTESTO.git).

## Execucao Local

Backend:

```bash
cd backend
npm install
cp .env.example .env
npx prisma migrate dev
npx prisma db seed
npm run dev
```

## Teste de Importacao

Use o arquivo de exemplo:

```text
backend/examples/protestos-exemplo.csv
```

Fluxo:

1. Acesse `http://localhost:5173`.
2. Entre com `admin@protesto.local` e `Admin@123456`.
3. Abra `Importar Arquivo`.
4. Selecione `backend/examples/protestos-exemplo.csv`.
5. Clique em `Importar Arquivo`.
6. Confira o resumo da importacao.
7. Abra `Protestos` para consultar, filtrar e acessar detalhes.

Formatos aceitos no upload de importacao: CSV, TXT e JSON. O processamento principal implementado e CSV; JSON e layout SIMPROT/CRA permanecem (A DEFINIR).

## Boleto, Pagamento e Historico

Na tela de detalhes do protesto e possivel:

- alterar status e registrar pendencia por observacao;
- anexar boleto em PDF ou imagem;
- informar valor e vencimento do boleto;
- registrar pagamento com valor, data, forma, status e observacao;
- visualizar historico de importacao, status, boleto e pagamento.

Arquivo de boleto para teste:

```text
backend/examples/boleto-exemplo.pdf
```

Frontend:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Supabase

1. Crie um projeto no Supabase.
2. Acesse Project Settings > Database.
3. Copie a connection string pooled para `DATABASE_URL`.
4. Copie a connection string direta para `DIRECT_URL`.
5. Configure as mesmas variaveis no Render.
6. Execute `npx prisma migrate deploy` no ambiente de deploy ou em uma maquina autorizada.
7. Execute `npx prisma db seed` para criar os usuarios iniciais e dados de exemplo.
8. Se utilizar boletos reais, crie um bucket no Supabase Storage chamado `boletos` e configure `SUPABASE_BUCKET`.

## Variaveis de Ambiente

Backend:

```env
DATABASE_URL=
DIRECT_URL=
JWT_SECRET=
PORT=3333
CORS_ORIGIN=http://localhost:5173
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_BUCKET=boletos
```

Frontend:

```env
VITE_API_URL=http://localhost:3333/api
```

## Prisma

```bash
npx prisma generate
npx prisma migrate dev
npx prisma migrate deploy
npx prisma db seed
npx prisma studio
```

## Credenciais Seed

- Email: `admin@protesto.local`
- Senha: `Admin@123456`
- Email funcionario: `funcionario@protesto.local`
- Senha funcionario: `Funcionario@123`

## Deploy

Vercel:

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Variavel: `VITE_API_URL=https://sua-api.onrender.com/api`

Render:

- Root directory: `backend`
- Build command: `npm install && npm run prisma:generate && npm run build`
- Start command: `npm run start`
- Variaveis: `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `PORT`, `CORS_ORIGIN`.

Supabase:

- Banco oficial PostgreSQL.
- Prisma usa `DATABASE_URL` para pooling e `DIRECT_URL` para migrations.

## Prints

- Login: adicionar print em `docs/prints/login.png`.
- Dashboard: adicionar print em `docs/prints/dashboard.png`.
- Protestos: adicionar print em `docs/prints/titulos.png`.

## Commits Sugeridos

```text
chore: configurar estrutura inicial do projeto
docs: adicionar documentacao SDD
feat: implementar autenticacao JWT
feat: implementar CRUD de usuarios
feat: implementar CRUD de credores
feat: implementar CRUD de devedores
feat: implementar CRUD de titulos
feat: implementar dashboard administrativo
feat: implementar geracao de PDF
fix: ajustar validacoes de CPF e CNPJ
refactor: organizar servicos e controllers
chore: configurar deploy
```
