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
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] mb-5">
          {icon || <Inbox className="h-7 w-7 text-[#666666]" />}
        </div>

        <h3 className="text-lg font-normal text-white mb-2">
          {title}
        </h3>

        {description && (
          <p className="text-[#666666] max-w-sm mb-6">
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
