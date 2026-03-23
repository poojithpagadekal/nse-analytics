import { prisma } from "../../config/prisma";
import { Prisma } from "@prisma/client";

const getAllStocks = async () => {
  return prisma.stock.findMany({
    orderBy: { symbol: "asc" },
    include: {
      dailyPrices: {
        orderBy: { date: "desc" },
        take: 2,
        select: { close: true, date: true },
      },
    },
  });
};

const getStockBySymbol = async (symbol: string) => {
  return prisma.stock.findUnique({
    where: { symbol: symbol.toUpperCase() },
  });
};

const createStock = async (data: Prisma.StockCreateInput) => {
  return prisma.stock.upsert({
    where: { symbol: data.symbol },
    update: {
      name: data.name,
      sector: data.sector ?? null,
      industry: data.industry ?? null,
    },
    create: data,
  });
};

const getDailyPrices = async (symbol: string, from?: string, to?: string) => {
  return prisma.dailyPrice.findMany({
    where: {
      stock: { symbol: symbol.toUpperCase() },
      ...(from || to
        ? {
            date: {
              ...(from ? { gte: new Date(from) } : {}),
              ...(to ? { lte: new Date(to) } : {}),
            },
          }
        : {}),
    },
    orderBy: { date: "asc" },
    select: {
      date: true,
      open: true,
      high: true,
      low: true,
      close: true,
      volume: true,
    },
  });
};

export const stocksService = {
  getAllStocks,
  getStockBySymbol,
  createStock,
  getDailyPrices,
};
