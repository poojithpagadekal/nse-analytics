interface StockCardProps {
  symbol: string;
  name: string;
  sector: string | null;
  dailyPrices: { close: string; date: string }[];
  onClick: () => void;
}

export function StockCard({
  symbol,
  name,
  sector,
  dailyPrices,
  onClick,
}: StockCardProps) {
  const latest = dailyPrices[0] ? parseFloat(dailyPrices[0].close) : null;
  const prev = dailyPrices[1] ? parseFloat(dailyPrices[1].close) : null;

  const change = latest !== null && prev !== null ? latest - prev : null;
  const changePct =
    change !== null && prev !== null ? (change / prev) * 100 : null;
  const isPositive = changePct !== null && changePct >= 0;

  const hasRealName = name !== symbol;

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-100 rounded-2xl p-4 cursor-pointer hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-50 hover:-translate-y-0.5 transition-all duration-150 group"
    >
      <div className="flex items-start justify-between mb-1.5">
        <span className="text-[13px] font-bold text-gray-900 font-mono tracking-wide">
          {symbol}
        </span>
        {sector && (
          <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full font-medium leading-none shrink-0 ml-1">
            {sector.length > 8 ? sector.slice(0, 8) + "…" : sector}
          </span>
        )}
      </div>

      {hasRealName && (
        <p className="text-[11px] text-gray-400 truncate leading-relaxed mb-3">
          {name}
        </p>
      )}

      {latest !== null ? (
        <div
          className={`flex items-end justify-between ${!hasRealName ? "mt-3" : ""}`}
        >
          <span className="text-sm font-bold text-gray-900 font-mono">
            ₹
            {latest.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
          {changePct !== null && (
            <span
              className={`text-[11px] font-semibold font-mono ${
                isPositive ? "text-emerald-500" : "text-red-500"
              }`}
            >
              {isPositive ? "+" : ""}
              {changePct.toFixed(2)}%
            </span>
          )}
        </div>
      ) : (
        <div className="h-0.5 bg-gray-100 rounded-full group-hover:bg-emerald-400 transition-colors duration-150 mt-3" />
      )}
    </div>
  );
}
