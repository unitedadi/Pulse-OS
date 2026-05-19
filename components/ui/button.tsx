"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "accent" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          "inline-flex items-center justify-center font-medium",
          "transition-all duration-200 ease-out active:scale-[0.98]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-primary)]/20",
          "disabled:pointer-events-none disabled:opacity-40",

          {
            "bg-[var(--color-accent-primary)] text-[var(--color-text-inverse)] border border-transparent rounded-full hover:bg-[var(--color-accent-secondary)] shadow-[var(--shadow-sm)]":
              variant === "primary",

            "bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-full hover:bg-[var(--color-accent-light)] border border-[var(--color-border-subtle)]":
              variant === "accent",

            "bg-transparent text-[var(--color-text-secondary)] rounded-full hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]":
              variant === "ghost",

            "bg-transparent text-[var(--color-error)] border border-[var(--color-error)]/30 rounded-full hover:border-[var(--color-error)]/60 hover:bg-[var(--color-error-light)]":
              variant === "destructive",
          },

          // Sizes
          {
            "h-9 px-5 text-sm gap-2": size === "sm",
            "h-11 px-6 text-base gap-2.5": size === "md",
            "h-13 px-8 text-lg gap-3": size === "lg",
          },

          // Full width
          fullWidth && "w-full",

          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : leftIcon ? (
          <span className="shrink-0">{leftIcon}</span>
        ) : null}

        {children}

        {!loading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
