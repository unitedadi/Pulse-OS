"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Inbox } from "lucide-react";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon, title, description, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center py-16 px-6 text-center",
          className
        )}
        {...props}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-[var(--radius-xl)] bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] mb-5">
          {icon || <Inbox className="h-7 w-7 text-[var(--color-text-muted)]" />}
        </div>

        <h3 className="text-lg font-normal text-[var(--color-text-primary)] mb-2">
          {title}
        </h3>

        {description && (
          <p className="text-[var(--color-text-muted)] max-w-sm mb-6">
            {description}
          </p>
        )}

        {action && (
          <Button onClick={action.onClick}>
            {action.label}
          </Button>
        )}
      </div>
    );
  }
);

EmptyState.displayName = "EmptyState";

export { EmptyState };
