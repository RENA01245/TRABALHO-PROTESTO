"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardService = exports.DashboardService = void 0;
const database_1 = require("../config/database");
class DashboardService {
    async getDashboard() {
        const [statusCounts, totalTitulos, valorAggregate, titulosRecentes] = await Promise.all([
            database_1.prisma.titulo.groupBy({
                by: ['status'],
                _count: { status: true },
            }),
            database_1.prisma.titulo.count(),
            database_1.prisma.titulo.aggregate({
                _sum: { valor: true },
            }),
            database_1.prisma.titulo.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: {
                    credor: { select: { id: true, nome: true, documento: true } },
                    devedor: { select: { id: true, nome: true, documento: true } },
                },
            }),
        ]);
        const totaisPorStatus = {
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
exports.DashboardService = DashboardService;
exports.dashboardService = new DashboardService();
//# sourceMappingURL=dashboard.service.js.map