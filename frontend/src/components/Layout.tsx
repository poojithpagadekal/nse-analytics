import { NavLink, Outlet } from "react-router-dom";
import { BarChart2, TrendingUp, Bell, User, LogOut } from "lucide-react";
import { useSocket } from "../hooks/useSocket";
import { useLogout, getStoredUser } from "../hooks/useAuth";

const navItems = [
  { to: "/stocks", label: "Stocks", icon: TrendingUp },
  { to: "/alerts", label: "Alerts", icon: Bell },
  { to: "/profile", label: "Profile", icon: User },
];

export function Layout() {
  useSocket();
  const logout = useLogout();
  const user = getStoredUser();

  return (
    <div className="flex min-h-screen bg-[#f6f7f9]">
      <aside className="w-[220px] bg-white border-r border-[#eef0f3] flex flex-col fixed top-0 left-0 h-screen z-50">
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-[#eef0f3]">
          <BarChart2 size={20} color="#00c896" />
          <span className="text-[15px] font-semibold text-[#1a1a2e] tracking-tight">
            NSE<span className="text-[#00c896]">Analytics</span>
          </span>
        </div>

        <nav className="p-3 flex-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium no-underline mb-1 transition-colors duration-150 ${
                  isActive
                    ? "bg-[#f0fdf8] text-[#00c896]"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-[#eef0f3]">
          {user && (
            <div className="mb-3">
              <p className="text-[13px] font-semibold text-[#1a1a2e]">
                {user.name}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">{user.email}</p>
            </div>
          )}
          <button
            onClick={logout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-[13px] font-medium text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors duration-150"
          >
            <LogOut size={15} />
            Logout
          </button>
          <p className="text-[11px] text-gray-400 mt-3">
            Market data · NSE India
          </p>
        </div>
      </aside>

      <main className="ml-[220px] flex-1 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
