import { prisma } from '../config/database';

export async function generateProtocolo(): Promise<string> {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const datePrefix = `${year}${month}${day}`;
  const prefix = `PROT-${datePrefix}-`;

  const lastTitulo = await prisma.titulo.findFirst({
    where: {
      protocolo: {
        startsWith: prefix,
      },
    },
    orderBy: {
      protocolo: 'desc',
    },
  });

  let sequence = 1;
  if (lastTitulo) {
    const lastSequence = parseInt(lastTitulo.protocolo.split('-')[2], 10);
    sequence = lastSequence + 1;
  }

  const sequenceStr = String(sequence).padStart(5, '0');
  return `${prefix}${sequenceStr}`;
}
