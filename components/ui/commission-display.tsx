"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, AlertCircle, CheckCircle, Clock } from "lucide-react";

export interface CommissionDisplayProps {
  rate?: number;
  amount: number;
  currency?: string;
  status?: "pending" | "earned" | "clawedback" | "processing";
  variant?: "inline" | "card" | "compact";
  showRate?: boolean;
  className?: string;
}

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-[#FBBF24]",
    bgColor: "bg-[#FBBF24]/10",
    borderColor: "border-[#FBBF24]/20",
  },
  earned: {
    label: "Earned",
    icon: CheckCircle,
    color: "text-[#4ADE80]",
    bgColor: "bg-[#4ADE80]/10",
    borderColor: "border-[#4ADE80]/20",
  },
  clawedback: {
    label: "Clawed Back",
    icon: AlertCircle,
    color: "text-[#F87171]",
    bgColor: "bg-[#F87171]/10",
    borderColor: "border-[#F87171]/20",
  },
  processing: {
    label: "Processing",
    icon: Clock,
    color: "text-[#A0A0A0]",
    bgColor: "bg-[#1A1A1A]",
    borderColor: "border-[#2A2A2A]",
  },
};

export function CommissionDisplay({
  rate,
  amount,
  currency = "AED",
  status = "pending",
  variant = "card",
  showRate = false,
  className,
}: CommissionDisplayProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  if (variant === "inline") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <span className={cn("text-sm", config.color)}>
          <Icon className="h-4 w-4 inline mr-1" />
          {config.label}
        </span>
        <span className="text-white font-light">
          {currency} {amount.toLocaleString()}
        </span>
        {showRate && rate && (
          <span className="text-[#666666] text-sm">({(rate * 100).toFixed(0)}%)</span>
        )}
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-full",
          config.bgColor,
          className
        )}
      >
        <TrendingUp className={cn("h-3.5 w-3.5", config.color)} />
        <span className={cn("text-sm font-light", config.color)}>
          {currency} {amount.toLocaleString()}
        </span>
      </div>
    );
  }

  // Card variant (default)
  return (
    <div
      className={cn(
        "rounded-2xl border p-5",
        config.bgColor,
        config.borderColor,
        className
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className={cn("h-5 w-5", config.color)} />
          <span className={cn("text-sm uppercase tracking-wider", config.color)}>
            {config.label} Commission
          </span>
        </div>
        {showRate && rate && (
          <span className="text-xs text-[#666666] bg-[#1A1A1A] px-2 py-1 rounded-full">
            {(rate * 100).toFixed(0)}% rate
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-[#666666] text-lg">{currency}</span>
        <span className="text-4xl font-extralight text-white tabular-nums">
          {amount.toLocaleString()}
        </span>
      </div>

      {status === "pending" && (
        <p className="text-xs text-[#666666] mt-3">
          Commission will be confirmed after service completion
        </p>
      )}

      {status === "clawedback" && (
        <p className="text-xs text-[#F87171] mt-3">
          Commission was reversed due to booking cancellation or refund
        </p>
      )}
    </div>
  );
}

// Summary card for multiple commissions
export interface CommissionSummaryProps {
  pending: number;
  earned: number;
  currency?: string;
  className?: string;
}

export function CommissionSummary({
  pending,
  earned,
  currency = "AED",
  className,
}: CommissionSummaryProps) {
  return (
    <div className={cn("rounded-2xl bg-[#111111] border border-[#1F1F1F] p-5", className)}>
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-[#E07A3C]" />
        <span className="text-sm uppercase tracking-wider text-[#E07A3C]">
          Your Commissions
        </span>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Earned */}
        <div>
          <p className="text-xs text-[#4ADE80] mb-1 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Earned
          </p>
          <p className="text-2xl font-extralight text-white">
            <span className="text-sm text-[#666666]">{currency}</span>{" "}
            {earned.toLocaleString()}
          </p>
        </div>

        {/* Pending */}
        <div>
          <p className="text-xs text-[#FBBF24] mb-1 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </p>
          <p className="text-2xl font-extralight text-white">
            <span className="text-sm text-[#666666]">{currency}</span>{" "}
            {pending.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
