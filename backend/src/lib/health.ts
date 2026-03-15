import { Router, Request, Response } from "express";
import { prisma } from "../config/prisma";
import { redis } from "../config/redis";

export const healthRouter = Router();

healthRouter.get("/", async (_req: Request, res: Response) => {
  const checks = {
    status: "ok",
    timestamp: new Date().toISOString,
    services: {
      postgres: "unknown",
      redis: "unknown",
    },
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.services.postgres = "ok";
  } catch (error) {
    checks.services.postgres = "error";
    checks.status = "degraded";
  }

  try {
    await redis.ping();
    checks.services.redis = "ok";
  } catch (error) {
    checks.services.redis = "error";
    checks.status = "degraded";
  }

  const statusCode = checks.status === "ok" ? 200 : 503;
  res.status(statusCode).json(checks);
});
