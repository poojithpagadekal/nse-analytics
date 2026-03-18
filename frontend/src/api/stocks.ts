import { apiClient } from "./client";
import type { Stock, DailyPrice } from "../types";

export const stocksApi = {
  getAll: async (): Promise<Stock[]> => {
    const { data } = await apiClient.get("/stocks");
    return data;
  },

  getBySymbol: async (symbol: string): Promise<Stock> => {
    const { data } = await apiClient.get(`/stocks/${symbol}`);
    return data;
  },

  getPrices: async (
    symbol: string,
    from?: string,
    to?: string,
  ): Promise<DailyPrice[]> => {
    const { data } = await apiClient.get(`stocks/${symbol}/prices`, {
      params: { from, to },
    });
    return data;
  },
};
