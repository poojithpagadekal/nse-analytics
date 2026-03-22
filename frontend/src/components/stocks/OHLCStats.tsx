interface OHLCStatsProps {
  data: { open: number; high: number; low: number; close: number }[];
}

function formatPrice(val: number): string {
  return `₹${val.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function OHLCStats({ data }: OHLCStatsProps) {
  if (data.length === 0) return null;

  const latest = data[data.length - 1];
  const stats = [
    { label: "Open", value: formatPrice(latest.open) },
    {
      label: "High",
      value: formatPrice(
        data.reduce((max, d) => (d.high > max ? d.high : max), data[0].high),
      ),
    },
    {
      label: "Low",
      value: formatPrice(
        data.reduce((min, d) => (d.low < min ? d.low : min), data[0].low),
      ),
    },
    { label: "Close", value: formatPrice(latest.close) },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
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
  );
}
