import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import { useStocks } from "../hooks/useStocks";

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

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Loading stocks...</p>
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-sm text-red-400">
          Failed to load. Is the backend running?
        </p>
      </div>
    );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-7">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp size={20} className="text-emerald-500" />
          <h1 className="text-xl font-bold text-gray-900">All Stocks</h1>
        </div>
        <p className="text-sm text-gray-400 ml-7">
          {stocks?.length.toLocaleString()} stocks listed on NSE
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-6">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search symbol or company..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-colors shadow-sm"
        />
      </div>

      {/* Result count */}
      {query && (
        <p className="text-xs text-gray-400 mb-4">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "
          {query}"
        </p>
      )}

      {/* Cards grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 mb-8">
        {paginated.map((stock) => (
          <StockCard
            key={stock.id}
            symbol={stock.symbol}
            name={stock.name}
            sector={stock.sector}
            onClick={() => navigate(`/stocks/${stock.symbol}`)}
          />
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-3xl mb-3">🔍</p>
          <p className="text-sm font-medium text-gray-600">No stocks found</p>
          <p className="text-xs text-gray-400 mt-1">
            Try a different symbol or name
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <PaginationBtn
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft size={15} />
          </PaginationBtn>

          {getPageNumbers(page, totalPages).map((p, i) =>
            p === "..." ? (
              <span
                key={`ellipsis-${i}`}
                className="text-xs text-gray-400 px-1"
              >
                …
              </span>
            ) : (
              <PaginationBtn
                key={`page-${p}`}
                onClick={() => setPage(p as number)}
                active={page === p}
              >
                {p}
              </PaginationBtn>
            ),
          )}

          <PaginationBtn
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            <ChevronRight size={15} />
          </PaginationBtn>

          <span className="text-xs text-gray-400 ml-2">
            Page {page} of {totalPages}
          </span>
        </div>
      )}
    </div>
  );
}

function StockCard({
  symbol,
  name,
  sector,
  onClick,
}: {
  symbol: string;
  name: string;
  sector: string | null;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-100 rounded-2xl p-4 cursor-pointer hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-50 hover:-translate-y-0.5 transition-all duration-150 group"
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-[13px] font-bold text-gray-900 font-mono tracking-wide">
          {symbol}
        </span>
        {sector && (
          <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full font-medium leading-none">
            {sector.length > 8 ? sector.slice(0, 8) + "…" : sector}
          </span>
        )}
      </div>
      <p className="text-[11px] text-gray-400 truncate leading-relaxed">
        {name}
      </p>
      <div className="mt-3 h-0.5 bg-gray-100 rounded-full group-hover:bg-emerald-400 transition-colors duration-150" />
    </div>
  );
}

function PaginationBtn({
  onClick,
  disabled,
  active,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-9 h-9 flex items-center justify-center rounded-lg border text-sm font-medium transition-all duration-150 ${
        active
          ? "bg-emerald-500 border-emerald-500 text-white"
          : disabled
            ? "border-gray-100 text-gray-300 cursor-not-allowed bg-white"
            : "border-gray-200 text-gray-600 bg-white hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50"
      }`}
    >
      {children}
    </button>
  );
}

function getPageNumbers(current: number, total: number): (number | string)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
  if (current >= total - 3)
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
}
