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
        <label className="block text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
          {label}
          {required && <span className="text-[var(--color-error)] ml-1">*</span>}
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
          "w-full px-4 py-3 bg-[var(--color-bg-card)] border rounded-[var(--radius-md)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-colors shadow-[var(--shadow-xs)]",
          "focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-primary)]/20",
          error
            ? "border-[var(--color-error)] focus:border-[var(--color-error)]"
            : "border-[var(--color-border-default)] focus:border-[var(--color-accent-primary)] hover:border-[var(--color-border-hover)]",
          disabled && "opacity-50 cursor-not-allowed",
          resize === "none" && "resize-none",
          resize === "vertical" && "resize-y",
          resize === "horizontal" && "resize-x",
          resize === "both" && "resize"
        )}
      />

      <div className="flex items-center justify-between mt-1.5">
        <div>
          {error && <p className="text-sm text-[var(--color-error)]">{error}</p>}
          {hint && !error && <p className="text-xs text-[var(--color-text-muted)]">{hint}</p>}
        </div>
        {showCharCount && (
          <p
            className={cn(
              "text-xs",
              maxLength && charCount >= maxLength * 0.9
                ? "text-[var(--color-warning)]"
                : "text-[var(--color-text-muted)]"
            )}
          >
            {charCount}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
}
