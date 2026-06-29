CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'EMPLOYEE');
CREATE TYPE "ImportStatus" AS ENUM ('PROCESSING', 'COMPLETED', 'COMPLETED_WITH_ERRORS', 'FAILED');
CREATE TYPE "DocumentType" AS ENUM ('CPF', 'CNPJ');
CREATE TYPE "ProtestStatus" AS ENUM ('IMPORTADO', 'AGUARDANDO_ANALISE', 'ENVIADO_CARTORIO', 'INTIMADO', 'AGUARDANDO_PAGAMENTO', 'PAGO', 'PROTESTADO', 'SUSTADO', 'RETIRADO', 'CANCELADO', 'DEVOLVIDO', 'PENDENTE_BOLETO', 'PENDENTE_PAGAMENTO', 'PENDENTE_RETORNO', 'ERRO_IMPORTACAO');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDENTE', 'INFORMADO', 'CONFIRMADO', 'CANCELADO');
CREATE TYPE "AttachmentType" AS ENUM ('BOLETO', 'COMPROVANTE', 'DOCUMENTO', 'OUTRO');

ALTER TABLE "User"
  ALTER COLUMN "role" DROP DEFAULT,
  ALTER COLUMN "role" TYPE "UserRole" USING "role"::text::"UserRole",
  ALTER COLUMN "role" SET DEFAULT 'EMPLOYEE';

DROP TABLE IF EXISTS "TitleHistory";
DROP TABLE IF EXISTS "Title";
DROP TYPE IF EXISTS "TitleStatus";
DROP TYPE IF EXISTS "Role";

ALTER TABLE "Creditor" DROP CONSTRAINT IF EXISTS "Creditor_document_key";
ALTER TABLE "Debtor" DROP CONSTRAINT IF EXISTS "Debtor_document_key";

ALTER TABLE "Creditor"
  ADD COLUMN IF NOT EXISTS "documentType" "DocumentType";

UPDATE "Creditor"
SET "documentType" = CASE WHEN length(regexp_replace("document", '\D', '', 'g')) = 14 THEN 'CNPJ'::"DocumentType" ELSE 'CPF'::"DocumentType" END
WHERE "documentType" IS NULL;

ALTER TABLE "Creditor"
  ALTER COLUMN "documentType" SET NOT NULL,
  DROP COLUMN IF EXISTS "email",
  DROP COLUMN IF EXISTS "phone",
  DROP COLUMN IF EXISTS "address",
  DROP COLUMN IF EXISTS "city",
  DROP COLUMN IF EXISTS "state",
  DROP COLUMN IF EXISTS "zipCode";

ALTER TABLE "Debtor"
  ADD COLUMN IF NOT EXISTS "documentType" "DocumentType";

UPDATE "Debtor"
SET "documentType" = CASE WHEN length(regexp_replace("document", '\D', '', 'g')) = 14 THEN 'CNPJ'::"DocumentType" ELSE 'CPF'::"DocumentType" END
WHERE "documentType" IS NULL;

ALTER TABLE "Debtor"
  ALTER COLUMN "documentType" SET NOT NULL,
  DROP COLUMN IF EXISTS "email",
  DROP COLUMN IF EXISTS "phone";

CREATE TABLE "ImportBatch" (
  "id" TEXT NOT NULL,
  "fileName" TEXT NOT NULL,
  "fileType" TEXT NOT NULL,
  "importedById" TEXT NOT NULL,
  "totalRecords" INTEGER NOT NULL DEFAULT 0,
  "validRecords" INTEGER NOT NULL DEFAULT 0,
  "invalidRecords" INTEGER NOT NULL DEFAULT 0,
  "status" "ImportStatus" NOT NULL DEFAULT 'PROCESSING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ImportBatch_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ImportError" (
  "id" TEXT NOT NULL,
  "importBatchId" TEXT NOT NULL,
  "lineNumber" INTEGER NOT NULL,
  "field" TEXT,
  "message" TEXT NOT NULL,
  "rawContent" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ImportError_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Protest" (
  "id" TEXT NOT NULL,
  "protocol" TEXT NOT NULL,
  "titleNumber" TEXT NOT NULL,
  "debtorId" TEXT NOT NULL,
  "creditorId" TEXT NOT NULL,
  "importBatchId" TEXT,
  "amount" DECIMAL(12,2) NOT NULL,
  "dueDate" TIMESTAMP(3) NOT NULL,
  "presentationDate" TIMESTAMP(3) NOT NULL,
  "status" "ProtestStatus" NOT NULL DEFAULT 'IMPORTADO',
  "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDENTE',
  "hasBoleto" BOOLEAN NOT NULL DEFAULT false,
  "boletoDueDate" TIMESTAMP(3),
  "boletoAmount" DECIMAL(12,2),
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Protest_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProtestAttachment" (
  "id" TEXT NOT NULL,
  "protestId" TEXT NOT NULL,
  "fileName" TEXT NOT NULL,
  "fileUrl" TEXT NOT NULL,
  "fileType" TEXT NOT NULL,
  "attachmentType" "AttachmentType" NOT NULL DEFAULT 'OUTRO',
  "uploadedById" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProtestAttachment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProtestHistory" (
  "id" TEXT NOT NULL,
  "protestId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "oldValue" TEXT,
  "newValue" TEXT,
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProtestHistory_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PaymentInfo" (
  "id" TEXT NOT NULL,
  "protestId" TEXT NOT NULL,
  "amount" DECIMAL(12,2) NOT NULL,
  "paymentDate" TIMESTAMP(3),
  "paymentMethod" TEXT,
  "status" "PaymentStatus" NOT NULL DEFAULT 'PENDENTE',
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PaymentInfo_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Creditor_document_documentType_key" ON "Creditor"("document", "documentType");
CREATE UNIQUE INDEX "Debtor_document_documentType_key" ON "Debtor"("document", "documentType");
CREATE UNIQUE INDEX "Protest_protocol_key" ON "Protest"("protocol");
CREATE INDEX "ImportBatch_status_idx" ON "ImportBatch"("status");
CREATE INDEX "ImportBatch_createdAt_idx" ON "ImportBatch"("createdAt");
CREATE INDEX "ImportBatch_importedById_idx" ON "ImportBatch"("importedById");
CREATE INDEX "ImportError_importBatchId_idx" ON "ImportError"("importBatchId");
CREATE INDEX "ImportError_lineNumber_idx" ON "ImportError"("lineNumber");
CREATE INDEX "Protest_protocol_idx" ON "Protest"("protocol");
CREATE INDEX "Protest_titleNumber_idx" ON "Protest"("titleNumber");
CREATE INDEX "Protest_status_idx" ON "Protest"("status");
CREATE INDEX "Protest_paymentStatus_idx" ON "Protest"("paymentStatus");
CREATE INDEX "Protest_dueDate_idx" ON "Protest"("dueDate");
CREATE INDEX "Protest_presentationDate_idx" ON "Protest"("presentationDate");
CREATE INDEX "Protest_debtorId_idx" ON "Protest"("debtorId");
CREATE INDEX "Protest_creditorId_idx" ON "Protest"("creditorId");
CREATE INDEX "Protest_importBatchId_idx" ON "Protest"("importBatchId");
CREATE INDEX "ProtestAttachment_protestId_idx" ON "ProtestAttachment"("protestId");
CREATE INDEX "ProtestAttachment_uploadedById_idx" ON "ProtestAttachment"("uploadedById");
CREATE INDEX "ProtestAttachment_attachmentType_idx" ON "ProtestAttachment"("attachmentType");
CREATE INDEX "ProtestHistory_protestId_idx" ON "ProtestHistory"("protestId");
CREATE INDEX "ProtestHistory_userId_idx" ON "ProtestHistory"("userId");
CREATE INDEX "ProtestHistory_action_idx" ON "ProtestHistory"("action");
CREATE INDEX "ProtestHistory_createdAt_idx" ON "ProtestHistory"("createdAt");
CREATE INDEX "PaymentInfo_protestId_idx" ON "PaymentInfo"("protestId");
CREATE INDEX "PaymentInfo_status_idx" ON "PaymentInfo"("status");
CREATE INDEX "PaymentInfo_paymentDate_idx" ON "PaymentInfo"("paymentDate");

ALTER TABLE "ImportBatch" ADD CONSTRAINT "ImportBatch_importedById_fkey" FOREIGN KEY ("importedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ImportError" ADD CONSTRAINT "ImportError_importBatchId_fkey" FOREIGN KEY ("importBatchId") REFERENCES "ImportBatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Protest" ADD CONSTRAINT "Protest_debtorId_fkey" FOREIGN KEY ("debtorId") REFERENCES "Debtor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Protest" ADD CONSTRAINT "Protest_creditorId_fkey" FOREIGN KEY ("creditorId") REFERENCES "Creditor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Protest" ADD CONSTRAINT "Protest_importBatchId_fkey" FOREIGN KEY ("importBatchId") REFERENCES "ImportBatch"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ProtestAttachment" ADD CONSTRAINT "ProtestAttachment_protestId_fkey" FOREIGN KEY ("protestId") REFERENCES "Protest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProtestAttachment" ADD CONSTRAINT "ProtestAttachment_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ProtestHistory" ADD CONSTRAINT "ProtestHistory_protestId_fkey" FOREIGN KEY ("protestId") REFERENCES "Protest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProtestHistory" ADD CONSTRAINT "ProtestHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PaymentInfo" ADD CONSTRAINT "PaymentInfo_protestId_fkey" FOREIGN KEY ("protestId") REFERENCES "Protest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
