import { prisma } from "../../config/prisma";
import { AppError, NotFoundError } from "../../lib/errors";
import { CreateAlertInput, AlertQuery } from "./alerts.schema";

const getAlerts = async (userId: number, query: AlertQuery) => {
  return prisma.alert.findMany({
    where: {
      userId,
      ...(query.symbol && { stock: { symbol: query.symbol } }),
      ...(query.isActive !== undefined && { isActive: query.isActive }),
    },
    include: { stock: { select: { symbol: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });
};

const createAlert = async (userId: number, data: CreateAlertInput) => {
  const stock = await prisma.stock.findUnique({
    where: { symbol: data.symbol },
  });

  if (!stock) throw new NotFoundError(`Stock ${data.symbol}`);

  return prisma.alert.create({
    data: {
      userId,
      stockId: stock.id,
      type: data.type,
      condition: data.condition,
      threshold: data.threshold,
    },
    include: { stock: { select: { symbol: true, name: true } } },
  });
};

const deactivateAlert = async (userId: number, id: number) => {
  const alert = await prisma.alert.findUnique({ where: { id } });

  if (!alert) throw new NotFoundError(`Alert ${id}`);
  if (alert.userId !== userId) {
    throw new AppError("Forbidden", 403);
  }
  return prisma.alert.update({
    where: { id },
    data: { isActive: false },
  });
};

const deleteAlert = async (userId: number, id: number) => {
  const alert = await prisma.alert.findUnique({ where: { id } });

  if (!alert) throw new NotFoundError(`Alert ${id}`);

  if (alert.userId !== userId) {
    throw new AppError("Forbidden", 403);
  }

  await prisma.alert.delete({ where: { id } });
  return { message: "Alert deleted" };
};

const reactivateAlert = async (userId: number, id: number) => {
  const alert = await prisma.alert.findUnique({ where: { id } });
  if (!alert) throw new NotFoundError(`Alert ${id}`);
  if (alert.userId !== userId) throw new AppError("Forbidden", 403);

  return prisma.alert.update({
    where: { id },
    data: { isActive: true },
  });
};

export const alertsService = {
  getAlerts,
  createAlert,
  deactivateAlert,
  deleteAlert,
  reactivateAlert,
};
