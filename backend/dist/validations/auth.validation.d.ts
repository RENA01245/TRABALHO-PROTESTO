import { z } from 'zod';
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    senha: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    senha: string;
}, {
    email: string;
    senha: string;
}>;
export declare const forgotPasswordSchema: z.ZodObject<{
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
}, {
    email: string;
}>;
export declare const resetPasswordSchema: z.ZodObject<{
    token: z.ZodString;
    senha: z.ZodString;
}, "strip", z.ZodTypeAny, {
    senha: string;
    token: string;
}, {
    senha: string;
    token: string;
}>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
//# sourceMappingURL=auth.validation.d.ts.map