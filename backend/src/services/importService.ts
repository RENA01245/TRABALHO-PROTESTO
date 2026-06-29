import { prisma } from "../config/prisma";

type ImportErrorInput = {
  lineNumber: number;
  field?: string;
  message: string;
  rawContent?: string;
};

type CreateImportBatch = {
  fileName: string;
  fileType: string;
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
  status: "PROCESSING" | "COMPLETED" | "COMPLETED_WITH_ERRORS" | "FAILED";
  errors: ImportErrorInput[];
};

export const importService = {
  list: () => prisma.importBatch.findMany({ include: { importedBy: { select: { name: true } }, errors: true, protests: true }, orderBy: { createdAt: "desc" } }),
  create: (data: CreateImportBatch, userId: string) => prisma.importBatch.create({
    data: {
      fileName: data.fileName,
      fileType: data.fileType,
      importedById: userId,
      totalRecords: data.totalRecords,
      validRecords: data.validRecords,
      invalidRecords: data.invalidRecords,
      status: data.status,
      errors: { create: data.errors }
    },
    include: { errors: true }
  })
};
