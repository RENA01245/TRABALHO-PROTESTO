import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

type PartyData = {
  name: string;
  document: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
};

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
  create: (data: PartyData) => prisma.creditor.create({ data }),
  update: (id: string, data: Partial<PartyData>) => prisma.creditor.update({ where: { id }, data }),
  delete: (id: string) => prisma.creditor.delete({ where: { id } })
};

export const debtorService = {
  list: (search?: string) => prisma.debtor.findMany({ where: where(search) as Prisma.DebtorWhereInput, orderBy: { name: "asc" } }),
  create: (data: PartyData) => prisma.debtor.create({ data }),
  update: (id: string, data: Partial<PartyData>) => prisma.debtor.update({ where: { id }, data }),
  delete: (id: string) => prisma.debtor.delete({ where: { id } })
};
