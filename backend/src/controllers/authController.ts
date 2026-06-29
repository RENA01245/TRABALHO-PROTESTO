import { Request, Response } from "express";
import * as authService from "../services/authService";

export const authController = {
  login: async (request: Request, response: Response) => response.json(await authService.login(request.body.email, request.body.password)),
  me: async (request: Request, response: Response) => response.json({ user: request.user }),
  recoverPassword: async (request: Request, response: Response) => {
    await authService.recoverPassword(request.body.email, request.body.newPassword);
    response.status(204).send();
  }
};
