import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { prisma } from "../config/prisma";
import { AppError } from "../utils/AppError";

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.active) throw new AppError("Credenciais invalidas", 401);
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new AppError("Credenciais invalidas", 401);
  const token = jwt.sign({ role: user.role }, env.JWT_SECRET, { subject: user.id, expiresIn: "8h" });
  return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
}

export async function recoverPassword(email: string, newPassword: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError("Usuario nao encontrado", 404);
  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { email }, data: { passwordHash } });
}
