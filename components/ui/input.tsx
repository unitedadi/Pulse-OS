"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, hint, leftIcon, rightIcon, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5"
          >
            {label}
            {props.required && <span className="text-[var(--color-error)] ml-0.5">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            className={cn(
              // Base styles
              "w-full h-10 px-3 text-base rounded-[var(--radius-md)]",
              "bg-[var(--color-bg-card)] text-[var(--color-text-primary)] shadow-[var(--shadow-xs)]",
              "border border-[var(--color-border-default)]",
              "transition-all duration-200",

              // Placeholder
              "placeholder:text-[var(--color-text-muted)]",

              // Focus
              "focus:outline-none focus:border-[var(--color-border-focus)] focus:shadow-[var(--shadow-focus)]",

              // Disabled
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--color-bg-secondary)]",

              // Error state
              error && "border-[var(--color-error)] focus:border-[var(--color-error)] focus:shadow-[0_0_0_3px_rgba(217,68,82,0.2)]",

              // Icons padding
              leftIcon && "pl-10",
              rightIcon && "pr-10",

              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
              {rightIcon}
            </div>
          )}
        </div>

        {(error || hint) && (
          <p
            className={cn(
              "mt-1.5 text-sm",
              error ? "text-[var(--color-error)]" : "text-[var(--color-text-muted)]"
            )}
          >
            {error || hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
