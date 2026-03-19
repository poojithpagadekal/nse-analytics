import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ArrowLeft, TrendingUp, TrendingDown, Bell } from "lucide-react";
import { useStock, useStockPrices } from "../hooks/useStocks";
import { useEarnings } from "../hooks/useEarnings";

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

function formatPrice(val: number): string {
  return `₹${val.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function StockDetailPage() {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const [rangeIdx, setRangeIdx] = useState(1); // default 1M

  const from = getFromDate(RANGES[rangeIdx].days);

  const { data: stock, isLoading: stockLoading } = useStock(symbol!);
  const { data: prices, isLoading: pricesLoading } = useStockPrices(
    symbol!,
    from,
  );
  const { data: earnings } = useEarnings(symbol!);

  const chartData = useMemo(
    () =>
      prices?.map((p) => ({
        date: formatDate(p.date),
        close: parseFloat(p.close as unknown as string),
        open: parseFloat(p.open as unknown as string),
        high: parseFloat(p.high as unknown as string),
        low: parseFloat(p.low as unknown as string),
      })) ?? [],
    [prices],
  );

  const priceChange = useMemo(() => {
    if (chartData.length < 2) return null;
    const first = chartData[0].close;
    const last = chartData[chartData.length - 1].close;
    const change = last - first;
    const pct = (change / first) * 100;
    return { change, pct, isPositive: change >= 0 };
  }, [chartData]);

  const isPositive = priceChange?.isPositive ?? true;
  const chartColor = isPositive ? "#00c896" : "#ef4444";
  const latestPrice = chartData[chartData.length - 1]?.close;

  if (stockLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
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

      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-900 font-mono tracking-wide">
              {symbol}
            </h1>
            {stock?.sector && (
              <span className="text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-medium">
                {stock.sector}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400">{stock?.name}</p>
        </div>

        <div className="text-right">
          {latestPrice && (
            <>
              <p className="text-2xl font-bold text-gray-900 font-mono">
                {formatPrice(latestPrice)}
              </p>
              {priceChange && (
                <div
                  className={`flex items-center justify-end gap-1 mt-1 text-sm font-medium ${
                    isPositive ? "text-emerald-500" : "text-red-500"
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp size={14} />
                  ) : (
                    <TrendingDown size={14} />
                  )}
                  <span>
                    {isPositive ? "+" : ""}
                    {formatPrice(priceChange.change)} ({isPositive ? "+" : ""}
                    {priceChange.pct.toFixed(2)}%)
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

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

        {pricesLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-sm text-gray-400">
              No price data for this range
            </p>
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
                  boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                }}
                labelStyle={{ color: "#9ca3af", fontSize: 11, marginBottom: 4 }}
                itemStyle={{ color: "#ffffff", fontSize: 13, fontWeight: 600 }}
                formatter={(val: any) =>
                  [
                    val !== undefined ? formatPrice(Number(val)) : "—",
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

      {chartData.length > 0 && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Open",
              value: formatPrice(chartData[chartData.length - 1].open),
            },
            {
              label: "High",
              value: formatPrice(Math.max(...chartData.map((d) => d.high))),
            },
            {
              label: "Low",
              value: formatPrice(Math.min(...chartData.map((d) => d.low))),
            },
            {
              label: "Close",
              value: formatPrice(chartData[chartData.length - 1].close),
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm"
            >
              <p className="text-xs text-gray-400 mb-1.5">{stat.label}</p>
              <p className="text-sm font-bold text-gray-900 font-mono">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-gray-700">
            Earnings History
          </h2>
        </div>

        {!earnings || earnings.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-sm text-gray-400">No earnings data available</p>
            <p className="text-xs text-gray-300 mt-1">
              Add earnings via POST /earnings
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  {[
                    "Quarter",
                    "Revenue",
                    "Net Profit",
                    "EPS",
                    "YoY Growth",
                    "Announced",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3 pr-4"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {earnings.map((e) => (
                  <tr
                    key={e.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 pr-4 text-sm font-semibold text-gray-900 font-mono">
                      {e.quarter}
                    </td>
                    <td className="py-3 pr-4 text-sm text-gray-600 font-mono">
                      {e.revenue
                        ? `₹${Number(e.revenue).toLocaleString("en-IN")}Cr`
                        : "—"}
                    </td>
                    <td className="py-3 pr-4 text-sm text-gray-600 font-mono">
                      {e.netProfit
                        ? `₹${Number(e.netProfit).toLocaleString("en-IN")}Cr`
                        : "—"}
                    </td>
                    <td className="py-3 pr-4 text-sm text-gray-600 font-mono">
                      {e.eps ? `₹${Number(e.eps).toFixed(2)}` : "—"}
                    </td>
                    <td className="py-3 pr-4">
                      {e.yoyGrowth ? (
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            Number(e.yoyGrowth) >= 0
                              ? "text-emerald-600 bg-emerald-50"
                              : "text-red-500 bg-red-50"
                          }`}
                        >
                          {Number(e.yoyGrowth) >= 0 ? "+" : ""}
                          {Number(e.yoyGrowth).toFixed(1)}%
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="py-3 text-xs text-gray-400">
                      {new Date(e.announcedAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 p-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-800 mb-0.5">
            Set a price alert
          </p>
          <p className="text-xs text-gray-400">
            Get notified when {symbol} hits your target
          </p>
        </div>
        <button
          onClick={() => navigate("/alerts")}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-sm font-semibold rounded-xl hover:bg-emerald-600 transition-colors"
        >
          <Bell size={14} />
          Create Alert
        </button>
      </div>
    </div>
  );
}
