import { useQuery } from "@tanstack/react-query";
import { earningsApi } from "../api/earnings";

export const useEarnings = (symbol: string, quarter?: string) => {
  useQuery({
    queryKey: ["earnings", symbol, quarter],
    queryFn: () => earningsApi.getBySymbol(symbol, quarter),
    enabled: !!symbol,
  });
};
