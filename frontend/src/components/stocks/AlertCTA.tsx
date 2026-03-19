import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function AlertCTA({ symbol }: { symbol: string }) {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 p-5 flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-gray-800 mb-0.5">
          Set a price alert
        </p>
        <p className="text-xs text-gray-400">
          Get notified when {symbol} hits your target
        </p>
      </div>
      <button
        onClick={() => navigate("/alerts")}
        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-sm font-semibold rounded-xl hover:bg-emerald-600 transition-colors"
      >
        <Bell size={14} />
        Create Alert
      </button>
    </div>
  );
}
