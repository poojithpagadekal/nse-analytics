import { prisma } from "../../config/prisma";
import { NotFoundError } from "../../lib/errors";
import { CreateAlertInput, AlertQuery } from "./alerts.schema";

const getAlerts = async (query: AlertQuery) => {
  return prisma.alert.findMany({
    where: {
      ...(query.symbol && { stock: { symbol: query.symbol } }),
      ...(query.isActive !== undefined && { isActive: query.isActive }),
    },
    include: { stock: { select: { symbol: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });
};

const createAlert = async (data: CreateAlertInput) => {
  const stock = await prisma.stock.findUnique({
    where: { symbol: data.symbol },
  });

  if (!stock) throw new NotFoundError(`Stock ${data.symbol}`);

  return prisma.alert.create({
    data: {
      stockId: stock.id,
      type: data.type,
      condition: data.condition,
      threshold: data.threshold,
    },
    include: { stock: { select: { symbol: true, name: true } } },
  });
};

const deactivateAlert = async (id: number) => {
  const alert = await prisma.alert.findUnique({ where: { id } });

  if (!alert) throw new NotFoundError(`Alert ${id}`);

  return prisma.alert.update({
    where: { id },
    data: { isActive: false },
  });
};

export const alertsService = {
  getAlerts,
  createAlert,
  deactivateAlert,
};
