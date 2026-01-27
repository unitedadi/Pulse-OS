"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { BookingStatus } from "@/types";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md";
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          // Base styles
          "inline-flex items-center font-medium rounded-full",

          // Sizes
          {
            "px-2 py-0.5 text-xs": size === "sm",
            "px-2.5 py-1 text-sm": size === "md",
          },

          // Variants
          {
            "bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]":
              variant === "default",
            "bg-[var(--color-success-light)] text-[var(--color-success)]":
              variant === "success",
            "bg-[var(--color-warning-light)] text-[var(--color-warning)]":
              variant === "warning",
            "bg-[var(--color-error-light)] text-[var(--color-error)]":
              variant === "error",
            "bg-[var(--color-info-light)] text-[var(--color-info)]":
              variant === "info",
          },

          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

// ============================================
// STATUS BADGE (Booking-specific)
// ============================================

const STATUS_CONFIG: Record<BookingStatus, { label: string; className: string }> = {
  draft: {
    label: "Draft",
    className: "bg-[#F3F2F0] text-[var(--color-status-draft)]",
  },
  pending_payment: {
    label: "Pending Payment",
    className: "bg-[#FDF6E9] text-[var(--color-status-pending)]",
  },
  expired: {
    label: "Expired",
    className: "bg-[#F3F2F0] text-[var(--color-status-cancelled)] line-through",
  },
  paid: {
    label: "Paid",
    className: "bg-[#EFF6FF] text-[var(--color-status-paid)]",
  },
  upcoming: {
    label: "Upcoming",
    className: "bg-[#E6F4F5] text-[#119098]",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-[#F3F0FF] text-[var(--color-status-in-progress)]",
  },
  completed: {
    label: "Completed",
    className: "bg-[var(--color-success-light)] text-[var(--color-status-completed)]",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-[#F3F2F0] text-[var(--color-status-cancelled)] line-through",
  },
  refunded: {
    label: "Refunded",
    className: "bg-[#FEF3C7] text-[var(--color-status-refunded)]",
  },
  no_show: {
    label: "No Show",
    className: "bg-[var(--color-error-light)] text-[var(--color-status-no-show)]",
  },
  failed: {
    label: "Failed",
    className: "bg-[var(--color-error-light)] text-[var(--color-status-failed)]",
  },
};

export interface StatusBadgeProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  status: BookingStatus;
  size?: "sm" | "md";
}

const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ className, status, size = "md", ...props }, ref) => {
    const config = STATUS_CONFIG[status];

    return (
      <span
        ref={ref}
        className={cn(
          // Base styles
          "inline-flex items-center font-medium rounded-full",

          // Sizes
          {
            "px-2 py-0.5 text-xs": size === "sm",
            "px-2.5 py-1 text-sm": size === "md",
          },

          // Status-specific styles
          config.className,

          className
        )}
        {...props}
      >
        {config.label}
      </span>
    );
  }
);

StatusBadge.displayName = "StatusBadge";

export { Badge, StatusBadge };
