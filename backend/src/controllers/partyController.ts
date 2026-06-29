import { Request, Response } from "express";
import { creditorService, debtorService } from "../services/partyService";

const makeController = (service: typeof creditorService) => ({
  list: async (request: Request, response: Response) => response.json(await service.list(String(request.query.search ?? ""))),
  create: async (request: Request, response: Response) => response.status(201).json(await service.create(request.body)),
  update: async (request: Request, response: Response) => response.json(await service.update(request.params.id, request.body)),
  delete: async (request: Request, response: Response) => response.json(await service.delete(request.params.id))
});

export const creditorController = makeController(creditorService);
export const debtorController = makeController(debtorService);
