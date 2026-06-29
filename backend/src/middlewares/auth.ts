import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import { env } from "../config/env";
import { prisma } from "../config/prisma";
import { AppError } from "../utils/AppError";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: UserRole; name: string; email: string };
    }
  }
}

type JwtPayload = { sub: string };

export async function authenticate(request: Request, _response: Response, next: NextFunction) {
  const header = request.headers.authorization;
  if (!header) throw new AppError("Token nao informado", 401);
  const [, token] = header.split(" ");
  if (!token) throw new AppError("Token invalido", 401);

  const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  const user = await prisma.user.findUnique({ where: { id: decoded.sub } });
  if (!user || !user.active) throw new AppError("Usuario nao autorizado", 401);

  request.user = { id: user.id, role: user.role, name: user.name, email: user.email };
  return next();
}

export function authorize(...roles: UserRole[]) {
  return (request: Request, _response: Response, next: NextFunction) => {
    if (!request.user) throw new AppError("Usuario nao autenticado", 401);
    if (!roles.includes(request.user.role)) throw new AppError("Acesso negado", 403);
    return next();
  };
}
