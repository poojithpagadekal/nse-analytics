import type { Alert } from "../types";
import { apiClient } from "./client";

export const alertsApi = {
  getAll: async (symbol?: string, isActive?: boolean): Promise<Alert[]> => {
    const { data } = await apiClient.get(`/alerts`, {
      params: { symbol, isActive },
    });
    return data;
  },

  create: async (payload: {
    symbol: string;
    type: string;
    condition: string;
    threshold: number;
  }): Promise<Alert> => {
    const { data } = await apiClient.post("/alerts", payload);
    return data;
  },

  deactivate: async (id: number): Promise<Alert> => {
    const { data } = await apiClient.patch(`/alerts/${id}/deactivate`);
    return data;
  },
};
