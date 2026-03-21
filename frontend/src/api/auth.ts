import { apiClient } from "./client";

export interface AuthResponse {
  user: {
    id: number;
    name: string;
    email: string;
    createdAt: string;
  };
  token: string;
}

export const authApi = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const { data: res } = await apiClient.post("/auth/register", data);
    return res;
  },

  login: async (data: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const { data: res } = await apiClient.post("/auth/login", data);
    return res;
  },
};
