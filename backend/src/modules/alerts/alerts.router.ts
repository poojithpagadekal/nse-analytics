import { Router } from "express";
import { alertsController } from "./alerts.controller";
import { authenticate } from "../../middlewares/authenticate";

export const alertsRouter = Router();

alertsRouter.get("/",authenticate, alertsController.getAlerts);
alertsRouter.post("/",authenticate, alertsController.createAlert);
alertsRouter.patch("/:id/deactivate",authenticate, alertsController.deactivateAlert);
