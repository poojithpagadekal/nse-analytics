import { useState, useMemo, useRef, useEffect } from "react";
import { X, Search } from "lucide-react";
import { useCreateAlert } from "../../hooks/useAlerts";
import { useStocks } from "../../hooks/useStocks";
import { CustomSelect } from "../ui/CustomSelect";
import {
  ALERT_TYPES,
  CONDITIONS,
  type AlertTypeValue,
  type ConditionValue,
} from "./alerts.constants";

interface CreateAlertFormProps {
  onClose: () => void;
}

export function CreateAlertForm({ onClose }: CreateAlertFormProps) {
  const [symbol, setSymbol] = useState("");
  const [symbolSearch, setSymbolSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [type, setType] = useState<AlertTypeValue>("PRICE_CHANGE");
  const [condition, setCondition] = useState<ConditionValue>("GT");
  const [threshold, setThreshold] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelectSymbol = (s: string) => {
    setSymbol(s);
    setSymbolSearch(s);
    setShowDropdown(false);
  };

  const handleSubmit = async () => {
    if (!symbol || !threshold) return;
    await createAlert.mutateAsync({
      symbol: symbol.toUpperCase(),
      type,
      condition,
      threshold: parseFloat(threshold),
    });
    onClose();
  };

  const conditionLabel = CONDITIONS.find((c) => c.value === condition)?.label;
  const typeLabel = ALERT_TYPES.find(
    (t) => t.value === type,
  )?.label.toLowerCase();
  const isReady =
    symbol.length > 0 && threshold.length > 0 && parseFloat(threshold) > 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">New alert</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Get notified when a condition is met
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-50"
        >
          <X size={16} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
            1 · Stock
          </label>
          <div ref={dropdownRef} className="relative">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search by symbol or name…"
                value={symbolSearch}
                onChange={(e) => {
                  setSymbolSearch(e.target.value);
                  setSymbol(e.target.value.toUpperCase());
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                className="w-full pl-8 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all font-mono placeholder:font-sans"
              />
            </div>

            {showDropdown && filteredStocks.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden py-1">
                {filteredStocks.map((stock) => (
                  <button
                    key={stock.id}
                    type="button"
                    onClick={() => handleSelectSymbol(stock.symbol)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left"
                  >
                    <span className="text-sm font-bold text-gray-900 font-mono w-20 shrink-0">
                      {stock.symbol}
                    </span>
                    <span className="text-xs text-gray-400 truncate">
                      {stock.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
            2 · Alert type
          </label>
          <CustomSelect
            value={type}
            onChange={setType}
            options={
              ALERT_TYPES as unknown as {
                value: AlertTypeValue;
                label: string;
                hint?: string;
              }[]
            }
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
            3 · Condition
          </label>
          <div className="flex gap-2">
            <div className="flex-1">
              <CustomSelect
                value={condition}
                onChange={setCondition}
                options={
                  CONDITIONS as unknown as {
                    value: ConditionValue;
                    label: string;
                  }[]
                }
              />
            </div>
            <input
              type="number"
              placeholder="Value"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              className="w-32 px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all"
            />
          </div>
        </div>
      </div>

      {isReady && (
        <div className="mt-5 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
          <p className="text-xs text-emerald-700 leading-relaxed">
            <span className="font-bold">{symbol}</span> will trigger when{" "}
            <span className="font-semibold">{typeLabel}</span> {conditionLabel}{" "}
            <span className="font-bold font-mono">{threshold}</span>
          </p>
        </div>
      )}

      <div className="flex gap-3 mt-5">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isReady || createAlert.isPending}
          className="flex-1 py-2.5 bg-emerald-500 text-white text-sm font-semibold rounded-xl hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {createAlert.isPending ? "Creating…" : "Create alert"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2.5 bg-gray-100 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}