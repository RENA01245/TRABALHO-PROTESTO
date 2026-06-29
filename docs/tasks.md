# Tasks

## T01 Configurar Repositorio

- Descricao: criar monorepo com `backend`, `frontend` e `docs`.
- Subtarefas: adicionar `.gitignore`, README, estrutura base.
- Dependencias: nenhuma.
- Resultado esperado: repositorio organizado.

## T02 Configurar Git

- Descricao: iniciar versionamento.
- Subtarefas: `git init`, branch principal, commits Conventional Commits.
- Dependencias: T01.
- Resultado esperado: historico rastreavel.

## T03 Configurar Backend

- Descricao: criar API Node.js com Express e TypeScript.
- Subtarefas: package, tsconfig, app, server, middlewares.
- Dependencias: T01.
- Resultado esperado: API executavel.

## T04 Configurar Supabase

- Descricao: criar projeto Supabase e obter strings PostgreSQL.
- Subtarefas: configurar `DATABASE_URL`, `DIRECT_URL`, liberar conexao.
- Dependencias: conta Supabase.
- Resultado esperado: banco disponivel.

## T05 Configurar Prisma

- Descricao: modelar banco.
- Subtarefas: schema, enums, constraints, indices, migrations, seed.
- Dependencias: T04.
- Resultado esperado: banco migrado.

## T06 Autenticacao

- Descricao: implementar login JWT e Bcrypt.
- Subtarefas: usuario seed, middleware auth, endpoint me, recuperacao administrativa.
- Dependencias: T03, T05.
- Resultado esperado: acesso protegido.

## T07 Usuarios

- Descricao: CRUD de usuarios.
- Subtarefas: criar, listar, editar, excluir, validar perfil admin.
- Dependencias: T06.
- Resultado esperado: administracao de contas.

## T08 Credores

- Descricao: CRUD de credores.
- Subtarefas: validacao CPF/CNPJ, listagem, filtros simples.
- Dependencias: T06.
- Resultado esperado: credores persistidos.

## T09 Devedores

- Descricao: CRUD de devedores.
- Subtarefas: validacao CPF/CNPJ, listagem, filtros simples.
- Dependencias: T06.
- Resultado esperado: devedores persistidos.

## T10 Protestos Importados

- Descricao: CRUD de protestos importados ou cadastrados manualmente.
- Subtarefas: gerar protocolo, validar valor/data, relacionar credor/devedor, vincular lote de importacao, filtros.
- Dependencias: T08, T09.
- Resultado esperado: protestos monitorados.

## T11 Status, Pagamento, Boleto e Historico

- Descricao: alterar status, registrar anexos, boletos, pagamentos e auditar.
- Subtarefas: endpoint PATCH, endpoint de anexos, endpoint de pagamento, registro de usuario e valores alterados.
- Dependencias: T10.
- Resultado esperado: trilha de auditoria.

## T12 Dashboard

- Descricao: indicadores administrativos.
- Subtarefas: totais, soma de valores, distribuicao por status, ultimos titulos.
- Dependencias: T10.
- Resultado esperado: painel funcional.

## T13 PDF

- Descricao: emitir comprovante.
- Subtarefas: gerar PDFKit com protocolo, partes, valor e status.
- Dependencias: T10.
- Resultado esperado: download de PDF.

## T14 Swagger

- Descricao: documentar API.
- Subtarefas: OpenAPI em codigo e rota `/api/docs`.
- Dependencias: T03.
- Resultado esperado: documentacao navegavel.

## T15 Frontend

- Descricao: implementar React.
- Subtarefas: login, layout, dashboard, usuarios, credores, devedores, titulos, filtros, status, PDF.
- Dependencias: T06-T14.
- Resultado esperado: interface responsiva.

## T16 Testes

- Descricao: validar fluxos.
- Subtarefas: builds, testes manuais, permissao admin, filtros e PDF.
- Dependencias: T15.
- Resultado esperado: sistema pronto para apresentacao.

## T17 Deploy

- Descricao: publicar.
- Subtarefas: Vercel, Render, Supabase, envs, migrations deploy, seed.
- Dependencias: T16.
- Resultado esperado: URLs publicas.

## T18 Verificacao Completa

- Descricao: validar fluxo ponta a ponta apos melhoria de layout e upload.
- Subtarefas: login, importacao CSV, listagem, filtros, detalhes, status, boleto, pagamento, historico, dashboard, relatorios, builds e audits.
- Dependencias: T15, T16.
- Resultado esperado: sistema pronto para apresentacao academica.

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
chore: configurar deploy
```
