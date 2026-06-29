export declare class DashboardService {
    getDashboard(): Promise<{
        totaisPorStatus: Record<string, number>;
        totalTitulos: number;
        valorTotal: number;
        titulosRecentes: {
            valor: number;
            credor: {
                id: string;
                nome: string;
                documento: string;
            };
            devedor: {
                id: string;
                nome: string;
                documento: string;
            };
            status: import(".prisma/client").$Enums.TituloStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            credorId: string;
            devedorId: string;
            protocolo: string;
            dataVencimento: Date;
            dataProtesto: Date | null;
            tipoTitulo: string;
            observacoes: string | null;
        }[];
    }>;
}
export declare const dashboardService: DashboardService;
//# sourceMappingURL=dashboard.service.d.ts.map