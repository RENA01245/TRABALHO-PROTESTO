# Constitution — Sistema de Gerenciamento de Protesto de Títulos

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

```
projeto-protesto/
├── backend/
├── frontend/
└── docs/
```

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

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

Autenticação própria JWT — Supabase Auth não obrigatório.

## 11. Pontos em Aberto

- **(A DEFINIR)** Tipos formais de título protestável
- **(A DEFINIR)** SMTP para recuperação de senha
- **(A DEFINIR)** Prazos legais de protesto
