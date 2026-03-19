import { TrendingUp, TrendingDown } from "lucide-react";

interface StockHeaderProps {
  symbol: string;
  name?: string;
  sector?: string | null;
  latestPrice?: number;
  priceChange?: {
    change: number;
    pct: number;
    isPositive: boolean;
  } | null;
}

function formatPrice(val: number): string {
  return `₹${val.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function StockHeader({
  symbol,
  name,
  sector,
  latestPrice,
  priceChange,
}: StockHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-gray-900 font-mono tracking-wide">
            {symbol}
          </h1>
          {sector && (
            <span className="text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-medium">
              {sector}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-400">{name}</p>
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
                  priceChange.isPositive ? "text-emerald-500" : "text-red-500"
                }`}
              >
                {priceChange.isPositive ? (
                  <TrendingUp size={14} />
                ) : (
                  <TrendingDown size={14} />
                )}
                <span>
                  {priceChange.isPositive ? "+" : ""}
                  {formatPrice(priceChange.change)} (
                  {priceChange.isPositive ? "+" : ""}
                  {priceChange.pct.toFixed(2)}%)
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
