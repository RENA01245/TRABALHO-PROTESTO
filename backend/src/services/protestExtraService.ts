import { AttachmentType, PaymentStatus } from "@prisma/client";
import { prisma } from "../config/prisma";

export async function addAttachment(protestId: string, userId: string, data: { fileName: string; fileUrl: string; fileType: string; attachmentType: AttachmentType }) {
  return prisma.$transaction(async (tx) => {
    const attachment = await tx.protestAttachment.create({ data: { ...data, protestId, uploadedById: userId } });
    await tx.protest.update({ where: { id: protestId }, data: { hasBoleto: data.attachmentType === AttachmentType.BOLETO ? true : undefined } });
    await tx.protestHistory.create({
      data: {
        protestId,
        userId,
        action: "ANEXO",
        newValue: data.attachmentType,
        description: `Anexo ${data.fileName} vinculado ao protesto.`
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
