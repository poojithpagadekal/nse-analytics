import type { EarningResult } from "../../types";

export function EarningsTable({ earnings }: { earnings?: EarningResult[] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
      <h2 className="text-sm font-semibold text-gray-700 mb-5">
        Earnings History
      </h2>

      {!earnings || earnings.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">
          No earnings data available for this stock
        </p>
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
  );
}
