import { prisma } from "../../config/prisma";
import { getSocket } from "../../config/socket";

export const evaluateAlert = async (date: string): Promise<void> => {
  const alerts = await prisma.alert.findMany({
    where: {
      isActive: true,
      type: "PRICE_CHANGE",
      triggeredAt: null,
    },
    include: {
      stock: { select: { symbol: true } },
    },
  });

  if (alerts.length === 0) return;

  const symbols = [...new Set(alerts.map((a) => a.stock.symbol))];

  const prices = await prisma.dailyPrice.findMany({
    where: {
      date: new Date(date),
      stock: { symbol: { in: symbols } },
    },
    include: {
      stock: { select: { symbol: true } },
    },
  });

  const priceMap = new Map<string, number>(
    prices.map((p) => [p.stock.symbol, Number(p.close)]),
  );

  const now = new Date();
  const triggeredIds: number[] = [];

  for (const alert of alerts) {
    const close = priceMap.get(alert.stock.symbol);
    if (close === undefined) continue;

    const threshold = Number(alert.threshold);
    const triggered =
      (alert.condition === "GT" && close > threshold) ||
      (alert.condition === "LT" && close < threshold) ||
      (alert.condition === "EQ" && close === threshold);

    if (triggered) {
      triggeredIds.push(alert.id);
      getSocket().to(`user:${alert.userId}`).emit("alert:triggered", {
        alert: alert.id,
        symbol: alert.stock.symbol,
        condition: alert.condition,
        threshold,
        close,
        date,
      });
    }
  }

  if (triggeredIds.length > 0) {
    await prisma.alert.updateMany({
      where: { id: { in: triggeredIds } },
      data: { isActive: false, triggeredAt: now },
    });
  }
};