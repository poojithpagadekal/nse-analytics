import { Bell, BellOff, CheckCircle } from "lucide-react";
import type { Alert } from "../../types";

const ALERT_TYPES = [
  { value: "EPS_GROWTH", label: "EPS Growth" },
  { value: "REVENUE_GROWTH", label: "Revenue Growth" },
  { value: "PATTERN_DETECTED", label: "Pattern Detected" },
  { value: "PRICE_CHANGE", label: "Price Change" },
];

const CONDITIONS = [
  { value: "GT", label: "Greater than" },
  { value: "LT", label: "Less than" },
  { value: "EQ", label: "Equal to" },
];

export function AlertCard({
  alert,
  onDeactivate,
  inactive,
}: {
  alert: Alert;
  onDeactivate?: () => void;
  inactive?: boolean;
}) {
  const typeLabel =
    ALERT_TYPES.find((t) => t.value === alert.type)?.label ?? alert.type;
  const condLabel =
    CONDITIONS.find((c) => c.value === alert.condition)?.label ??
    alert.condition;

  return (
    <div
      className={`bg-white rounded-xl border p-4 flex items-center justify-between transition-all ${
        inactive
          ? "border-gray-100 opacity-50"
          : "border-gray-100 hover:border-emerald-200 hover:shadow-sm"
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center ${
            inactive ? "bg-gray-50" : "bg-emerald-50"
          }`}
        >
          {inactive ? (
            <BellOff size={16} className="text-gray-400" />
          ) : (
            <Bell size={16} className="text-emerald-500" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-bold text-gray-900 font-mono">
              {alert.stock.symbol}
            </span>
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-500">{typeLabel}</span>
          </div>
          <p className="text-xs text-gray-400">
            {condLabel}{" "}
            <span className="font-mono font-medium text-gray-600">
              {alert.threshold}
            </span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {alert.triggeredAt && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
            <CheckCircle size={11} />
            Triggered
          </div>
        )}
        {!inactive && onDeactivate && (
          <button
            onClick={onDeactivate}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
          >
            Deactivate
          </button>
        )}
      </div>
    </div>
  );
}
