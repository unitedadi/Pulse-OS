"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, RefreshCw, Clock, ExternalLink, Share2 } from "lucide-react";
import { Button } from "./button";

export interface PaymentLinkCardProps {
  url: string;
  expiresAt?: Date;
  status?: "active" | "expired" | "used";
  amount?: number;
  currency?: string;
  onCopy?: () => void;
  onRegenerate?: () => void;
  onShare?: () => void;
  className?: string;
}

export function PaymentLinkCard({
  url,
  expiresAt,
  status = "active",
  amount,
  currency = "AED",
  onCopy,
  onRegenerate,
  onShare,
  className,
}: PaymentLinkCardProps) {
  const [copied, setCopied] = React.useState(false);

  // Calculate time remaining
  const getTimeRemaining = () => {
    if (!expiresAt) return null;

    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();

    if (diff <= 0) return "Expired";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} day${days !== 1 ? "s" : ""} left`;
    }

    if (hours > 0) {
      return `${hours}h ${minutes}m left`;
    }

    return `${minutes}m left`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const isExpired = status === "expired";
  const isUsed = status === "used";
  const isActive = status === "active";
  const timeRemaining = getTimeRemaining();

  return (
    <div
      className={cn(
        "rounded-2xl border p-5",
        isExpired
          ? "bg-[#111111] border-[#F87171]/20"
          : isUsed
          ? "bg-[#111111] border-[#4ADE80]/20"
          : "bg-[#111111] border-[#1F1F1F]",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-xs uppercase tracking-wider",
              isExpired ? "text-[#F87171]" : isUsed ? "text-[#4ADE80]" : "text-[#E07A3C]"
            )}
          >
            {isExpired ? "Expired" : isUsed ? "Paid" : "Payment Link"}
          </span>
        </div>

        {amount && (
          <div className="text-right">
            <span className="text-xs text-[#666666]">{currency}</span>{" "}
            <span className="text-lg font-light text-white">{amount.toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* URL Display */}
      <div className="bg-[#0A0A0A] rounded-xl p-4 mb-4">
        <p className="text-sm text-[#A0A0A0] font-mono truncate">{url}</p>
      </div>

      {/* Timer (if active) */}
      {isActive && timeRemaining && (
        <div className="flex items-center gap-2 text-sm text-[#666666] mb-4">
          <Clock className="h-4 w-4" />
          <span>{timeRemaining}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {isActive ? (
          <>
            <Button
              variant="primary"
              onClick={handleCopy}
              className="flex-1"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </>
              )}
            </Button>

            {onShare && (
              <Button variant="ghost" onClick={onShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            )}

            <Button
              variant="ghost"
              onClick={() => window.open(url, "_blank")}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </>
        ) : isExpired && onRegenerate ? (
          <Button variant="primary" onClick={onRegenerate} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Generate New Link
          </Button>
        ) : (
          <Button variant="ghost" onClick={handleCopy} className="w-full">
            <Copy className="h-4 w-4 mr-2" />
            Copy Link
          </Button>
        )}
      </div>
    </div>
  );
}

// Compact inline version
export interface PaymentLinkInlineProps {
  url: string;
  className?: string;
}

export function PaymentLinkInline({ url, className }: PaymentLinkInlineProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 bg-[#0A0A0A] rounded-xl px-4 py-3",
        className
      )}
    >
      <p className="text-sm text-[#A0A0A0] font-mono flex-1 truncate">{url}</p>
      <button
        onClick={handleCopy}
        className={cn(
          "p-2 rounded-lg transition-colors",
          copied
            ? "text-[#4ADE80] bg-[#4ADE80]/10"
            : "text-[#666666] hover:text-white hover:bg-[#1A1A1A]"
        )}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}
