import { z } from 'zod';
export declare const createTituloSchema: z.ZodObject<{
    credorId: z.ZodString;
    devedorId: z.ZodString;
    valor: z.ZodNumber;
    dataVencimento: z.ZodDate;
    dataProtesto: z.ZodNullable<z.ZodOptional<z.ZodDate>>;
    tipoTitulo: z.ZodString;
    observacoes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    credorId: string;
    devedorId: string;
    valor: number;
    dataVencimento: Date;
    tipoTitulo: string;
    dataProtesto?: Date | null | undefined;
    observacoes?: string | null | undefined;
}, {
    credorId: string;
    devedorId: string;
    valor: number;
    dataVencimento: Date;
    tipoTitulo: string;
    dataProtesto?: Date | null | undefined;
    observacoes?: string | null | undefined;
}>;
export declare const updateTituloSchema: z.ZodObject<{
    credorId: z.ZodOptional<z.ZodString>;
    devedorId: z.ZodOptional<z.ZodString>;
    valor: z.ZodOptional<z.ZodNumber>;
    dataVencimento: z.ZodOptional<z.ZodDate>;
    dataProtesto: z.ZodNullable<z.ZodOptional<z.ZodDate>>;
    tipoTitulo: z.ZodOptional<z.ZodString>;
    observacoes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    credorId?: string | undefined;
    devedorId?: string | undefined;
    valor?: number | undefined;
    dataVencimento?: Date | undefined;
    dataProtesto?: Date | null | undefined;
    tipoTitulo?: string | undefined;
    observacoes?: string | null | undefined;
}, {
    credorId?: string | undefined;
    devedorId?: string | undefined;
    valor?: number | undefined;
    dataVencimento?: Date | undefined;
    dataProtesto?: Date | null | undefined;
    tipoTitulo?: string | undefined;
    observacoes?: string | null | undefined;
}>;
export declare const updateTituloStatusSchema: z.ZodObject<{
    status: z.ZodEnum<["PENDENTE", "EM_ANALISE", "PROTESTADO", "CANCELADO", "RETIRADO", "PAGO"]>;
    dataProtesto: z.ZodNullable<z.ZodOptional<z.ZodDate>>;
}, "strip", z.ZodTypeAny, {
    status: "PENDENTE" | "EM_ANALISE" | "PROTESTADO" | "CANCELADO" | "RETIRADO" | "PAGO";
    dataProtesto?: Date | null | undefined;
}, {
    status: "PENDENTE" | "EM_ANALISE" | "PROTESTADO" | "CANCELADO" | "RETIRADO" | "PAGO";
    dataProtesto?: Date | null | undefined;
}>;
export declare const tituloParamsSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export declare const tituloFiltersSchema: z.ZodObject<{
    protocolo: z.ZodOptional<z.ZodString>;
    documento: z.ZodOptional<z.ZodString>;
    nome: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["PENDENTE", "EM_ANALISE", "PROTESTADO", "CANCELADO", "RETIRADO", "PAGO"]>>;
    dataInicio: z.ZodOptional<z.ZodDate>;
    dataFim: z.ZodOptional<z.ZodDate>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    status?: "PENDENTE" | "EM_ANALISE" | "PROTESTADO" | "CANCELADO" | "RETIRADO" | "PAGO" | undefined;
    nome?: string | undefined;
    documento?: string | undefined;
    protocolo?: string | undefined;
    dataInicio?: Date | undefined;
    dataFim?: Date | undefined;
}, {
    status?: "PENDENTE" | "EM_ANALISE" | "PROTESTADO" | "CANCELADO" | "RETIRADO" | "PAGO" | undefined;
    nome?: string | undefined;
    limit?: number | undefined;
    documento?: string | undefined;
    protocolo?: string | undefined;
    dataInicio?: Date | undefined;
    dataFim?: Date | undefined;
    page?: number | undefined;
}>;
export type CreateTituloInput = z.infer<typeof createTituloSchema>;
export type UpdateTituloInput = z.infer<typeof updateTituloSchema>;
export type UpdateTituloStatusInput = z.infer<typeof updateTituloStatusSchema>;
export type TituloFiltersInput = z.infer<typeof tituloFiltersSchema>;
//# sourceMappingURL=titulo.validation.d.ts.map