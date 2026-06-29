CREATE TYPE "Role" AS ENUM ('ADMIN', 'EMPLOYEE');
CREATE TYPE "TitleStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'PROTESTED', 'PAID', 'CANCELLED');

CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "role" "Role" NOT NULL DEFAULT 'EMPLOYEE',
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Creditor" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "document" TEXT NOT NULL,
  "email" TEXT,
  "phone" TEXT,
  "address" TEXT,
  "city" TEXT,
  "state" TEXT,
  "zipCode" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Creditor_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Debtor" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "document" TEXT NOT NULL,
  "email" TEXT,
  "phone" TEXT,
  "address" TEXT,
  "city" TEXT,
  "state" TEXT,
  "zipCode" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Debtor_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Title" (
  "id" TEXT NOT NULL,
  "protocol" TEXT NOT NULL,
  "creditorId" TEXT NOT NULL,
  "debtorId" TEXT NOT NULL,
  "amount" DECIMAL(12,2) NOT NULL,
  "issueDate" TIMESTAMP(3) NOT NULL,
  "dueDate" TIMESTAMP(3) NOT NULL,
  "status" "TitleStatus" NOT NULL DEFAULT 'SUBMITTED',
  "description" TEXT,
  "createdById" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Title_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TitleHistory" (
  "id" TEXT NOT NULL,
  "titleId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "fromStatus" "TitleStatus",
  "toStatus" "TitleStatus",
  "field" TEXT NOT NULL,
  "oldValue" TEXT,
  "newValue" TEXT,
  "note" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TitleHistory_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_role_idx" ON "User"("role");
CREATE UNIQUE INDEX "Creditor_document_key" ON "Creditor"("document");
CREATE INDEX "Creditor_name_idx" ON "Creditor"("name");
CREATE INDEX "Creditor_document_idx" ON "Creditor"("document");
CREATE UNIQUE INDEX "Debtor_document_key" ON "Debtor"("document");
CREATE INDEX "Debtor_name_idx" ON "Debtor"("name");
CREATE INDEX "Debtor_document_idx" ON "Debtor"("document");
CREATE UNIQUE INDEX "Title_protocol_key" ON "Title"("protocol");
CREATE INDEX "Title_protocol_idx" ON "Title"("protocol");
CREATE INDEX "Title_status_idx" ON "Title"("status");
CREATE INDEX "Title_dueDate_idx" ON "Title"("dueDate");
CREATE INDEX "Title_creditorId_idx" ON "Title"("creditorId");
CREATE INDEX "Title_debtorId_idx" ON "Title"("debtorId");
CREATE INDEX "TitleHistory_titleId_idx" ON "TitleHistory"("titleId");
CREATE INDEX "TitleHistory_userId_idx" ON "TitleHistory"("userId");

ALTER TABLE "Title" ADD CONSTRAINT "Title_creditorId_fkey" FOREIGN KEY ("creditorId") REFERENCES "Creditor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Title" ADD CONSTRAINT "Title_debtorId_fkey" FOREIGN KEY ("debtorId") REFERENCES "Debtor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Title" ADD CONSTRAINT "Title_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "TitleHistory" ADD CONSTRAINT "TitleHistory_titleId_fkey" FOREIGN KEY ("titleId") REFERENCES "Title"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TitleHistory" ADD CONSTRAINT "TitleHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
