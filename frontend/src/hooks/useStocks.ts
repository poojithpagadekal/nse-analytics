import { useQuery } from "@tanstack/react-query";
import { stocksApi } from "../api/stocks";

export const useStocks = () =>
  useQuery({ queryKey: ["stocks"], queryFn: stocksApi.getAll });

export const useStock = (symbol: string) =>
  useQuery({
    queryKey: ["stocks", symbol],
    queryFn: () => stocksApi.getBySymbol(symbol),
    enabled: !!symbol,
  });

export const useStockPrices = (symbol: string, from?: string, to?: string) =>
  useQuery({
    queryKey: ["stocks", symbol, "prices", from, to],
    queryFn: () => stocksApi.getPrices(symbol, from, to),
    enabled: !!symbol,
  });
