import { TitleStatus } from "@prisma/client";
import { z } from "zod";

export const createTitleSchema = z.object({
  body: z.object({
    creditorId: z.string().uuid(),
    debtorId: z.string().uuid(),
    amount: z.coerce.number().positive(),
    issueDate: z.coerce.date(),
    dueDate: z.coerce.date(),
    description: z.string().optional()
  }).refine((data) => data.dueDate >= data.issueDate, {
    path: ["dueDate"],
    message: "Data de vencimento deve ser igual ou posterior a data de emissao"
  })
});

export const updateTitleSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    creditorId: z.string().uuid().optional(),
    debtorId: z.string().uuid().optional(),
    amount: z.coerce.number().positive().optional(),
    issueDate: z.coerce.date().optional(),
    dueDate: z.coerce.date().optional(),
    description: z.string().optional()
  })
});

export const statusSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    status: z.nativeEnum(TitleStatus),
    note: z.string().optional()
  })
});

export const titleQuerySchema = z.object({
  query: z.object({
    protocol: z.string().optional(),
    document: z.string().optional(),
    name: z.string().optional(),
    status: z.nativeEnum(TitleStatus).optional(),
    date: z.coerce.date().optional(),
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().max(100).default(20)
  })
});
