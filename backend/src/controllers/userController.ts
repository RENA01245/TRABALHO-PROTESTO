import { Request, Response } from "express";
import * as userService from "../services/userService";

export const userController = {
  list: async (_request: Request, response: Response) => response.json(await userService.listUsers()),
  create: async (request: Request, response: Response) => response.status(201).json(await userService.createUser(request.body)),
  update: async (request: Request, response: Response) => response.json(await userService.updateUser(request.params.id, request.body)),
  delete: async (request: Request, response: Response) => response.json(await userService.deleteUser(request.params.id))
};
