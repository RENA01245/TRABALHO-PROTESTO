import { Request, Response } from "express";
import * as titleService from "../services/titleService";
import { createReceiptPdf } from "../utils/pdf";

export const titleController = {
  list: async (request: Request, response: Response) => response.json(await titleService.listTitles(request.query as any)),
  get: async (request: Request, response: Response) => response.json(await titleService.getTitle(request.params.id)),
  create: async (request: Request, response: Response) => response.status(201).json(await titleService.createTitle(request.body, request.user!.id)),
  update: async (request: Request, response: Response) => response.json(await titleService.updateTitle(request.params.id, request.body, request.user!.id)),
  delete: async (request: Request, response: Response) => response.json(await titleService.deleteTitle(request.params.id)),
  changeStatus: async (request: Request, response: Response) => response.json(await titleService.changeTitleStatus(request.params.id, request.body.status, request.body.note, request.user!.id)),
  receipt: async (request: Request, response: Response) => {
    const title = await titleService.getTitle(request.params.id);
    const pdf = await createReceiptPdf(title as any);
    response.setHeader("Content-Type", "application/pdf");
    response.setHeader("Content-Disposition", `attachment; filename=${title.protocol}.pdf`);
    response.send(pdf);
  },
  dashboard: async (_request: Request, response: Response) => response.json(await titleService.dashboard())
};
