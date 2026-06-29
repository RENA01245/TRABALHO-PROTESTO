# Constitution

## Objetivo do Projeto

Desenvolver um Sistema de Gerenciamento e Monitoramento de Protestos para uso academico em Engenharia de Software, aplicando Spec-Driven Development e entregando documentacao, front-end, back-end, banco de dados e preparacao para deploy. O foco atualizado do banco e a importacao de arquivos, monitoramento de protestos, boletos, pagamentos, pendencias e historico.

## Tecnologias Utilizadas

- React, TypeScript e Vite no front-end.
- Node.js, Express e TypeScript no back-end.
- PostgreSQL hospedado no Supabase.
- Prisma ORM com migrations, seed e conexao por `DATABASE_URL` e `DIRECT_URL`.
- JWT para autenticacao e Bcrypt para criptografia de senhas.
- Zod para validacao.
- Swagger/OpenAPI para documentacao da API.

## Arquitetura

O repositorio usa uma arquitetura em camadas:

- `frontend`: interface web e consumo da API.
- `backend/src/routes`: roteamento HTTP.
- `backend/src/controllers`: orquestracao de requisicoes.
- `backend/src/services`: regras de negocio e persistencia.
- `backend/src/validations`: schemas Zod.
- `backend/prisma`: modelo de dados, migrations e seed.
- `docs`: artefatos SDD.

## Padroes de Desenvolvimento

- Codigo TypeScript estrito.
- Separacao entre controller, service, middleware e validacao.
- Erros tratados por middleware central.
- Validacao de entrada antes das regras de negocio.
- Senhas nunca retornadas pela API.
- Regras criticas registradas em historico.

## Convencoes de Codigo

- Nomes em ingles no codigo e documentacao em portugues.
- Entidades Prisma em PascalCase.
- Variaveis e funcoes em camelCase.
- Rotas REST no plural.
- Commits com Conventional Commits.

## Estrutura de Pastas

```text
backend/
  prisma/
  src/config
  src/controllers
  src/middlewares
  src/routes
  src/services
  src/utils
  src/validations
frontend/
  src/components
  src/pages
  src/routes
  src/services
  src/schemas
  src/styles
docs/
```

## Estrategia de Testes

- Testes unitarios para validacoes, geracao de protocolo e regras de permissao.
- Testes de integracao para autenticacao, CRUDs, filtros e alteracao de status.
- Testes manuais de interface para responsividade e fluxos principais.
- Testes de deploy com migrations no Supabase antes da publicacao final.

## Versionamento

O projeto deve ser mantido em GitHub com branch principal protegida e commits pequenos seguindo Conventional Commits.

## Deploy

- Front-end publicado na Vercel.
- Back-end publicado na Render.
- Banco PostgreSQL hospedado no Supabase.

## Principios

- Rastreabilidade entre requisito, tarefa e implementacao.
- Integridade dos dados de protesto.
- Controle de acesso por perfil.
- Auditoria de alteracoes.
- Configuracao sensivel via variaveis de ambiente.

## Atualizacao de Escopo do Banco

O modelo oficial passa a contemplar `ImportBatch`, `ImportError`, `Protest`, `ProtestAttachment`, `ProtestHistory` e `PaymentInfo`, mantendo `User`, `Creditor` e `Debtor`. O sistema deve priorizar protestos importados por arquivo e o acompanhamento de status, boleto, pagamento, pendencias e retorno operacional.

## Interface e Verificacao

A interface deve expor rotas protegidas para dashboard, protestos, detalhes, importacao de arquivo, usuarios e relatorios. O layout deve manter padrao administrativo, com menu lateral, cabecalho, cards, tabelas, badges de status, mensagens de erro/sucesso e loading em operacoes de dados.
