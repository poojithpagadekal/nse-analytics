import { prisma } from "../../config/prisma";
import { AppError } from "../../lib/errors";
import * as jwt from "jsonwebtoken";
import { Secret } from "jsonwebtoken";
import type { StringValue } from "ms";
import bcrypt from "bcryptjs";
import {
  ChangeEmailInput,
  ChangePasswordInput,
  RegisterInput,
  UdpateProfileInput,
} from "./auth.schema";
import { env } from "../../config/env";
import { LoginInput } from "./auth.schema";

const SALT_ROUNDS = 12;

const register = async (data: RegisterInput) => {
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existing) throw new AppError("Email already in use", 409);

  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  const token = generateToken(user.id);
  return { user, token };
};

const login = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isValid = await bcrypt.compare(data.password, user.password);

  if (!isValid) {
    throw new AppError("Invalid credentials", 401);
  }

  const { password: _, ...otherFields } = user;
  const token = generateToken(user.id);
  return { user: otherFields, token };
};

const getMe = async (userId: number) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });
};

const updateProfile = async (userId: number, data: UdpateProfileInput) => {
  return prisma.user.update({
    where: { id: userId },
    data: { name: data.name },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });
};

const changePassword = async (userId: number, data: ChangePasswordInput) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError("User not found", 404);

  const isValid = await bcrypt.compare(data.currentPassword, user.password);
  if (!isValid) throw new AppError("Current password is incorrect", 400);

  const hashed = await bcrypt.hash(data.newPassword, SALT_ROUNDS);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashed },
  });

  return { message: "Password updated successfully" };
};

const changeEmail = async (userId: number, data: ChangeEmailInput) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError("User not found", 404);

  const isValid = await bcrypt.compare(data.password, user.password);
  if (!isValid) throw new AppError("Password is incorrect", 400);

  const existing = await prisma.user.findUnique({
    where: { email: data.newEmail },
  });

  if (existing) throw new AppError("Email already in use", 409);

  return prisma.user.update({
    where: { id: userId },
    data: { email: data.newEmail },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });
};

function generateToken(userId: number): string {
  return jwt.sign({ userId }, env.JWT_SECRET as Secret, {
    expiresIn: env.JWT_EXPIRES_IN as StringValue,
  });
}

export const authService = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  changeEmail,
};
