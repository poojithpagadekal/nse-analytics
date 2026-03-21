import { createBrowserRouter, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { StocksPage } from "./pages/StocksPage";
import { StockDetailPage } from "./pages/StockDetailPage";
import { AlertsPage } from "./pages/AlertsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: "/", element: <Navigate to="/stocks" replace /> },
          { path: "/stocks", element: <StocksPage /> },
          { path: "/stocks/:symbol", element: <StockDetailPage /> },
          { path: "/alerts", element: <AlertsPage /> },
          { path: "/profile", element: <ProfilePage /> },
        ],
      },
    ],
  },
]);
