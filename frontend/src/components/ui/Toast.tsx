// src/components/ui/Toast.tsx

import { useEffect } from "react";
import { Bell, X } from "lucide-react";

export interface ToastData {
  id: string;
  symbol: string;
  condition: string;
  threshold: number;
  close: number;
}

interface ToastProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

function Toast({ toast, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 5000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const conditionText =
    toast.condition === "GT"
      ? "rose above"
      : toast.condition === "LT"
        ? "fell below"
        : "hit";

  return (
    <div className="flex items-start gap-3 bg-white border border-emerald-100 rounded-2xl shadow-lg p-4 w-80 animate-in slide-in-from-right-4">
      <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
        <Bell size={15} className="text-emerald-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">Alert triggered</p>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
          <span className="font-mono font-bold">{toast.symbol}</span>{" "}
          {conditionText}{" "}
          <span className="font-mono font-bold">
            ₹{toast.threshold.toLocaleString("en-IN")}
          </span>
          {" — "}closed at{" "}
          <span className="font-mono font-bold">
            ₹{toast.close.toLocaleString("en-IN")}
          </span>
        </p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-gray-300 hover:text-gray-500 transition-colors shrink-0"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-[100]">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
