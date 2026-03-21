import { useState } from "react";
import { Link } from "react-router-dom";
import { BarChart2 } from "lucide-react";
import { useLogin } from "../hooks/useAuth";
import { getErrorMessage } from "../lib/getErrorMessage";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate({ email, password });
  };

  return (
    <div className="min-h-screen bg-[#f6f7f9] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <BarChart2 size={24} color="#00c896" />
          <span className="text-xl font-semibold text-[#1a1a2e] tracking-tight">
            NSE<span className="text-[#00c896]">Analytics</span>
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-[#eef0f3] shadow-sm p-8">
          <h1 className="text-lg font-bold text-[#1a1a2e] mb-1">
            Welcome back
          </h1>
          <p className="text-sm text-gray-400 mb-6">Sign in to your account</p>

          {login.isError && (
            <div className="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-lg mb-5">
              {getErrorMessage(login.error, "Invalid credentials")}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={login.isPending}
              className="w-full py-2.5 bg-emerald-500 text-white text-sm font-semibold rounded-xl hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-2"
            >
              {login.isPending ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-400 mt-5">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-emerald-500 font-medium hover:text-emerald-600"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
