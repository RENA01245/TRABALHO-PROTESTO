import { AttachmentType, ImportStatus, PaymentStatus, ProtestStatus, UserRole, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("Admin@123456", 10);
  const employeePassword = await bcrypt.hash("Funcionario@123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@protesto.local" },
    update: { passwordHash: adminPassword, role: UserRole.ADMIN, active: true },
    create: {
      name: "Administrador",
      email: "admin@protesto.local",
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
      active: true
    }
  });

  const employee = await prisma.user.upsert({
    where: { email: "funcionario@protesto.local" },
    update: { passwordHash: employeePassword, role: UserRole.EMPLOYEE, active: true },
    create: {
      name: "Funcionario de Protesto",
      email: "funcionario@protesto.local",
      passwordHash: employeePassword,
      role: UserRole.EMPLOYEE,
      active: true
    }
  });

  const creditor = await prisma.creditor.upsert({
    where: { document_documentType: { document: "11222333000181", documentType: "CNPJ" } },
    update: {},
    create: {
      name: "Empresa Credora Exemplo LTDA",
      document: "11222333000181",
      documentType: "CNPJ"
    }
  });

  const debtor = await prisma.debtor.upsert({
    where: { document_documentType: { document: "12345678909", documentType: "CPF" } },
    update: {},
    create: {
      name: "Joao Devedor Exemplo",
      document: "12345678909",
      documentType: "CPF",
      address: "Rua das Flores, 100",
      city: "Sao Paulo",
      state: "SP",
      zipCode: "01001000"
    }
  });

  const batch = await prisma.importBatch.create({
    data: {
      fileName: "protestos-exemplo.csv",
      fileType: "text/csv",
      importedById: admin.id,
      totalRecords: 2,
      validRecords: 1,
      invalidRecords: 1,
      status: ImportStatus.COMPLETED_WITH_ERRORS,
      errors: {
        create: {
          lineNumber: 3,
          field: "document",
          message: "Documento do devedor invalido",
          rawContent: "linha;com;documento;invalido"
        }
      }
    }
  });

  const protest = await prisma.protest.upsert({
    where: { protocol: "PT-20260629-EXEMP1" },
    update: {},
    create: {
      protocol: "PT-20260629-EXEMP1",
      titleNumber: "DUP-0001",
      debtorId: debtor.id,
      creditorId: creditor.id,
      importBatchId: batch.id,
      amount: 1250.75,
      dueDate: new Date("2026-07-15T00:00:00.000Z"),
      presentationDate: new Date("2026-06-29T00:00:00.000Z"),
      status: ProtestStatus.PENDENTE_BOLETO,
      paymentStatus: PaymentStatus.PENDENTE,
      hasBoleto: true,
      boletoDueDate: new Date("2026-07-20T00:00:00.000Z"),
      boletoAmount: 1250.75,
      notes: "Protesto importado para monitoramento academico."
    }
  });

  await prisma.protestHistory.createMany({
    data: [
      {
        protestId: protest.id,
        userId: admin.id,
        action: "IMPORTACAO",
        newValue: ProtestStatus.IMPORTADO,
        description: "Protesto criado a partir do arquivo importado."
      },
      {
        protestId: protest.id,
        userId: employee.id,
        action: "ANEXO_BOLETO",
        oldValue: "false",
        newValue: "true",
        description: "Boleto de exemplo vinculado ao protesto."
      }
    ]
  });

  await prisma.paymentInfo.create({
    data: {
      protestId: protest.id,
      amount: 1250.75,
      status: PaymentStatus.PENDENTE,
      notes: "Aguardando confirmacao de pagamento."
    }
  });

  await prisma.protestAttachment.create({
    data: {
      protestId: protest.id,
      fileName: "boleto-exemplo.pdf",
      fileUrl: "https://example.com/boleto-exemplo.pdf",
      fileType: "application/pdf",
      attachmentType: AttachmentType.BOLETO,
      uploadedById: employee.id
    }
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
