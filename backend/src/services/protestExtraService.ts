import { AttachmentType, PaymentStatus } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env";
import { prisma } from "../config/prisma";
import { AppError } from "../utils/AppError";

async function uploadAttachment(file: Express.Multer.File | undefined) {
  if (!file) return undefined;
  const filePath = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9_.-]/g, "-")}`;

  if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
    const client = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
    const { error } = await client.storage.from(env.SUPABASE_BUCKET ?? "boletos").upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: true
    });
    if (error) throw new AppError(`Erro ao enviar arquivo para Supabase Storage: ${error.message}`, 400);
    const { data } = client.storage.from(env.SUPABASE_BUCKET ?? "boletos").getPublicUrl(filePath);
    return { fileName: file.originalname, fileType: file.mimetype, fileUrl: data.publicUrl };
  }

  return { fileName: file.originalname, fileType: file.mimetype, fileUrl: `local://${filePath}` };
}

export async function addAttachment(
  protestId: string,
  userId: string,
  data: {
    fileName?: string;
    fileUrl?: string;
    fileType?: string;
    attachmentType: AttachmentType;
    boletoDueDate?: Date;
    boletoAmount?: number;
    notes?: string;
  },
  file?: Express.Multer.File
) {
  const uploaded = await uploadAttachment(file);
  const fileName = uploaded?.fileName ?? data.fileName;
  const fileType = uploaded?.fileType ?? data.fileType;
  const fileUrl = uploaded?.fileUrl ?? data.fileUrl;
  if (!fileName || !fileType || !fileUrl) throw new AppError("Informe ou envie um arquivo de anexo", 400);

  return prisma.$transaction(async (tx) => {
    const attachment = await tx.protestAttachment.create({
      data: { fileName, fileUrl, fileType, attachmentType: data.attachmentType, protestId, uploadedById: userId }
    });
    await tx.protest.update({
      where: { id: protestId },
      data: {
        hasBoleto: data.attachmentType === AttachmentType.BOLETO ? true : undefined,
        boletoDueDate: data.boletoDueDate,
        boletoAmount: data.boletoAmount,
        notes: data.notes
      }
    });
    await tx.protestHistory.create({
      data: {
        protestId,
        userId,
        action: data.attachmentType === AttachmentType.BOLETO ? "ANEXO_BOLETO" : "ANEXO",
        newValue: data.attachmentType,
        description: `Anexo ${fileName} vinculado ao protesto.`
      }
    });
    return attachment;
  });
}

export async function addPayment(protestId: string, userId: string, data: { amount: number; paymentDate?: Date; paymentMethod?: string; status: PaymentStatus; notes?: string }) {
  return prisma.$transaction(async (tx) => {
    const payment = await tx.paymentInfo.create({ data: { ...data, protestId } });
    await tx.protest.update({ where: { id: protestId }, data: { paymentStatus: data.status } });
    await tx.protestHistory.create({
      data: {
        protestId,
        userId,
        action: "REGISTRO_PAGAMENTO",
        newValue: data.status,
        description: data.notes
      }
    });
    return payment;
  });
}
