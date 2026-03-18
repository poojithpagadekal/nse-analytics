import type { EarningResult } from "../types";
import { apiClient } from "./client";

export const earningsApi = {
  getBySymbol: async (
    symbol: string,
    quarter?: string,
  ): Promise<EarningResult[]> => {
    const { data } = await apiClient.get(`/earnings/${symbol}`, {
      params: { quarter },
    });
    return data;
  },
};
