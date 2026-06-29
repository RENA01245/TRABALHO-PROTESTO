import { prisma } from '../config/database';

export class DashboardService {
  async getDashboard() {
    const [statusCounts, totalTitulos, valorAggregate, titulosRecentes] = await Promise.all([
      prisma.titulo.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      prisma.titulo.count(),
      prisma.titulo.aggregate({
        _sum: { valor: true },
      }),
      prisma.titulo.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          credor: { select: { id: true, nome: true, documento: true } },
          devedor: { select: { id: true, nome: true, documento: true } },
        },
      }),
    ]);

    const totaisPorStatus: Record<string, number> = {
      PENDENTE: 0,
      EM_ANALISE: 0,
      PROTESTADO: 0,
      CANCELADO: 0,
      RETIRADO: 0,
      PAGO: 0,
    };

    for (const item of statusCounts) {
      totaisPorStatus[item.status] = item._count.status;
    }

    return {
      totaisPorStatus,
      totalTitulos,
      valorTotal: Number(valorAggregate._sum.valor ?? 0),
      titulosRecentes: titulosRecentes.map((t) => ({
        ...t,
        valor: Number(t.valor),
      })),
    };
  }
}

export const dashboardService = new DashboardService();
