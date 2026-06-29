import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET é obrigatório'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL é obrigatório'),
  DIRECT_URL: z.string().min(1, 'DIRECT_URL é obrigatório'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Erro na configuração de variáveis de ambiente:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
