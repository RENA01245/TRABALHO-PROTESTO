# Research: Sistema de Monitoramento de Protestos Importados

## Decisões

- **Banco oficial**: PostgreSQL no Supabase.
- **ORM**: Prisma, pois atende migrations, seed, relacionamentos e tipagem TypeScript.
- **Autenticação**: JWT + Bcrypt com tabela propria `User`, conforme requisito.
- **Importação**: Multer em memória + parser CSV simples para o formato academico definido.
- **Anexos**: Supabase Storage opcional; fallback local para teste quando bucket nao estiver configurado.
- **Frontend**: React + Vite com React Router e Axios.

## Alternativas Consideradas

- Supabase Auth: rejeitado porque o requisito definiu JWT/Bcrypt no backend.
- Neon: rejeitado porque o banco oficial deve ser Supabase PostgreSQL.
- Parser SIMPROT/CRA real: adiado porque layout esta (A DEFINIR).

## Riscos

- Senhas ou URLs do Supabase com caracteres especiais precisam de URL encoding.
- Sem bucket Supabase configurado, anexos reais nao ficam publicos; o fluxo local usa `local://`.
- CSV real pode divergir do modelo academico definido.
