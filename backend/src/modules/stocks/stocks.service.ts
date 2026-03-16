import { prisma } from "../../config/prisma";
import { Prisma } from "@prisma/client";

const getAllStocks = async () => {
  return prisma.stock.findMany({
    orderBy: { symbol: "asc" },
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

export const stocksService = {
  getAllStocks,
  getStockBySymbol,
  createStock,
};
