import { z } from "zod";

const importStatuses = ["PROCESSING", "COMPLETED", "COMPLETED_WITH_ERRORS", "FAILED"] as const;

export const createImportBatchSchema = z.object({
  body: z.object({
    fileName: z.string().min(1),
    fileType: z.string().min(1),
    totalRecords: z.coerce.number().int().nonnegative().default(0),
    validRecords: z.coerce.number().int().nonnegative().default(0),
    invalidRecords: z.coerce.number().int().nonnegative().default(0),
    status: z.enum(importStatuses).default("COMPLETED"),
    errors: z.array(z.object({
      lineNumber: z.coerce.number().int().positive(),
      field: z.string().optional(),
      message: z.string().min(1),
      rawContent: z.string().optional()
    })).default([])
  })
});
