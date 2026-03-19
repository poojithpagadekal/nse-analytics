import { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useStock } from "../hooks/useStocks";
import { useEarnings } from "../hooks/useEarnings";
import { StockHeader } from "../components/stocks/StockHeader";
import { PriceChart } from "../components/stocks/PriceChart";
import { OHLCStats } from "../components/stocks/OHLCStats";
import { EarningsTable } from "../components/stocks/EarningsTable";
import { AlertCTA } from "../components/stocks/AlertCTA";
import { Spinner } from "../components/ui/Spinner";

export function StockDetailPage() {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const { data: stock, isLoading } = useStock(symbol!);
  const { data: earnings } = useEarnings(symbol!);

  const [chartData, setChartData] = useState<
    {
      open: number;
      high: number;
      low: number;
      close: number;
    }[]
  >([]);

  const handleDataChange = useCallback((data: typeof chartData) => {
    setChartData(data);
  }, []);

  const priceChange = (() => {
    if (chartData.length < 2) return null;
    const first = chartData[0].close;
    const last = chartData[chartData.length - 1].close;
    const change = last - first;
    const pct = (change / first) * 100;
    return { change, pct, isPositive: change >= 0 };
  })();

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );

  return (
    <div className="p-8 max-w-6xl">
      <button
        onClick={() => navigate("/stocks")}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-6 group"
      >
        <ArrowLeft
          size={16}
          className="group-hover:-translate-x-0.5 transition-transform"
        />
        All Stocks
      </button>

      <StockHeader
        symbol={symbol!}
        name={stock?.name}
        sector={stock?.sector}
        latestPrice={chartData[chartData.length - 1]?.close}
        priceChange={priceChange}
      />

      <PriceChart symbol={symbol!} onDataChange={handleDataChange} />
      <OHLCStats data={chartData} />
      <EarningsTable earnings={earnings} />
      <AlertCTA symbol={symbol!} />
    </div>
  );
}
