import { useState } from "react";
import { Bell, BellOff, Plus, X, CheckCircle } from "lucide-react";
import {
  useAlerts,
  useCreateAlert,
  useDeactivateAlert,
} from "../hooks/useAlerts";

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

export function AlertsPage() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    symbol: "",
    type: "EPS_GROWTH",
    condition: "GT",
    threshold: "",
  });

  const { data: alerts, isLoading } = useAlerts();
  const createAlert = useCreateAlert();
  const deactivateAlert = useDeactivateAlert();

  const handleSubmit = async () => {
    if (!form.symbol || !form.threshold) return;
    await createAlert.mutateAsync({
      symbol: form.symbol.toUpperCase(),
      type: form.type,
      condition: form.condition,
      threshold: parseFloat(form.threshold),
    });
    setShowForm(false);
    setForm({ symbol: "", type: "EPS_GROWTH", condition: "GT", threshold: "" });
  };

  const activeAlerts = alerts?.filter((a) => a.isActive) ?? [];
  const inactiveAlerts = alerts?.filter((a) => !a.isActive) ?? [];

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bell size={20} className="text-emerald-500" />
            <h1 className="text-xl font-bold text-gray-900">Alerts</h1>
          </div>
          <p className="text-sm text-gray-400 ml-7">
            {activeAlerts.length} active alert
            {activeAlerts.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-sm font-semibold rounded-xl hover:bg-emerald-600 transition-colors"
        >
          <Plus size={15} />
          New Alert
        </button>
      </div>

      {/* Create alert form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-gray-800">
              Create Alert
            </h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5">
            {/* Symbol */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                Stock Symbol
              </label>
              <input
                type="text"
                placeholder="e.g. TCS"
                value={form.symbol}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    symbol: e.target.value.toUpperCase(),
                  }))
                }
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all font-mono"
              />
            </div>

            {/* Threshold */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                Threshold Value
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

            {/* Alert type */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                Alert Type
              </label>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm((f) => ({ ...f, type: e.target.value }))
                }
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all bg-white"
              >
                {ALERT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Condition */}
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

          {/* Preview */}
          {form.symbol && form.threshold && (
            <div className="bg-emerald-50 rounded-xl px-4 py-3 mb-5">
              <p className="text-xs text-emerald-700">
                Alert when <span className="font-bold">{form.symbol}</span>{" "}
                {ALERT_TYPES.find((t) => t.value === form.type)?.label} is{" "}
                {CONDITIONS.find((c) => c.value === form.condition)
                  ?.label.split(" ")[0]
                  .toLowerCase()}{" "}
                <span className="font-bold">{form.threshold}</span>
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={
                !form.symbol || !form.threshold || createAlert.isPending
              }
              className="px-5 py-2 bg-emerald-500 text-white text-sm font-semibold rounded-xl hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {createAlert.isPending ? "Creating..." : "Create Alert"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-5 py-2 bg-gray-100 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Active alerts */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-7 h-7 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : activeAlerts.length === 0 && !showForm ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <Bell size={32} className="text-gray-200 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-600">No active alerts</p>
          <p className="text-xs text-gray-400 mt-1 mb-5">
            Create an alert to get notified when conditions are met
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-emerald-500 text-white text-sm font-semibold rounded-xl hover:bg-emerald-600 transition-colors"
          >
            Create your first alert
          </button>
        </div>
      ) : (
        <div className="space-y-3 mb-8">
          {activeAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onDeactivate={() => deactivateAlert.mutate(alert.id)}
            />
          ))}
        </div>
      )}

      {/* Inactive alerts */}
      {inactiveAlerts.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Deactivated
          </h2>
          <div className="space-y-2">
            {inactiveAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} inactive />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AlertCard({
  alert,
  onDeactivate,
  inactive,
}: {
  alert: any;
  onDeactivate?: () => void;
  inactive?: boolean;
}) {
  const typeLabel =
    ALERT_TYPES.find((t) => t.value === alert.type)?.label ?? alert.type;
  const condLabel =
    CONDITIONS.find((c) => c.value === alert.condition)?.label.split(" ")[0] ??
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
