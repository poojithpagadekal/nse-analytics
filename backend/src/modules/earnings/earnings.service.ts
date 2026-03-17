import { prisma } from "../../config/prisma";
import { NotFoundError } from "../../lib/errors";
import { createEarningInput } from "./earnings.schema";

const getEarningsBySymbol = async (symbol: string, quarter?: string) => {
  return prisma.earningResult.findMany({
    where: {
      stock: { symbol: symbol.toUpperCase() },
      ...(quarter && { quarter }),
    },
    include: { stock: { select: { symbol: true, name: true } } },
    orderBy: { announcedAt: "desc" },
  });
};

const createEarning = async (data: createEarningInput) => {
  const stock = await prisma.stock.findUnique({
    where: { symbol: data.symbol },
  });

  if (!stock) throw new NotFoundError(`Stock ${data.symbol}`);

  return prisma.earningResult.upsert({
    where: { stockId_quarter: { stockId: stock.id, quarter: data.quarter } },
    update: {
      revenue: data.revenue,
      netProfit: data.netProfit,
      eps: data.eps,
      yoyGrowth: data.yoyGrowth,
    },
    create: {
      stockId: stock.id,
      quarter: data.quarter,
      revenue: data.revenue,
      netProfit: data.netProfit,
      eps: data.eps,
      yoyGrowth: data.yoyGrowth,
      announcedAt: new Date(data.announcedAt),
    },
  });
};

export const earningsService = {
  getEarningsBySymbol,
  createEarning,
};
