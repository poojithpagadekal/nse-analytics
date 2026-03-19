import { useQuery } from "@tanstack/react-query";
import { earningsApi } from "../api/earnings";

export const useEarnings = (symbol: string) =>
  useQuery({
    queryKey: ["earnings", symbol],
    queryFn: () => earningsApi.getBySymbol(symbol),
    enabled: !!symbol,
  });
