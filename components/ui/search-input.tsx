"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
  autoFocus?: boolean;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  debounceMs = 300,
  className,
  autoFocus = false,
}: SearchInputProps) {
  const [localValue, setLocalValue] = React.useState(value);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Sync external value changes
  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounced onChange
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, debounceMs, onChange, value]);

  const handleClear = () => {
    setLocalValue("");
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <div
      className={cn(
        "relative flex items-center",
        className
      )}
    >
      <Search className="absolute left-4 h-5 w-5 text-[var(--color-text-muted)] pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={cn(
          "w-full h-12 pl-12 pr-10 rounded-full",
          "bg-[var(--color-bg-card)] border border-[var(--color-border-default)] shadow-[var(--shadow-xs)]",
          "text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] text-base",
          "focus:outline-none focus:border-[var(--color-border-focus)] focus:shadow-[var(--shadow-focus)]",
          "transition-colors"
        )}
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 p-1 rounded-full text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
