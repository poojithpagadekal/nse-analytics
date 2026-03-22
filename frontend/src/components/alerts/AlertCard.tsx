import { Bell, BellOff, CheckCircle, Trash2, RefreshCw } from "lucide-react";
import type { Alert } from "../../types";
// Value import (no "type" keyword) — these are runtime objects, not just types
import { ALERT_TYPE_LABELS, CONDITION_LABELS } from "./alerts.constants";

interface AlertCardProps {
  alert: Alert;
  onDeactivate?: () => void;
  onReactivate?: () => void;
  onDelete?: () => void;
}

export function AlertCard({
  alert,
  onDeactivate,
  onReactivate,
  onDelete,
}: AlertCardProps) {
  return (
    <div
      className={`bg-white rounded-xl border p-4 flex items-center justify-between transition-all ${
        !alert.isActive
          ? "border-gray-100 opacity-60"
          : "border-gray-100 hover:border-emerald-200 hover:shadow-sm"
      }`}
    >
      {/* Left — icon + label */}
      <div className="flex items-center gap-4">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center ${
            alert.isActive ? "bg-emerald-50" : "bg-gray-50"
          }`}
        >
          {alert.isActive ? (
            <Bell className="h-4 w-4 text-emerald-500" />
          ) : (
            <BellOff className="h-4 w-4 text-gray-400" />
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-bold text-gray-900 font-mono">
              {alert.stock.symbol}
            </span>
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-500">
              {/* Fallback to raw value if somehow an unknown type appears */}
              {ALERT_TYPE_LABELS[
                alert.type as keyof typeof ALERT_TYPE_LABELS
              ] ?? alert.type}
            </span>
            {!alert.isActive && (
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                Inactive
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400">
            {CONDITION_LABELS[
              alert.condition as keyof typeof CONDITION_LABELS
            ] ?? alert.condition}{" "}
            <span className="font-mono font-medium text-gray-600">
              {alert.threshold}
            </span>
          </p>
        </div>
      </div>

      {/* Right — action buttons */}
      <div className="flex items-center gap-2">
        {alert.triggeredAt && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
            <CheckCircle className="h-3 w-3" />
            Triggered
          </div>
        )}

        {alert.isActive && onDeactivate && (
          <button
            onClick={onDeactivate}
            className="text-xs text-gray-400 hover:text-orange-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-orange-50"
          >
            Deactivate
          </button>
        )}

        {!alert.isActive && onReactivate && (
          <button
            onClick={onReactivate}
            className="flex items-center gap-1 text-xs text-emerald-500 hover:text-emerald-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-emerald-50"
          >
            <RefreshCw className="h-3 w-3" />
            Reactivate
          </button>
        )}

        {onDelete && (
          <button
            onClick={onDelete}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
          >
            <Trash2 className="h-3 w-3" />
            Delete
          </button>
        )}
      </div>
    </div>
  );
}