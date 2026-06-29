import { CreateCredorInput, UpdateCredorInput } from '../validations/credor.validation';
export declare class CredorService {
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
    create(data: CreateCredorInput): Promise<{
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
    update(id: string, data: UpdateCredorInput): Promise<{
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
export declare const credorService: CredorService;
//# sourceMappingURL=credor.service.d.ts.map