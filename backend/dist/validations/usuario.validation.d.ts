import { z } from 'zod';
export declare const createUsuarioSchema: z.ZodObject<{
    nome: z.ZodString;
    email: z.ZodString;
    senha: z.ZodString;
    role: z.ZodDefault<z.ZodEnum<["ADMIN", "FUNCIONARIO"]>>;
    ativo: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    email: string;
    senha: string;
    nome: string;
    role: "ADMIN" | "FUNCIONARIO";
    ativo: boolean;
}, {
    email: string;
    senha: string;
    nome: string;
    role?: "ADMIN" | "FUNCIONARIO" | undefined;
    ativo?: boolean | undefined;
}>;
export declare const updateUsuarioSchema: z.ZodObject<{
    nome: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    senha: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodEnum<["ADMIN", "FUNCIONARIO"]>>;
    ativo: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    email?: string | undefined;
    senha?: string | undefined;
    nome?: string | undefined;
    role?: "ADMIN" | "FUNCIONARIO" | undefined;
    ativo?: boolean | undefined;
}, {
    email?: string | undefined;
    senha?: string | undefined;
    nome?: string | undefined;
    role?: "ADMIN" | "FUNCIONARIO" | undefined;
    ativo?: boolean | undefined;
}>;
export declare const usuarioParamsSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export type CreateUsuarioInput = z.infer<typeof createUsuarioSchema>;
export type UpdateUsuarioInput = z.infer<typeof updateUsuarioSchema>;
//# sourceMappingURL=usuario.validation.d.ts.map