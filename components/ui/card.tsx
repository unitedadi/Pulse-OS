"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  hover?: boolean;
  variant?: "default" | "elevated" | "accent";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, padding = "lg", hover = false, variant = "default", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-[var(--color-bg-card)] rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] shadow-[var(--shadow-card)]",
          "transition-all duration-200 ease-out",

          // Variants
          {
            // Default - dark card with subtle border
            "": variant === "default",
            "bg-[var(--color-bg-secondary)]": variant === "elevated",
            "bg-[var(--color-bg-accent)] text-[var(--color-text-inverse)] border-transparent": variant === "accent",
          },

          // Hover effect with glow
          hover && [
            "cursor-pointer",
            "hover:border-[var(--color-border-hover)]",
            "hover:shadow-[var(--shadow-card-hover)]",
          ],

          // Padding
          {
            "p-0": padding === "none",
            "p-4": padding === "sm",
            "p-6": padding === "md",
            "p-8": padding === "lg",
            "p-10": padding === "xl",
          },

          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-2", className)}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "text-xl font-normal text-[var(--color-text-primary)] leading-tight tracking-normal",
        className
      )}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-[var(--color-text-muted)]", className)}
      {...props}
    />
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center pt-6", className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
