import app from './app';
import { env } from './config/env';
import { prisma } from './config/database';

async function main() {
  try {
    await prisma.$connect();
    console.log('Conexão com banco de dados estabelecida');

    app.listen(env.PORT, () => {
      console.log(`Servidor rodando na porta ${env.PORT}`);
      console.log(`Documentação Swagger: http://localhost:${env.PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

main();

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
