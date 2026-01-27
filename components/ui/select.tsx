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
        <label className="block text-xs text-[#666666] uppercase tracking-wider mb-2">
          {label}
          {required && <span className="text-[#F87171] ml-1">*</span>}
        </label>
      )}

      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "w-full flex items-center justify-between px-4 py-3 bg-[#0A0A0A] border rounded-xl text-left transition-all",
          "focus:outline-none focus:ring-1 focus:ring-[#E07A3C]/20",
          error
            ? "border-[#F87171] focus:border-[#F87171]"
            : isOpen
              ? "border-[#E07A3C]"
              : "border-[#1F1F1F] hover:border-[#2A2A2A]",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <span className={cn("font-light", selectedOption ? "text-white" : "text-[#666666]")}>
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-[#666666] transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full py-1 bg-[#111111] border border-[#1F1F1F] rounded-xl shadow-lg max-h-60 overflow-auto">
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
                  ? "bg-[#E07A3C]/10 text-[#E07A3C]"
                  : "text-white hover:bg-[#1A1A1A]"
              )}
            >
              <span className="font-light">{option.label}</span>
              {option.value === value && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>
      )}

      {error && <p className="mt-1.5 text-sm text-[#F87171]">{error}</p>}
      {hint && !error && <p className="mt-1.5 text-xs text-[#666666]">{hint}</p>}
    </div>
  );
}
