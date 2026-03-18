import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { alertsApi } from "../api/alerts";

export const useAlerts = (symbol?: string, isActive?: boolean) => {
  useQuery({
    queryKey: ["alerts", symbol, isActive],
    queryFn: () => alertsApi.getAll(symbol, isActive),
  });
};

export const useCreateAlert = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: alertsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });
};

export const useDeactivateAlert = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: alertsApi.deactivate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });
};
