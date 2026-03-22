import { useState, useEffect, useRef } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption<T extends string> {
  value: T;
  label: string;
  hint?: string;
}

interface CustomSelectProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  placeholder?: string;
}

export function CustomSelect<T extends string>({
  value,
  onChange,
  options,
  placeholder = "Select…",
}: CustomSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg hover:border-emerald-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all"
      >
        <span
          className={selected ? "text-gray-800 font-medium" : "text-gray-400"}
        >
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          size={14}
          className={`text-gray-400 transition-transform duration-150 shrink-0 ml-2 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden py-1">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800">{opt.label}</p>
                {opt.hint && (
                  <p className="text-xs text-gray-400 mt-0.5">{opt.hint}</p>
                )}
              </div>
              {opt.value === value && (
                <Check size={14} className="text-emerald-500 shrink-0 ml-2" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
