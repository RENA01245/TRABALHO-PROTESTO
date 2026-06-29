import { CreateDevedorInput, UpdateDevedorInput } from '../validations/devedor.validation';
export declare class DevedorService {
    findAll(): Promise<{
        email: string | null;
        id: string;
        nome: string;
        createdAt: Date;
        updatedAt: Date;
        documento: string;
        tipoDocumento: import(".prisma/client").$Enums.TipoDocumento;
        telefone: string | null;
        endereco: string | null;
    }[]>;
    findById(id: string): Promise<{
        email: string | null;
        id: string;
        nome: string;
        createdAt: Date;
        updatedAt: Date;
        documento: string;
        tipoDocumento: import(".prisma/client").$Enums.TipoDocumento;
        telefone: string | null;
        endereco: string | null;
    }>;
    create(data: CreateDevedorInput): Promise<{
        email: string | null;
        id: string;
        nome: string;
        createdAt: Date;
        updatedAt: Date;
        documento: string;
        tipoDocumento: import(".prisma/client").$Enums.TipoDocumento;
        telefone: string | null;
        endereco: string | null;
    }>;
    update(id: string, data: UpdateDevedorInput): Promise<{
        email: string | null;
        id: string;
        nome: string;
        createdAt: Date;
        updatedAt: Date;
        documento: string;
        tipoDocumento: import(".prisma/client").$Enums.TipoDocumento;
        telefone: string | null;
        endereco: string | null;
    }>;
    delete(id: string): Promise<void>;
}
export declare const devedorService: DevedorService;
//# sourceMappingURL=devedor.service.d.ts.map