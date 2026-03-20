import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { UnauthorizedError } from "../lib/errors";
import { asyncHandler } from "../lib/errorHandler";

export interface AuthRequest extends Request {
  userId: number;
}

function isValidPayload(payload: unknown): payload is { userId: number } {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "userId" in payload &&
    typeof (payload as Record<string, unknown>).userId === "number"
  );
}

export const authenticate = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError();
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new UnauthorizedError();
    }

    const decoded = jwt.verify(token, env.JWT_SECRET as string);

    if (!isValidPayload(decoded)) {
      throw new UnauthorizedError();
    }

    (req as AuthRequest).userId = decoded.userId;
    next();
  },
);
