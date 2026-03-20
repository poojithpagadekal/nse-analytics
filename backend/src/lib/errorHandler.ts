import { Request, Response, NextFunction } from "express";
import { AppError } from "./errors";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof jwt.JsonWebTokenError) {
    return res.status(401).json({
      status: "error",
      message: "Invalid or expired token",
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      ...(env.NODE_ENV === "development" && { stack: err.stack }),
    });
  }

  console.error("UNHANDLED ERROR:", err);

  return res.status(500).json({
    status: "error",
    message:
      env.NODE_ENV === "development" ? err.message : "Something went wrong",
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
