# Constitution — Sistema de Gerenciamento de Protesto de Títulos

## 1. Objetivo do Projeto

Desenvolver um sistema web completo para gerenciamento de títulos encaminhados para protesto, simulando o funcionamento de um cartório de protesto. O projeto é desenvolvido como trabalho acadêmico da disciplina de Engenharia de Software, aplicando a metodologia **Spec-Driven Development (SDD)** com o fluxo **Spec Kit**.

O sistema permitirá autenticação de usuários, controle de acesso por perfil, cadastro de credores e devedores, gestão de títulos, alteração de status, emissão de protocolos, histórico de alterações, dashboard administrativo e geração de comprovantes em PDF.

---

## 2. Tecnologias Utilizadas

### Front-end
| Tecnologia | Finalidade |
|---|---|
| React 18 | Biblioteca de interface |
| TypeScript | Tipagem estática |
| Vite | Build tool e dev server |
| React Router | Roteamento SPA |
| Axios | Cliente HTTP |
| React Hook Form | Gerenciamento de formulários |
| Zod | Validação de schemas |
| CSS responsivo | Estilização mobile-first |

### Back-end
| Tecnologia | Finalidade |
|---|---|
| Node.js | Runtime JavaScript |
| Express | Framework HTTP |
| TypeScript | Tipagem estática |
| Prisma | ORM e migrations |
| PostgreSQL (Supabase) | Banco de dados relacional |
| JWT | Autenticação stateless |
| Bcrypt | Hash de senhas |
| Zod | Validação de entrada |
| Swagger/OpenAPI | Documentação da API |
| PDFKit | Geração de comprovantes PDF |

### Infraestrutura
| Serviço | Finalidade |
|---|---|
| Supabase | Hospedagem PostgreSQL |
| Render | Deploy do back-end |
| Vercel | Deploy do front-end |
| Git / GitHub | Versionamento |

---

## 3. Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTE (Browser)                     │
│                   React SPA (Vercel)                         │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS / REST (Axios)
┌──────────────────────────▼──────────────────────────────────┐
│                    API REST (Render)                         │
│  ┌──────────┐  ┌─────────────┐  ┌──────────┐  ┌───────────┐  │
│  │  Routes  │→ │ Controllers │→ │ Services │→ │  Prisma   │  │
│  └──────────┘  └─────────────┘  └──────────┘  └─────┬─────┘  │
│  ┌──────────┐  ┌─────────────┐                        │        │
│  │Middleware│  │ Validations │                        │        │
│  └──────────┘  └─────────────┘                        │        │
└───────────────────────────────────────────────────────┼────────┘
                                                        │
┌───────────────────────────────────────────────────────▼────────┐
│              PostgreSQL (Supabase)                              │
└────────────────────────────────────────────────────────────────┘
```

### Padrão arquitetural
- **Back-end:** MVC adaptado — Routes → Controllers → Services → Prisma (Model)
- **Front-end:** Component-based com separação Pages / Components / Services / Schemas

---

## 4. Padrões de Desenvolvimento

- **SDD:** Requisitos → Especificação → Plano → Tarefas → Implementação
- **Clean Code:** Nomes expressivos, funções pequenas, responsabilidade única
- **RESTful API:** Recursos nomeados, verbos HTTP corretos, status codes semânticos
- **Separation of Concerns:** Camadas desacopladas no back-end
- **Validation at the edge:** Zod no front-end e back-end
- **Fail fast:** Validações antes de persistência

---

## 5. Convenções de Código

### TypeScript
- `camelCase` para variáveis e funções
- `PascalCase` para classes, interfaces e componentes React
- `UPPER_SNAKE_CASE` para constantes de ambiente
- Sufixos: `Controller`, `Service`, `Middleware`, `Schema`

### Commits (Conventional Commits)
```
feat: nova funcionalidade
fix: correção de bug
docs: documentação
chore: configuração/infra
refactor: refatoração
test: testes
```

### Branches
- `main` — produção estável
- `feat/*`, `fix/*` — features e correções

---

## 6. Estrutura de Pastas

```
projeto-protesto/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.ts
│   │   └── migrations/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middlewares/
│       ├── routes/
│       ├── services/
│       ├── validations/
│       ├── utils/
│       ├── app.ts
│       └── server.ts
├── frontend/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── pages/
│       ├── routes/
│       ├── services/
│       ├── schemas/
│       └── styles/
└── docs/
    ├── constitution.md
    ├── schema.md
    ├── plan.md
    └── tasks.md
```

---

## 7. Estratégia de Testes

| Camada | Ferramenta | Escopo |
|---|---|---|
| Validações | Swagger / manual | CPF, CNPJ, Zod |
| API | Swagger UI | Endpoints REST |
| E2E | Manual browser | Fluxos principais |

> **(A DEFINIR):** Framework automatizado (Jest/Vitest) para CI.

---

## 8. Versionamento

- Repositório Git com Conventional Commits
- `.gitignore` exclui `node_modules`, `.env`, `dist`
- Secrets nunca commitados — apenas `.env.example`

---

## 9. Deploy

| Componente | Plataforma |
|---|---|
| Front-end | Vercel |
| Back-end | Render |
| Banco | Supabase PostgreSQL |

### Variáveis obrigatórias

**Back-end:** `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `PORT`, `CORS_ORIGIN`

**Front-end:** `VITE_API_URL`

---

## 10. Princípios de Desenvolvimento

1. Especificação antes de código
2. Segurança por padrão — JWT, Bcrypt, RBAC
3. Rastreabilidade — Histórico de alterações
4. Simplicidade — YAGNI
5. Responsividade
6. Documentação viva — Swagger + docs SDD

---

## 11. Supabase como Banco PostgreSQL

- Supabase fornece instância PostgreSQL gerenciada
- **Não** utiliza Supabase Auth (autenticação JWT própria)
- `DATABASE_URL` — pooler (porta 6543, `?pgbouncer=true`)
- `DIRECT_URL` — conexão direta (porta 5432) para migrations

---

## 12. Prisma com Supabase

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

- Schema em `backend/prisma/schema.prisma`
- Migrations versionadas
- Seed para admin padrão
- Enums: `Role`, `TipoDocumento`, `TituloStatus`

---

## 13. Organização do Repositório

Monorepo com `backend/`, `frontend/` e `docs/` na raiz. Deploy independente de front e back.

---

## 14. Perfis e Controle de Acesso

| Perfil | Código |
|---|---|
| Administrador | `ADMIN` |
| Funcionário | `FUNCIONARIO` |

Autenticação: JWT Bearer no header `Authorization`.
Autorização: middleware verifica `role` do token.

---

## 15. Pontos em Aberto

- **(A DEFINIR)** Tipos específicos de título protestável
- **(A DEFINIR)** Fluxo SMTP para recuperação de senha
- **(A DEFINIR)** Prazos legais de protesto
- **(A DEFINIR)** Testes automatizados em CI
