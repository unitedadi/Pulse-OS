"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export interface MetricCardProps {
  label: string;
  value: string | number;
  prefix?: string;
  suffix?: string;
  trend?: {
    direction: "up" | "down" | "neutral";
    value: string;
    label?: string;
  };
  subtitle?: string;
  icon?: React.ReactNode;
  variant?: "default" | "highlight" | "muted";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function MetricCard({
  label,
  value,
  prefix,
  suffix,
  trend,
  subtitle,
  icon,
  variant = "default",
  size = "md",
  className,
}: MetricCardProps) {
  const trendColors = {
    up: "text-[var(--color-success)]",
    down: "text-[var(--color-error)]",
    neutral: "text-[var(--color-text-muted)]",
  };

  const trendIcons = {
    up: <TrendingUp className="h-3.5 w-3.5" />,
    down: <TrendingDown className="h-3.5 w-3.5" />,
    neutral: <Minus className="h-3.5 w-3.5" />,
  };

  const variantStyles = {
    default: "bg-[var(--color-bg-card)] border-[var(--color-border-subtle)] shadow-[var(--shadow-card)]",
    highlight: "bg-[var(--color-bg-accent)] border-transparent text-[var(--color-text-inverse)] shadow-[var(--shadow-md)]",
    muted: "bg-[var(--color-bg-secondary)] border-[var(--color-border-subtle)]",
  };

  const sizeStyles = {
    sm: {
      padding: "p-4",
      label: "text-xs",
      value: "text-2xl",
      prefix: "text-sm",
    },
    md: {
      padding: "p-5",
      label: "text-xs",
      value: "text-4xl",
      prefix: "text-lg",
    },
    lg: {
      padding: "p-6",
      label: "text-sm",
      value: "text-5xl",
      prefix: "text-xl",
    },
  };

  const styles = sizeStyles[size];

  return (
    <div
      className={cn(
        "rounded-2xl border",
        variantStyles[variant],
        styles.padding,
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={cn(
            "uppercase tracking-wider",
            styles.label,
            variant === "highlight" ? "text-white/60" : "text-[var(--color-text-muted)]"
          )}
        >
          {label}
        </span>
        {icon && (
          <span className={variant === "highlight" ? "text-white/45" : "text-[var(--color-text-muted)]"}>{icon}</span>
        )}
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-2">
        {prefix && (
          <span className={cn(variant === "highlight" ? "text-white/50" : "text-[var(--color-text-muted)]", styles.prefix)}>{prefix}</span>
        )}
        <span
          className={cn(
            "font-normal tabular-nums tracking-normal",
            variant === "highlight" ? "text-white" : "text-[var(--color-text-primary)]",
            styles.value
          )}
        >
          {typeof value === "number" ? value.toLocaleString() : value}
        </span>
        {suffix && (
          <span className={cn(variant === "highlight" ? "text-white/50" : "text-[var(--color-text-muted)]", styles.prefix)}>{suffix}</span>
        )}
      </div>

      {/* Trend or Subtitle */}
      {(trend || subtitle) && (
        <div className="mt-3 flex items-center gap-2">
          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 text-sm",
                trendColors[trend.direction]
              )}
            >
              {trendIcons[trend.direction]}
              <span>{trend.value}</span>
              {trend.label && (
                <span className="text-[var(--color-text-muted)]">{trend.label}</span>
              )}
            </div>
          )}
          {subtitle && !trend && (
            <span className="text-sm text-[var(--color-text-muted)]">{subtitle}</span>
          )}
        </div>
      )}
    </div>
  );
}

// Grid layout for multiple metrics
export interface MetricGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function MetricGrid({
  children,
  columns = 4,
  className,
}: MetricGridProps) {
  const colStyles = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-4", colStyles[columns], className)}>
      {children}
    </div>
  );
}
