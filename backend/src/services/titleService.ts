import { Prisma, TitleStatus } from "@prisma/client";
import { prisma } from "../config/prisma";
import { AppError } from "../utils/AppError";
import { buildProtocol } from "../utils/protocol";

type CreateTitle = {
  creditorId: string;
  debtorId: string;
  amount: number;
  issueDate: Date;
  dueDate: Date;
  description?: string;
};

type TitleFilters = {
  protocol?: string;
  document?: string;
  name?: string;
  status?: TitleStatus;
  date?: Date;
  page: number;
  pageSize: number;
};

async function nextProtocol() {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const protocol = buildProtocol();
    const exists = await prisma.title.findUnique({ where: { protocol } });
    if (!exists) return protocol;
  }
  throw new AppError("Nao foi possivel gerar protocolo unico", 500);
}

export async function listTitles(filters: TitleFilters) {
  const where: Prisma.TitleWhereInput = {};
  const and: Prisma.TitleWhereInput[] = [];
  if (filters.protocol) where.protocol = { contains: filters.protocol, mode: "insensitive" };
  if (filters.status) where.status = filters.status;
  if (filters.document) and.push({ OR: [{ creditor: { document: { contains: filters.document } } }, { debtor: { document: { contains: filters.document } } }] });
  if (filters.name) and.push({ OR: [{ creditor: { name: { contains: filters.name, mode: "insensitive" } } }, { debtor: { name: { contains: filters.name, mode: "insensitive" } } }] });
  if (and.length) where.AND = and;
  if (filters.date) {
    const start = new Date(filters.date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    where.createdAt = { gte: start, lt: end };
  }
  const skip = (filters.page - 1) * filters.pageSize;
  const [items, total] = await Promise.all([
    prisma.title.findMany({ where, include: { creditor: true, debtor: true, createdBy: { select: { id: true, name: true } } }, orderBy: { createdAt: "desc" }, skip, take: filters.pageSize }),
    prisma.title.count({ where })
  ]);
  return { items, total, page: filters.page, pageSize: filters.pageSize };
}

export async function getTitle(id: string) {
  const title = await prisma.title.findUnique({ where: { id }, include: { creditor: true, debtor: true, histories: { include: { user: { select: { name: true } } }, orderBy: { createdAt: "desc" } } } });
  if (!title) throw new AppError("Titulo nao encontrado", 404);
  return title;
}

export async function createTitle(data: CreateTitle, userId: string) {
  const protocol = await nextProtocol();
  return prisma.$transaction(async (tx) => {
    const title = await tx.title.create({
      data: { ...data, protocol, createdById: userId },
      include: { creditor: true, debtor: true }
    });
    await tx.titleHistory.create({ data: { titleId: title.id, userId, field: "status", toStatus: title.status, newValue: title.status, note: "Titulo cadastrado" } });
    return title;
  });
}

export async function updateTitle(id: string, data: Partial<CreateTitle>, userId: string) {
  const previous = await prisma.title.findUnique({ where: { id } });
  if (!previous) throw new AppError("Titulo nao encontrado", 404);
  const updated = await prisma.title.update({ where: { id }, data, include: { creditor: true, debtor: true } });
  await prisma.titleHistory.create({ data: { titleId: id, userId, field: "dados", oldValue: JSON.stringify(previous), newValue: JSON.stringify(data), note: "Titulo atualizado" } });
  return updated;
}

export async function deleteTitle(id: string) {
  return prisma.title.delete({ where: { id } });
}

export async function changeTitleStatus(id: string, status: TitleStatus, note: string | undefined, userId: string) {
  const previous = await prisma.title.findUnique({ where: { id } });
  if (!previous) throw new AppError("Titulo nao encontrado", 404);
  const updated = await prisma.title.update({ where: { id }, data: { status }, include: { creditor: true, debtor: true } });
  await prisma.titleHistory.create({ data: { titleId: id, userId, field: "status", fromStatus: previous.status, toStatus: status, oldValue: previous.status, newValue: status, note } });
  return updated;
}

export async function dashboard() {
  const [totalTitles, totalCreditors, totalDebtors, byStatus, amount, recent] = await Promise.all([
    prisma.title.count(),
    prisma.creditor.count(),
    prisma.debtor.count(),
    prisma.title.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.title.aggregate({ _sum: { amount: true } }),
    prisma.title.findMany({ take: 5, orderBy: { createdAt: "desc" }, include: { creditor: true, debtor: true } })
  ]);
  return { totalTitles, totalCreditors, totalDebtors, totalAmount: Number(amount._sum.amount ?? 0), byStatus, recent };
}
