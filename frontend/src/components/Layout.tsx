import { NavLink, Outlet } from "react-router-dom";
import { BarChart2, TrendingUp, Bell } from "lucide-react";

const navItems = [
  { to: "/stocks", label: "Stocks", icon: TrendingUp },
  { to: "/alerts", label: "Alerts", icon: Bell },
];

export function Layout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f6f7f9" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: "220px",
          background: "#ffffff",
          borderRight: "1px solid #eef0f3",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          zIndex: 100,
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "20px",
            borderBottom: "1px solid #eef0f3",
          }}
        >
          <BarChart2 size={20} color="#00c896" />
          <span
            style={{
              fontSize: "15px",
              fontWeight: 600,
              color: "#1a1a2e",
              letterSpacing: "-0.3px",
            }}
          >
            NSE<span style={{ color: "#00c896" }}>Analytics</span>
          </span>
        </div>

        {/* Nav */}
        <nav style={{ padding: "12px", flex: 1 }}>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 12px",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: 500,
                textDecoration: "none",
                marginBottom: "4px",
                background: isActive ? "#f0fdf8" : "transparent",
                color: isActive ? "#00c896" : "#6b7280",
                transition: "background 0.15s, color 0.15s",
              })}
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: "16px 20px", borderTop: "1px solid #eef0f3" }}>
          <p style={{ fontSize: "11px", color: "#9ca3af" }}>
            Market data · NSE India
          </p>
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: "220px", flex: 1, minHeight: "100vh" }}>
        <Outlet />
      </main>
    </div>
  );
}
