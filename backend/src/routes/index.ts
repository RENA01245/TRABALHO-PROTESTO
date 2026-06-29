import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import { Role } from "@prisma/client";
import { authController } from "../controllers/authController";
import { creditorController, debtorController } from "../controllers/partyController";
import { titleController } from "../controllers/titleController";
import { userController } from "../controllers/userController";
import { authenticate, authorize } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { asyncHandler } from "../utils/asyncHandler";
import { openApiDocument } from "../docs/openapi";
import { loginSchema, recoverPasswordSchema } from "../validations/auth";
import { idParamSchema, paginationQuerySchema, partySchema, partyUpdateSchema } from "../validations/common";
import { createTitleSchema, statusSchema, titleQuerySchema, updateTitleSchema } from "../validations/title";
import { createUserSchema, updateUserSchema } from "../validations/user";

export const routes = Router();

routes.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

const ah = asyncHandler;
const auth = ah(authenticate);

routes.post("/auth/login", validate(loginSchema), ah(authController.login));
routes.get("/auth/me", auth, ah(authController.me));
routes.post("/auth/recover-password", auth, authorize(Role.ADMIN), validate(recoverPasswordSchema), ah(authController.recoverPassword));

routes.use(auth);

routes.get("/dashboard", ah(titleController.dashboard));

routes.get("/users", authorize(Role.ADMIN), ah(userController.list));
routes.post("/users", authorize(Role.ADMIN), validate(createUserSchema), ah(userController.create));
routes.put("/users/:id", authorize(Role.ADMIN), validate(updateUserSchema), ah(userController.update));
routes.delete("/users/:id", authorize(Role.ADMIN), validate(idParamSchema), ah(userController.delete));

routes.get("/creditors", validate(paginationQuerySchema), ah(creditorController.list));
routes.post("/creditors", validate(partySchema), ah(creditorController.create));
routes.put("/creditors/:id", validate(partyUpdateSchema), ah(creditorController.update));
routes.delete("/creditors/:id", authorize(Role.ADMIN), validate(idParamSchema), ah(creditorController.delete));

routes.get("/debtors", validate(paginationQuerySchema), ah(debtorController.list));
routes.post("/debtors", validate(partySchema), ah(debtorController.create));
routes.put("/debtors/:id", validate(partyUpdateSchema), ah(debtorController.update));
routes.delete("/debtors/:id", authorize(Role.ADMIN), validate(idParamSchema), ah(debtorController.delete));

routes.get("/titles", validate(titleQuerySchema), ah(titleController.list));
routes.post("/titles", validate(createTitleSchema), ah(titleController.create));
routes.get("/titles/:id", validate(idParamSchema), ah(titleController.get));
routes.put("/titles/:id", validate(updateTitleSchema), ah(titleController.update));
routes.delete("/titles/:id", authorize(Role.ADMIN), validate(idParamSchema), ah(titleController.delete));
routes.patch("/titles/:id/status", validate(statusSchema), ah(titleController.changeStatus));
routes.get("/titles/:id/receipt", validate(idParamSchema), ah(titleController.receipt));
