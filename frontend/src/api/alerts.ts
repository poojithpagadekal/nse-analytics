import { apiClient } from "./client";
import type { Alert } from "../types";

export const alertsApi = {
  getAll: async (symbol?: string, isActive?: boolean): Promise<Alert[]> => {
    const { data } = await apiClient.get("/alerts", {
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

  reactivate: async (id: number): Promise<Alert> => {
    const { data } = await apiClient.patch(`/alerts/${id}/reactivate`);
    return data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const { data } = await apiClient.delete(`/alerts/${id}`);
    return data;
  },
};
