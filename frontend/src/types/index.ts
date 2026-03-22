export interface Stock {
  id: number;
  symbol: string;
  name: string;
  sector: string | null;
  industry: string | null;
  createdAt: string;
}

export interface DailyPrice {
  date: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
}

export interface EarningResult {
  id: number;
  stockId: number;
  quarter: string;
  revenue: number | null;
  netProfit: number | null;
  eps: number | null;
  yoyGrowth: number | null;
  announcedAt: string;
  createdAt: string;
  stock: { symbol: string; name: string };
}

export interface Alert {
  id: number;
  stockId: number;
  type: string;
  condition: string;
  threshold: number;
  isActive: boolean;
  triggeredAt: string | null;
  createdAt: string;
  stock: { symbol: string; name: string };
}
