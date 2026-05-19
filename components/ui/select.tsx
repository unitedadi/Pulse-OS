"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
}

export function Select({
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  error,
  hint,
  disabled = false,
  required = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on escape
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label className="block text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
          {label}
          {required && <span className="text-[var(--color-error)] ml-1">*</span>}
        </label>
      )}

      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "w-full flex items-center justify-between px-4 py-3 bg-[var(--color-bg-card)] border rounded-[var(--radius-md)] text-left transition-all shadow-[var(--shadow-xs)]",
          "focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-primary)]/20",
          error
            ? "border-[var(--color-error)] focus:border-[var(--color-error)]"
            : isOpen
              ? "border-[var(--color-accent-primary)]"
              : "border-[var(--color-border-default)] hover:border-[var(--color-border-hover)]",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <span className={cn(selectedOption ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-muted)]")}>
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-[var(--color-text-muted)] transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full py-1 bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] shadow-[var(--shadow-lg)] max-h-60 overflow-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={cn(
                "w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors",
                option.value === value
                  ? "bg-[var(--color-bg-secondary)] text-[var(--color-accent-primary)]"
                  : "text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]"
              )}
            >
              <span>{option.label}</span>
              {option.value === value && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>
      )}

      {error && <p className="mt-1.5 text-sm text-[var(--color-error)]">{error}</p>}
      {hint && !error && <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">{hint}</p>}
    </div>
  );
}
