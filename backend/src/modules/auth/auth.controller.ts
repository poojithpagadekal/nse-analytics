import { Request, Response } from "express";
import { asyncHandler } from "../../lib/errorHandler";
import { loginSchema, registerSchema } from "./auth.schema";
import { ValidationError } from "../../lib/errors";
import { authService } from "../auth/auth.service";

const register = asyncHandler(async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues[0]?.message ?? "Invalid request body",
    );
  }

  const result = await authService.register(parsed.data);
  res.status(201).json(result);
});

const login = asyncHandler(async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ValidationError("Invalid request body");
  }

  const result = await authService.login(parsed.data);
  res.status(200).json(result);
});

export const authController = {
  register,
  login,
};
