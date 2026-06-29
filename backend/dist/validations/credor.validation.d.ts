import { z } from 'zod';
export declare const createCredorSchema: z.ZodEffects<z.ZodObject<{
    nome: z.ZodString;
    documento: z.ZodString;
    tipoDocumento: z.ZodEnum<["CPF", "CNPJ"]>;
    email: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    telefone: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    endereco: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    nome: string;
    documento: string;
    tipoDocumento: "CPF" | "CNPJ";
    email?: string | null | undefined;
    telefone?: string | null | undefined;
    endereco?: string | null | undefined;
}, {
    nome: string;
    documento: string;
    tipoDocumento: "CPF" | "CNPJ";
    email?: string | null | undefined;
    telefone?: string | null | undefined;
    endereco?: string | null | undefined;
}>, {
    nome: string;
    documento: string;
    tipoDocumento: "CPF" | "CNPJ";
    email?: string | null | undefined;
    telefone?: string | null | undefined;
    endereco?: string | null | undefined;
}, {
    nome: string;
    documento: string;
    tipoDocumento: "CPF" | "CNPJ";
    email?: string | null | undefined;
    telefone?: string | null | undefined;
    endereco?: string | null | undefined;
}>;
export declare const updateCredorSchema: z.ZodEffects<z.ZodObject<{
    nome: z.ZodOptional<z.ZodString>;
    documento: z.ZodOptional<z.ZodString>;
    tipoDocumento: z.ZodOptional<z.ZodEnum<["CPF", "CNPJ"]>>;
    email: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    telefone: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    endereco: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    email?: string | null | undefined;
    nome?: string | undefined;
    documento?: string | undefined;
    tipoDocumento?: "CPF" | "CNPJ" | undefined;
    telefone?: string | null | undefined;
    endereco?: string | null | undefined;
}, {
    email?: string | null | undefined;
    nome?: string | undefined;
    documento?: string | undefined;
    tipoDocumento?: "CPF" | "CNPJ" | undefined;
    telefone?: string | null | undefined;
    endereco?: string | null | undefined;
}>, {
    email?: string | null | undefined;
    nome?: string | undefined;
    documento?: string | undefined;
    tipoDocumento?: "CPF" | "CNPJ" | undefined;
    telefone?: string | null | undefined;
    endereco?: string | null | undefined;
}, {
    email?: string | null | undefined;
    nome?: string | undefined;
    documento?: string | undefined;
    tipoDocumento?: "CPF" | "CNPJ" | undefined;
    telefone?: string | null | undefined;
    endereco?: string | null | undefined;
}>;
export declare const credorParamsSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export type CreateCredorInput = z.infer<typeof createCredorSchema>;
export type UpdateCredorInput = z.infer<typeof updateCredorSchema>;
//# sourceMappingURL=credor.validation.d.ts.map