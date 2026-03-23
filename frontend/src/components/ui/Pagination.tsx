import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      <PaginationBtn
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
      >
        <ChevronLeft size={15} />
      </PaginationBtn>

      {getPageNumbers(page, totalPages).map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="text-xs text-gray-400 px-1">
            …
          </span>
        ) : (
          <PaginationBtn
            key={`page-${p}`}
            onClick={() => onPageChange(p as number)}
            active={page === p}
          >
            {p}
          </PaginationBtn>
        ),
      )}

      <PaginationBtn
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
      >
        <ChevronRight size={15} />
      </PaginationBtn>

      <span className="text-xs text-gray-400 ml-2">
        Page {page} of {totalPages}
      </span>
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