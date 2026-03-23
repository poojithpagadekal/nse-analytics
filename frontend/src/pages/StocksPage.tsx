// StocksPage is now purely a page composition file.
// Business logic lives in hooks, UI pieces live in components.
// This file only handles: fetching, filtering, paginating, and rendering.

import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, TrendingUp } from "lucide-react";
import { useStocks } from "../hooks/useStocks";
import { StockCard } from "../components/stocks/StockCard";
import { Pagination } from "../components/ui/Pagination";

const PAGE_SIZE = 24;

export function StocksPage() {
  const { data: stocks, isLoading, isError } = useStocks();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    if (!stocks) return [];
    if (!query.trim()) return stocks;
    const q = query.toLowerCase();
    return stocks.filter(
      (s) =>
        s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q),
    );
  }, [stocks, query]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = useCallback((val: string) => {
    setQuery(val);
    setPage(1);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Loading stocks…</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-sm text-red-400">
          Failed to load. Is the backend running?
        </p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-7">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp size={20} className="text-emerald-500" />
          <h1 className="text-xl font-bold text-gray-900">All Stocks</h1>
        </div>
        <p className="text-sm text-gray-400 ml-7">
          {stocks?.length.toLocaleString()} stocks listed on NSE
        </p>
      </div>

      <div className="relative max-w-md mb-6">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search symbol or company…"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-colors shadow-sm"
        />
      </div>

      {query && (
        <p className="text-xs text-gray-400 mb-4">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "
          {query}"
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 mb-8">
        {paginated.map((stock) => (
          <StockCard
            key={stock.id}
            symbol={stock.symbol}
            name={stock.name}
            sector={stock.sector}
            dailyPrices={stock.dailyPrices}
            onClick={() => navigate(`/stocks/${stock.symbol}`)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-3xl mb-3">🔍</p>
          <p className="text-sm font-medium text-gray-600">No stocks found</p>
          <p className="text-xs text-gray-400 mt-1">
            Try a different symbol or name
          </p>
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
