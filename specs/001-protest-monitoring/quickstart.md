# Quickstart

## Backend

```bash
cd backend
npm install
cp .env.example .env
npm run prisma:generate
npx prisma migrate deploy
npx prisma db seed
npm run dev
```

## Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Login

```text
admin@protesto.local
Admin@123456
```

## Importação CSV

Use:

```text
backend/examples/protestos-exemplo.csv
```

Na tela:

```text
http://localhost:5173/importar
```

## Boleto

Use:

```text
backend/examples/boleto-exemplo.pdf
```

Abra detalhes de um protesto em `/protestos/:id` e anexe o arquivo.
