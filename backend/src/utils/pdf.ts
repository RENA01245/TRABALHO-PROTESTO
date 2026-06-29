import PDFDocument from "pdfkit";
import { Creditor, Debtor, Protest } from "@prisma/client";

type ReceiptTitle = Protest & { creditor: Creditor; debtor: Debtor };

export function createReceiptPdf(title: ReceiptTitle) {
  const doc = new PDFDocument({ margin: 48 });
  const chunks: Buffer[] = [];

  doc.on("data", (chunk) => chunks.push(chunk));
  doc.fontSize(18).text("Comprovante de Protocolo de Protesto", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Protocolo: ${title.protocol}`);
  doc.text(`Status: ${title.status}`);
  doc.text(`Valor: R$ ${Number(title.amount).toFixed(2)}`);
  doc.text(`Apresentacao: ${title.presentationDate.toLocaleDateString("pt-BR")}`);
  doc.text(`Vencimento: ${title.dueDate.toLocaleDateString("pt-BR")}`);
  doc.moveDown();
  doc.text(`Credor: ${title.creditor.name}`);
  doc.text(`Documento do credor: ${title.creditor.document}`);
  doc.moveDown();
  doc.text(`Devedor: ${title.debtor.name}`);
  doc.text(`Documento do devedor: ${title.debtor.document}`);
  if (title.notes) {
    doc.moveDown();
    doc.text(`Observacoes: ${title.notes}`);
  }
  doc.moveDown();
  doc.text("Documento emitido eletronicamente pelo Sistema de Gerenciamento de Protesto de Titulos.");
  doc.end();

  return new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });
}
