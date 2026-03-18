import { createBrowserRouter, Navigate } from "react-router-dom";
import StocksPage from "./pages/StocksPage";
import StockDetailPage from "./pages/StockDetailPage";
import AlertsPage from "./pages/AlertsPage";

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/stocks" /> },
  { path: "/stocks", element: <StocksPage /> },
  { path: "/stocks/:symbol", element: <StockDetailPage /> },
  { path: "/alerts", element: <AlertsPage /> },
]);
