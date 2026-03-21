import { useState } from "react";
import { Bell, Plus } from "lucide-react";
import {
  useAlerts,
  useDeactivateAlert,
  useReactivateAlert,
  useDeleteAlert,
} from "../hooks/useAlerts";
import { AlertCard } from "../components/alerts/AlertCard";
import { CreateAlertForm } from "../components/alerts/CreateAlertForm";
import { Spinner } from "../components/ui/Spinner";
import { EmptyState } from "../components/ui/EmptyState";

export function AlertsPage() {
  const [showForm, setShowForm] = useState(false);
  const { data: alerts, isLoading } = useAlerts();
  const deactivateAlert = useDeactivateAlert();
  const reactivateAlert = useReactivateAlert();
  const deleteAlert = useDeleteAlert();

  const activeAlerts = alerts?.filter((a) => a.isActive) ?? [];
  const inactiveAlerts = alerts?.filter((a) => !a.isActive) ?? [];

  return (
    <div className="p-8 max-w-4xl">
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

      {showForm && <CreateAlertForm onClose={() => setShowForm(false)} />}

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      ) : activeAlerts.length === 0 && !showForm ? (
        <div className="bg-white rounded-2xl border border-gray-100">
          <EmptyState
            icon="🔔"
            title="No active alerts"
            description="Create an alert to get notified when conditions are met"
          />
        </div>
      ) : (
        <div className="space-y-3 mb-8">
          {activeAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onDeactivate={() => deactivateAlert.mutate(alert.id)}
              onDelete={() => deleteAlert.mutate(alert.id)}
            />
          ))}
        </div>
      )}

      {inactiveAlerts.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Inactive
          </h2>
          <div className="space-y-2">
            {inactiveAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onReactivate={() => reactivateAlert.mutate(alert.id)}
                onDelete={() => deleteAlert.mutate(alert.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}