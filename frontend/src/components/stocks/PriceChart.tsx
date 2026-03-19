import { useState, useMemo,useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Spinner } from "../ui/Spinner";
import { useStockPrices } from "../../hooks/useStocks";

const RANGES = [
  { label: "1W", days: 7 },
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
  { label: "1Y", days: 365 },
];

function getFromDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0];
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

interface PriceChartProps {
  symbol: string;
  onDataChange?: (
    data: { open: number; high: number; low: number; close: number }[],
  ) => void;
}

export function PriceChart({ symbol, onDataChange }: PriceChartProps) {
  const [rangeIdx, setRangeIdx] = useState(1);
  const from = getFromDate(RANGES[rangeIdx].days);
  const { data: prices, isLoading } = useStockPrices(symbol, from);

  const chartData = useMemo(() => {
    return (
      prices?.map((p) => ({
        date: formatDate(p.date),
        close: parseFloat(p.close as unknown as string),
        open: parseFloat(p.open as unknown as string),
        high: parseFloat(p.high as unknown as string),
        low: parseFloat(p.low as unknown as string),
      })) ?? []
    );
  }, [prices]);

  useEffect(() => {
    onDataChange?.(chartData);
  }, [chartData, onDataChange]);

  const isPositive =
    chartData.length < 2
      ? true
      : chartData[chartData.length - 1].close >= chartData[0].close;

  const chartColor = isPositive ? "#00c896" : "#ef4444";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-semibold text-gray-700">Price History</h2>
        <div className="flex gap-1 bg-gray-50 p-1 rounded-lg">
          {RANGES.map((r, i) => (
            <button
              key={r.label}
              onClick={() => setRangeIdx(i)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-150 ${
                rangeIdx === i
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Spinner />
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-sm text-gray-400">No price data for this range</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart
            data={chartData}
            margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.15} />
                <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f3f4f6"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              tickLine={false}
              axisLine={false}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              tickFormatter={(v: any) =>
                `₹${Number(v).toLocaleString("en-IN")}`
              }
              width={72}
              domain={["auto", "auto"]}
            />
            <Tooltip
              contentStyle={{
                background: "#1a1a2e",
                border: "none",
                borderRadius: 10,
                padding: "8px 14px",
              }}
              labelStyle={{ color: "#9ca3af", fontSize: 11, marginBottom: 4 }}
              itemStyle={{ color: "#ffffff", fontSize: 13, fontWeight: 600 }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(val: any) =>
                [
                  val !== undefined
                    ? `₹${Number(val).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
                    : "—",
                  "Close",
                ] as any
              }
            />
            <Area
              type="monotone"
              dataKey="close"
              stroke={chartColor}
              strokeWidth={2}
              fill="url(#priceGrad)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0, fill: chartColor }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
