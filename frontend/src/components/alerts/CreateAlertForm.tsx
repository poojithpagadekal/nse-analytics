import { useState, useMemo } from "react";
import { X, Search } from "lucide-react";
import { useCreateAlert } from "../../hooks/useAlerts";
import { useStocks } from "../../hooks/useStocks";

const ALERT_TYPES = [
  { value: "EPS_GROWTH", label: "EPS Growth" },
  { value: "REVENUE_GROWTH", label: "Revenue Growth" },
  { value: "PATTERN_DETECTED", label: "Pattern Detected" },
  { value: "PRICE_CHANGE", label: "Price Change" },
];

const CONDITIONS = [
  { value: "GT", label: "Greater than (>)" },
  { value: "LT", label: "Less than (<)" },
  { value: "EQ", label: "Equal to (=)" },
];

export function CreateAlertForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    symbol: "",
    type: "EPS_GROWTH",
    condition: "GT",
    threshold: "",
  });
  const [symbolSearch, setSymbolSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const createAlert = useCreateAlert();
  const { data: stocks } = useStocks();

  const filteredStocks = useMemo(() => {
    if (!symbolSearch.trim() || !stocks) return [];
    const q = symbolSearch.toLowerCase();
    return stocks
      .filter(
        (s) =>
          s.symbol.toLowerCase().includes(q) ||
          s.name.toLowerCase().includes(q),
      )
      .slice(0, 6);
  }, [symbolSearch, stocks]);

  const handleSelectSymbol = (symbol: string) => {
    setForm((f) => ({ ...f, symbol }));
    setSymbolSearch(symbol);
    setShowDropdown(false);
  };

  const handleSubmit = async () => {
    if (!form.symbol || !form.threshold) return;
    await createAlert.mutateAsync({
      symbol: form.symbol.toUpperCase(),
      type: form.type,
      condition: form.condition,
      threshold: parseFloat(form.threshold),
    });
    onClose();
  };

  const typeLabel = ALERT_TYPES.find((t) => t.value === form.type)?.label;
  const condWord = CONDITIONS.find((c) => c.value === form.condition)
    ?.label.split(" ")[0]
    .toLowerCase();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold text-gray-800">Create Alert</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="relative">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
            Stock Symbol
          </label>
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search symbol or name..."
              value={symbolSearch}
              onChange={(e) => {
                setSymbolSearch(e.target.value);
                setForm((f) => ({
                  ...f,
                  symbol: e.target.value.toUpperCase(),
                }));
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              className="w-full pl-8 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all font-mono"
            />
          </div>

          {showDropdown && filteredStocks.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg z-10 overflow-hidden">
              {filteredStocks.map((stock) => (
                <button
                  key={stock.id}
                  onClick={() => handleSelectSymbol(stock.symbol)}
                  className="w-full px-3 py-2.5 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                >
                  <span className="text-sm font-bold text-gray-900 font-mono">
                    {stock.symbol}
                  </span>
                  <span className="text-xs text-gray-400 ml-2">
                    {stock.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
            Threshold
          </label>
          <input
            type="number"
            placeholder="e.g. 15"
            value={form.threshold}
            onChange={(e) =>
              setForm((f) => ({ ...f, threshold: e.target.value }))
            }
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
            Alert Type
          </label>
          <select
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all bg-white"
          >
            {ALERT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
            Condition
          </label>
          <select
            value={form.condition}
            onChange={(e) =>
              setForm((f) => ({ ...f, condition: e.target.value }))
            }
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all bg-white"
          >
            {CONDITIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {form.symbol && form.threshold && (
        <div className="bg-emerald-50 rounded-xl px-4 py-3 mb-5">
          <p className="text-xs text-emerald-700">
            Alert when <span className="font-bold">{form.symbol}</span>{" "}
            {typeLabel} is {condWord}{" "}
            <span className="font-bold">{form.threshold}</span>
          </p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={!form.symbol || !form.threshold || createAlert.isPending}
          className="px-5 py-2 bg-emerald-500 text-white text-sm font-semibold rounded-xl hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {createAlert.isPending ? "Creating..." : "Create Alert"}
        </button>
        <button
          onClick={onClose}
          className="px-5 py-2 bg-gray-100 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
