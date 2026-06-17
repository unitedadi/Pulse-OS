"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Menu } from "lucide-react";
import { Avatar } from "@/components/ui";
import { appendPulseAccountId, normalizePulseAccountId } from "@/lib/pulse-account-selector";

interface HeaderProps {
  onMenuClick?: () => void;
  currentTime?: Date;
  partner?: {
    name: string;
    logo?: string;
    sellerId?: string;
    customerId?: string;
  };
  children?: React.ReactNode;
}

export function Header({ onMenuClick, currentTime, partner, children }: HeaderProps) {
  const searchParams = useSearchParams();
  const accountId = normalizePulseAccountId(searchParams.get("account_id"));
  const companyName = partner?.name || "Pulse OS";
  const partnerMeta = [partner?.sellerId, partner?.customerId].filter(Boolean).join(" · ");

  // Format time like Open.com
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="sticky top-0 z-40 bg-[var(--color-bg-primary)]/95 pt-6 backdrop-blur-xl">
      <header className="h-12 flex items-center justify-between px-6 lg:px-10">
      {/* Left section - Menu + Time */}
      <div className="flex items-center gap-6">
        {/* Menu button */}
        <button
          onClick={onMenuClick}
          className="p-2.5 -ml-2 rounded-full text-[var(--color-text-secondary)] hover:bg-[var(--color-accent-primary)] hover:text-[var(--color-text-inverse)] transition-all active:scale-[0.98]"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Time display - Open.com style */}
        {currentTime && (
          <span className="text-[11px] text-[var(--color-text-muted)] tracking-wider uppercase tabular-nums">
            {formatTime(currentTime)}{" "}
            <span className="text-[var(--color-text-soft)]">GST</span>
          </span>
        )}
      </div>

      {/* Center - Logo */}
      <Link
        href={appendPulseAccountId("/dashboard", accountId)}
        className="absolute left-1/2 -translate-x-1/2"
      >
        <img
          src="/images/pulseoslogo.svg"
          alt="Pulse OS"
          className="h-10 md:h-11"
        />
      </Link>

      <Link
        href={appendPulseAccountId("/dashboard", accountId)}
        className="group ml-auto inline-flex min-w-0 items-center gap-2 rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/70 px-2 py-1.5 text-left transition-colors hover:border-[var(--color-accent-primary)] hover:bg-[var(--color-bg-primary)]"
        title={partnerMeta ? `${companyName} · ${partnerMeta}` : companyName}
        aria-label={`Logged in as ${companyName}`}
      >
        <Avatar
          name={companyName}
          src={partner?.logo}
          size="sm"
          className="h-7 w-7 text-[11px]"
        />
        <span className="hidden min-w-0 flex-col sm:flex">
          <span className="max-w-[150px] truncate text-xs leading-4 text-[var(--color-text-primary)] lg:max-w-[210px]">
            {companyName}
          </span>
          {partnerMeta && (
            <span className="max-w-[150px] truncate text-[10px] leading-3 text-[var(--color-text-muted)] lg:max-w-[210px]">
              {partnerMeta}
            </span>
          )}
        </span>
      </Link>

    </header>

      {/* Optional children (e.g., DateSelector) */}
      {children && (
        <div className="pt-6 pb-6 px-6 lg:px-10 border-b border-[var(--color-border-subtle)]">
          {children}
        </div>
      )}
    </div>
  );
}
