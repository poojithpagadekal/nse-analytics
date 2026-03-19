import { createBrowserRouter, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import {StocksPage} from "./pages/StocksPage";
import {StockDetailPage} from "./pages/StockDetailPage";
import {AlertsPage} from "./pages/AlertsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/stocks" replace /> },
      { path: "stocks", element: <StocksPage /> },
      { path: "stocks/:symbol", element: <StockDetailPage /> },
      { path: "alerts", element: <AlertsPage /> },
    ],
  },
]);
