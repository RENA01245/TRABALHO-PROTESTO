# Plan — Plano de Implementação

## 1. Arquitetura Completa

### Camadas Back-end
```
Request → Routes → Middleware (auth/role) → Controller → Service → Prisma → PostgreSQL
                ↘ Validation (Zod)
```

### Camadas Front-end
```
Browser → Router → Page → Components → Service (Axios) → API
                      ↘ Schema (Zod + React Hook Form)
```

---

## 2. Tecnologias

| Camada | Stack |
|---|---|
| UI | React 18 + Vite + TypeScript |
| API | Express + TypeScript |
| ORM | Prisma 6 |
| DB | PostgreSQL (Supabase) |
| Auth | JWT + Bcrypt |
| Docs | Swagger UI Express |
| PDF | PDFKit |

---

## 3. Cronograma Sugerido

| Fase | Atividades | Duração |
|---|---|---|
| 1 | Constitution + Specify | 2 dias |
| 2 | Plan + Tasks | 1 dia |
| 3 | Setup repo, Prisma, Supabase | 1 dia |
| 4 | Auth + Usuários | 2 dias |
| 5 | Credores + Devedores | 2 dias |
| 6 | Títulos + Histórico | 3 dias |
| 7 | Dashboard + PDF | 2 dias |
| 8 | Front-end completo | 4 dias |
| 9 | Testes + Deploy | 2 dias |

---

## 4. Organização das Camadas

### Back-end (`backend/src/`)
- `config/` — env, prisma, swagger
- `controllers/` — HTTP handlers
- `services/` — lógica de negócio
- `middlewares/` — auth, role, errors
- `routes/` — rotas REST
- `validations/` — Zod schemas
- `utils/` — CPF/CNPJ, protocolo

### Front-end (`frontend/src/`)
- `pages/`, `components/`, `services/`, `schemas/`, `routes/`, `styles/`

---

## 5. APIs REST

### Autenticação
| Método | Rota | Auth |
|---|---|---|
| POST | `/api/auth/login` | Não |
| POST | `/api/auth/forgot-password` | Não |
| POST | `/api/auth/reset-password` | Não |
| GET | `/api/auth/me` | Sim |

### Usuários
| Método | Rota | Acesso |
|---|---|---|
| GET/POST/PUT/DELETE | `/api/usuarios` | Create/Delete: ADMIN |

### Credores / Devedores
CRUD em `/api/credores` e `/api/devedores` — delete ADMIN.

### Títulos
| Método | Rota |
|---|---|
| GET | `/api/titulos` (filtros) |
| POST/PUT/DELETE | `/api/titulos` |
| PATCH | `/api/titulos/:id/status` |
| GET | `/api/titulos/:id/historico` |
| GET | `/api/titulos/:id/pdf` |

### Dashboard
| GET | `/api/dashboard` | ADMIN |

---

## 6. Banco de Dados

Enums: `Role`, `TipoDocumento`, `TituloStatus`

Índices únicos: protocolo, email, documento.

---

## 7. Autenticação

Login → Bcrypt → JWT (payload: id, email, role). Middleware `authenticate` + `authorize`.

Recuperação senha: token UUID 1h. **(A DEFINIR)** SMTP.

---

## 8. Segurança

CORS, Zod, RBAC, validação CPF/CNPJ, Bcrypt salt 10.

---

## 9. Deploy

### Supabase
1. Criar projeto
2. Copiar pooler → `DATABASE_URL`
3. Copiar direct → `DIRECT_URL`

### Render
- Root: `backend`
- Build: `npm install && npx prisma generate && npm run build`
- Start: `npx prisma migrate deploy && npm start`

### Vercel
- Root: `frontend`
- Env: `VITE_API_URL`

---

## 10. Testes

Swagger UI, testes manuais E2E. **(A DEFINIR)** CI automatizado.

---

## 11. Riscos

| Risco | Mitigação |
|---|---|
| Pooler vs migrate | DIRECT_URL |
| Cold start Render | Documentar |
| CORS | CORS_ORIGIN correto |
| Domínio | Marcar (A DEFINIR) |

---

## 12. Variáveis de Ambiente

```env
DATABASE_URL=postgresql://...:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://...:5432/postgres
JWT_SECRET=chave-forte
JWT_EXPIRES_IN=7d
PORT=3333
CORS_ORIGIN=http://localhost:5173
VITE_API_URL=http://localhost:3333/api
```

---

## 13. Prisma Migrations

```bash
npx prisma migrate dev    # dev
npx prisma migrate deploy # prod
npx prisma db seed
```
