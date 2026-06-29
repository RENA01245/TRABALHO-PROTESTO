import { CreateUsuarioInput, UpdateUsuarioInput } from '../validations/usuario.validation';
export declare class UsuarioService {
    findAll(): Promise<{
        email: string;
        id: string;
        nome: string;
        role: import(".prisma/client").$Enums.Role;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findById(id: string): Promise<{
        email: string;
        id: string;
        nome: string;
        role: import(".prisma/client").$Enums.Role;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(data: CreateUsuarioInput): Promise<{
        email: string;
        id: string;
        nome: string;
        role: import(".prisma/client").$Enums.Role;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, data: UpdateUsuarioInput): Promise<{
        email: string;
        id: string;
        nome: string;
        role: import(".prisma/client").$Enums.Role;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    delete(id: string): Promise<void>;
}
export declare const usuarioService: UsuarioService;
//# sourceMappingURL=usuario.service.d.ts.map