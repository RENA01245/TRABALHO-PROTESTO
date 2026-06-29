import { Request, Response } from "express";
import { importService } from "../services/importService";

export const importController = {
  list: async (_request: Request, response: Response) => response.json(await importService.list()),
  create: async (request: Request, response: Response) => response.status(201).json(await importService.create(request.body, request.user!.id)),
  upload: async (request: Request, response: Response) => response.status(201).json(await importService.processFile(request.file, request.user!.id))
};
