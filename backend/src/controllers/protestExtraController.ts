import { Request, Response } from "express";
import * as service from "../services/protestExtraService";

export const protestExtraController = {
  addAttachment: async (request: Request, response: Response) => response.status(201).json(await service.addAttachment(request.params.id, request.user!.id, request.body)),
  addPayment: async (request: Request, response: Response) => response.status(201).json(await service.addPayment(request.params.id, request.user!.id, request.body))
};
