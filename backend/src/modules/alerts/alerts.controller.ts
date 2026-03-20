import { Request, Response } from "express";
import { asyncHandler } from "../../lib/errorHandler";
import {
  alertParamSchema,
  alertQuerySchema,
  createAlertSchema,
} from "./alerts.schema";
import { alertsService } from "./alerts.service";
import { ValidationError } from "../../lib/errors";
import type { AuthRequest } from "../../middlewares/authenticate";

const getAlerts = asyncHandler(async (req: Request, res: Response) => {
  const query = alertQuerySchema.parse(req.query);
  const alerts = await alertsService.getAlerts(
    (req as AuthRequest).userId,
    query,
  );
  res.status(200).json(alerts);
});

const createAlert = asyncHandler(async (req: Request, res: Response) => {
  const parsed = createAlertSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues[0]?.message ?? "Invalid request body",
    );
  }
  const alert = await alertsService.createAlert(
    (req as AuthRequest).userId,
    parsed.data,
  );
  res.status(201).json(alert);
});

const deactivateAlert = asyncHandler(async (req: Request, res: Response) => {
  const { id } = alertParamSchema.parse(req.params);
  const alert = await alertsService.deactivateAlert(
    (req as AuthRequest).userId,
    id,
  );
  res.status(200).json(alert);
});

export const alertsController = {
  getAlerts,
  createAlert,
  deactivateAlert,
};
