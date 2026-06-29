import { DocumentType, Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

type PartyData = {
  name: string;
  document: string;
  documentType?: DocumentType;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
};

function documentType(document: string) {
  return document.length === 14 ? DocumentType.CNPJ : DocumentType.CPF;
}

function creditorData(data: PartyData) {
  return {
    name: data.name,
    document: data.document,
    documentType: data.documentType ?? documentType(data.document)
  };
}

function creditorUpdateData(data: Partial<PartyData>) {
  return {
    name: data.name,
    document: data.document,
    documentType: data.documentType ?? (data.document ? documentType(data.document) : undefined)
  };
}

function debtorData(data: PartyData) {
  return {
    name: data.name,
    document: data.document,
    documentType: data.documentType ?? documentType(data.document),
    address: data.address,
    city: data.city,
    state: data.state,
    zipCode: data.zipCode
  };
}

function debtorUpdateData(data: Partial<PartyData>) {
  return {
    name: data.name,
    document: data.document,
    documentType: data.documentType ?? (data.document ? documentType(data.document) : undefined),
    address: data.address,
    city: data.city,
    state: data.state,
    zipCode: data.zipCode
  };
}

function where(search?: string): Prisma.CreditorWhereInput {
  if (!search) return {};
  return {
    OR: [
      { name: { contains: search, mode: "insensitive" } },
      { document: { contains: search } }
    ]
  };
}

export const creditorService = {
  list: (search?: string) => prisma.creditor.findMany({ where: where(search), orderBy: { name: "asc" } }),
  create: (data: PartyData) => prisma.creditor.create({ data: creditorData(data) }),
  update: (id: string, data: Partial<PartyData>) => prisma.creditor.update({ where: { id }, data: creditorUpdateData(data) }),
  delete: (id: string) => prisma.creditor.delete({ where: { id } })
};

export const debtorService = {
  list: (search?: string) => prisma.debtor.findMany({ where: where(search) as Prisma.DebtorWhereInput, orderBy: { name: "asc" } }),
  create: (data: PartyData) => prisma.debtor.create({ data: debtorData(data) }),
  update: (id: string, data: Partial<PartyData>) => prisma.debtor.update({ where: { id }, data: debtorUpdateData(data) }),
  delete: (id: string) => prisma.debtor.delete({ where: { id } })
};
