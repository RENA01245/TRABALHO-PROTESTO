import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { errorHandler } from "./middlewares/errorHandler";
import { routes } from "./routes";

export const app = express();

app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());
app.get("/health", (_request, response) => response.json({ status: "ok" }));
app.use("/api", routes);
app.use(errorHandler);
