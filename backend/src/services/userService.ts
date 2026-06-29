import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import { prisma } from "../config/prisma";

const select = { id: true, name: true, email: true, role: true, active: true, createdAt: true, updatedAt: true };

export async function listUsers() {
  return prisma.user.findMany({ select, orderBy: { name: "asc" } });
}

export async function createUser(data: { name: string; email: string; password: string; role: UserRole; active: boolean }) {
  const { password, ...userData } = data;
  const passwordHash = await bcrypt.hash(data.password, 10);
  return prisma.user.create({ data: { ...userData, passwordHash }, select });
}

export async function updateUser(id: string, data: Partial<{ name: string; email: string; password: string; role: UserRole; active: boolean }>) {
  const { password, ...userData } = data;
  const passwordHash = password ? await bcrypt.hash(password, 10) : undefined;
  return prisma.user.update({ where: { id }, data: { ...userData, passwordHash }, select });
}

export async function deleteUser(id: string) {
  return prisma.user.delete({ where: { id }, select });
}
