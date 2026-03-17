import { Router } from "express";
import { alertsController } from "./alerts.controller";

export const alertsRouter = Router();

alertsRouter.get("/", alertsController.getAlerts);
alertsRouter.post("/", alertsController.createAlert);
alertsRouter.patch("/:id/deactivate", alertsController.deactivateAlert);
