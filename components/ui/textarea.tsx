"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  maxLength?: number;
  resize?: "none" | "vertical" | "horizontal" | "both";
}

export function Textarea({
  label,
  value,
  onChange,
  placeholder,
  error,
  hint,
  disabled = false,
  required = false,
  rows = 3,
  maxLength,
  resize = "vertical",
}: TextareaProps) {
  const charCount = value.length;
  const showCharCount = maxLength !== undefined;

  return (
    <div>
      {label && (
        <label className="block text-xs text-[#666666] uppercase tracking-wider mb-2">
          {label}
          {required && <span className="text-[#F87171] ml-1">*</span>}
        </label>
      )}

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={cn(
          "w-full px-4 py-3 bg-[#0A0A0A] border rounded-xl text-white font-light placeholder:text-[#666666] transition-colors",
          "focus:outline-none focus:ring-1 focus:ring-[#E07A3C]/20",
          error
            ? "border-[#F87171] focus:border-[#F87171]"
            : "border-[#1F1F1F] focus:border-[#E07A3C] hover:border-[#2A2A2A]",
          disabled && "opacity-50 cursor-not-allowed",
          resize === "none" && "resize-none",
          resize === "vertical" && "resize-y",
          resize === "horizontal" && "resize-x",
          resize === "both" && "resize"
        )}
      />

      <div className="flex items-center justify-between mt-1.5">
        <div>
          {error && <p className="text-sm text-[#F87171]">{error}</p>}
          {hint && !error && <p className="text-xs text-[#666666]">{hint}</p>}
        </div>
        {showCharCount && (
          <p
            className={cn(
              "text-xs",
              maxLength && charCount >= maxLength * 0.9
                ? "text-[#FBBF24]"
                : "text-[#666666]"
            )}
          >
            {charCount}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
}
