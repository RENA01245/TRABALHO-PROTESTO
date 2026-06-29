import { CreateTituloInput, UpdateTituloInput, UpdateTituloStatusInput, TituloFiltersInput } from '../validations/titulo.validation';
export declare class TituloService {
    findAll(filters: TituloFiltersInput): Promise<{
        data: {
            valor: number;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findById(id: string): Promise<{
        valor: number;
    }>;
    create(data: CreateTituloInput, usuarioId: string): Promise<{
        valor: number;
    }>;
    update(id: string, data: UpdateTituloInput, usuarioId: string): Promise<{
        valor: number;
    }>;
    updateStatus(id: string, data: UpdateTituloStatusInput, usuarioId: string): Promise<{
        valor: number;
    }>;
    delete(id: string, usuarioId: string): Promise<void>;
    getHistorico(id: string): Promise<({
        usuario: {
            email: string;
            id: string;
            nome: string;
        };
    } & {
        campo: string | null;
        id: string;
        createdAt: Date;
        usuarioId: string;
        tituloId: string;
        acao: string;
        valorAnterior: string | null;
        valorNovo: string | null;
    })[]>;
    generatePdf(id: string): Promise<Buffer>;
    private formatDocumentoDisplay;
    private formatTitulo;
}
export declare const tituloService: TituloService;
//# sourceMappingURL=titulo.service.d.ts.map