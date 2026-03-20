import { prisma } from "../../config/prisma";
import { AppError } from "../../lib/errors";
import * as jwt from "jsonwebtoken";
import { SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { RegisterInput } from "./auth.schema";
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

function generateToken(userId: number): string {
  return jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });
}

export const authService = {
  register,
  login,
};
