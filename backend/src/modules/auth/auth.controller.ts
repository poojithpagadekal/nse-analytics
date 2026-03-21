import { Request, Response } from "express";
import { asyncHandler } from "../../lib/errorHandler";
import {
  changeEmailSchema,
  loginSchema,
  registerSchema,
  updatePasswordSchema,
  updateProfileSchema,
} from "./auth.schema";
import { ValidationError } from "../../lib/errors";
import { authService } from "../auth/auth.service";
import { AuthRequest } from "../../middlewares/authenticate";

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

const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.getMe((req as AuthRequest).userId);
  res.status(200).json(user);
});

const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const parsed = updateProfileSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues[0]?.message ?? "Invalid request body",
    );
  }

  const user = await authService.updateProfile(
    (req as AuthRequest).userId,
    parsed.data,
  );
  res.status(200).json(user);
});

const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const parsed = updatePasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues[0]?.message || "Invalid request body",
    );
  }

  const user = await authService.changePassword(
    (req as AuthRequest).userId,
    parsed.data,
  );

  res.status(200).json(user);
});

const changeEmail = asyncHandler(async (req: Request, res: Response) => {
  const parsed = changeEmailSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues[0]?.message || "Invalid request body",
    );
  }

  const user = await authService.changeEmail(
    (req as AuthRequest).userId,
    parsed.data,
  );
  res.status(200).json(user);
});

export const authController = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  changeEmail,
};
