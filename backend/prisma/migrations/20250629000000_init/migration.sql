-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'FUNCIONARIO');

-- CreateEnum
CREATE TYPE "TipoDocumento" AS ENUM ('CPF', 'CNPJ');

-- CreateEnum
CREATE TYPE "TituloStatus" AS ENUM ('PENDENTE', 'EM_ANALISE', 'PROTESTADO', 'CANCELADO', 'RETIRADO', 'PAGO');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'FUNCIONARIO',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credores" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "documento" TEXT NOT NULL,
    "tipoDocumento" "TipoDocumento" NOT NULL,
    "email" TEXT,
    "telefone" TEXT,
    "endereco" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "credores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devedores" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "documento" TEXT NOT NULL,
    "tipoDocumento" "TipoDocumento" NOT NULL,
    "email" TEXT,
    "telefone" TEXT,
    "endereco" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "devedores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "titulos" (
    "id" TEXT NOT NULL,
    "protocolo" TEXT NOT NULL,
    "credorId" TEXT NOT NULL,
    "devedorId" TEXT NOT NULL,
    "valor" DECIMAL(15,2) NOT NULL,
    "dataVencimento" TIMESTAMP(3) NOT NULL,
    "dataProtesto" TIMESTAMP(3),
    "tipoTitulo" TEXT NOT NULL,
    "status" "TituloStatus" NOT NULL DEFAULT 'PENDENTE',
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "titulos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historico_titulos" (
    "id" TEXT NOT NULL,
    "tituloId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "acao" TEXT NOT NULL,
    "campo" TEXT,
    "valorAnterior" TEXT,
    "valorNovo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historico_titulos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "credores_documento_key" ON "credores"("documento");

-- CreateIndex
CREATE UNIQUE INDEX "devedores_documento_key" ON "devedores"("documento");

-- CreateIndex
CREATE UNIQUE INDEX "titulos_protocolo_key" ON "titulos"("protocolo");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_token_key" ON "password_reset_tokens"("token");

-- AddForeignKey
ALTER TABLE "titulos" ADD CONSTRAINT "titulos_credorId_fkey" FOREIGN KEY ("credorId") REFERENCES "credores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "titulos" ADD CONSTRAINT "titulos_devedorId_fkey" FOREIGN KEY ("devedorId") REFERENCES "devedores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historico_titulos" ADD CONSTRAINT "historico_titulos_tituloId_fkey" FOREIGN KEY ("tituloId") REFERENCES "titulos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historico_titulos" ADD CONSTRAINT "historico_titulos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
