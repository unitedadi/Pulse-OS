"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick?: () => void;
  currentTime?: Date;
  partner?: {
    name: string;
    logo?: string;
  };
  children?: React.ReactNode;
}

export function Header({ onMenuClick, currentTime, children }: HeaderProps) {

  // Format time like Open.com
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="sticky top-0 z-40 bg-[#0A0A0A] pt-6">
      <header className="h-12 flex items-center justify-between px-6 lg:px-10">
      {/* Left section - Menu + Time */}
      <div className="flex items-center gap-6">
        {/* Menu button */}
        <button
          onClick={onMenuClick}
          className="p-2.5 -ml-2 rounded-full text-white/70 hover:bg-white hover:text-black transition-all"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Time display - Open.com style */}
        {currentTime && (
          <span className="text-[11px] text-[#555555] tracking-wider uppercase tabular-nums">
            {formatTime(currentTime)}{" "}
            <span className="text-[#444444]">GST</span>
          </span>
        )}
      </div>

      {/* Center - Logo */}
      <Link
        href="/dashboard"
        className="absolute left-1/2 -translate-x-1/2"
      >
        <img
          src="/images/pulseoslogo.svg"
          alt="Pulse OS"
          className="h-10 md:h-11"
        />
      </Link>

    </header>

      {/* Optional children (e.g., DateSelector) */}
      {children && (
        <div className="pt-6 pb-6 px-6 lg:px-10">
          {children}
        </div>
      )}
    </div>
  );
}
