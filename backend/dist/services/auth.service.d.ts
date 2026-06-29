import { LoginInput, ForgotPasswordInput, ResetPasswordInput } from '../validations/auth.validation';
export declare class AuthService {
    login(data: LoginInput): Promise<{
        token: string;
        usuario: {
            email: string;
            id: string;
            nome: string;
            role: import(".prisma/client").$Enums.Role;
            ativo: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    me(userId: string): Promise<{
        email: string;
        id: string;
        nome: string;
        role: import(".prisma/client").$Enums.Role;
        ativo: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    forgotPassword(data: ForgotPasswordInput): Promise<{
        message: string;
        token?: undefined;
        expiresAt?: undefined;
    } | {
        message: string;
        token: string;
        expiresAt: Date;
    }>;
    resetPassword(data: ResetPasswordInput): Promise<{
        message: string;
    }>;
}
export declare const authService: AuthService;
//# sourceMappingURL=auth.service.d.ts.map