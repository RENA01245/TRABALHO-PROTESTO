# Plan

## Arquitetura Completa

O sistema sera dividido em front-end React e back-end Express. O back-end expoe API REST, usa Prisma para persistencia e autentica usuarios com JWT. O PostgreSQL oficial e hospedado no Supabase. O banco foi atualizado para monitoramento de protestos importados por arquivo, com lotes, erros, anexos, pagamentos e historico.

## Camadas

- Presentation: paginas React, componentes e formularios.
- API: rotas Express e Swagger.
- Application: services com regras de negocio.
- Persistence: Prisma Client e PostgreSQL.
- Cross-cutting: auth, autorizacao, validacao, tratamento de erro e PDF.

## APIs

- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/recover-password`
- `GET/POST/PUT/DELETE /api/users`
- `GET/POST/PUT/DELETE /api/creditors`
- `GET/POST/PUT/DELETE /api/debtors`
- `GET/POST/PUT/DELETE /api/titles`
- `PATCH /api/titles/:id/status`
- `GET /api/titles/:id/receipt`
- `GET/POST /api/imports`
- `POST /api/titles/:id/attachments`
- `POST /api/titles/:id/payments`
- `GET /api/dashboard`

## Fluxo de Importacao

O front-end envia arquivo por `multipart/form-data` para `POST /api/imports`. O back-end recebe via Multer, valida extensao, tamanho, conteudo vazio, cabecalho CSV e campos obrigatorios. Registros validos criam ou atualizam credores, devedores e protestos. Registros invalidos geram `ImportError` associados ao `ImportBatch`.

Formatos aceitos na interface: CSV, TXT e JSON. O processamento operacional implementado para teste academico e CSV. Layout SIMPROT/CRA: (A DEFINIR).

## Banco de Dados

Prisma gerencia enums, indices, relacionamentos e constraints. Supabase fornece PostgreSQL. `DATABASE_URL` usa pooler; `DIRECT_URL` usa conexao direta para migrations.

## Autenticacao e Seguranca

- Senha armazenada com Bcrypt.
- JWT assinado por `JWT_SECRET`.
- Middleware `authenticate` protege rotas.
- Middleware `authorize` restringe acoes administrativas.
- CORS configurado por `CORS_ORIGIN`.
- Validacao Zod em entradas.

## Cronograma

1. Dia 1: Constitution e Specify.
2. Dia 2: Plan, Tasks e modelagem Prisma.
3. Dia 3: autenticacao e CRUDs base.
4. Dia 4: titulos, historico, dashboard e PDF.
5. Dia 5: front-end, responsividade e integracao.
6. Dia 6: Swagger, testes manuais, seed e ajustes.
7. Dia 7: deploy Vercel, Render e Supabase.

## Testes

- Validar login, CRUDs, filtros e permissoes.
- Validar migrations em Supabase.
- Validar build do back-end e front-end.
- Validar responsividade em desktop e mobile.

## Riscos

- String de conexao Supabase incorreta.
- Regras cartorarias nao especificadas.
- Envio real de email para recuperacao de senha (A DEFINIR).
- Permissoes de banco em deploy.

## Deploy

Render executa `npm run build` e `npm run start` no back-end. Vercel publica `frontend/dist`. Supabase hospeda PostgreSQL e recebe migrations via Prisma.
