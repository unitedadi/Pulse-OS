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
          // Base styles - Open aesthetic
          "inline-flex items-center justify-center font-normal",
          "transition-all duration-200 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E07A3C]/50",
          "disabled:pointer-events-none disabled:opacity-40",

          // Variants - Open style (outlined primary)
          {
            // Primary - Outlined pill (Open signature)
            "bg-transparent text-white border border-[#2A2A2A] rounded-full hover:border-white hover:bg-white hover:text-black":
              variant === "primary",

            // Accent - Warm orange fill for key CTAs
            "bg-[#E07A3C] text-white rounded-full hover:bg-[#C96A32] border-0":
              variant === "accent",

            // Ghost - Minimal
            "bg-transparent text-[#A0A0A0] rounded-full hover:text-white hover:bg-white/5":
              variant === "ghost",

            // Destructive - Outlined red
            "bg-transparent text-[#F87171] border border-[#F87171]/30 rounded-full hover:border-[#F87171]/60 hover:bg-[#F87171]/5":
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
