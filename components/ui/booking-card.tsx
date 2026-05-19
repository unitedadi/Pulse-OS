"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Share2 } from "lucide-react";
import { Avatar } from "./avatar";

interface BookingCardProps {
  service: string;
  customer: string;
  customerAvatar?: string;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled";
  imageUrl?: string;
  onClick?: () => void;
  className?: string;
}

export function BookingCard({
  service,
  customer,
  customerAvatar,
  date,
  time,
  status,
  imageUrl,
  onClick,
  className,
}: BookingCardProps) {
  // Generate a warm gradient based on service name for visual variety
  const getWarmGradient = (name: string) => {
    const gradients = [
      "from-[#173B3D] via-[#2D6668] to-[#0F292A]",
      "from-[#173B3D] via-[#5E7F72] to-[#102F31]",
      "from-[#173B3D] via-[#7B6F58] to-[#102F31]",
      "from-[#173B3D] via-[#355D62] to-[#0F292A]",
      "from-[#173B3D] via-[#6E7B66] to-[#102F31]",
    ];
    const index = name.length % gradients.length;
    return gradients[index];
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative w-full rounded-[var(--radius-xl)] overflow-hidden cursor-pointer shadow-[var(--shadow-card)]",
        "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)] active:scale-[0.99]",
        "aspect-[4/5]",
        className
      )}
    >
      {/* Background - Image or Warm Gradient */}
      <div className="absolute inset-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={service}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className={cn(
              "w-full h-full bg-gradient-to-b",
              getWarmGradient(service)
            )}
          />
        )}
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#173B3D]/95 via-[#173B3D]/45 to-transparent" />
        {/* Bottom blur effect - gradient fade */}
        <div
          className="absolute inset-x-0 bottom-0 h-2/3 backdrop-blur-md"
          style={{
            maskImage: 'linear-gradient(to top, black 0%, black 30%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to top, black 0%, black 30%, transparent 100%)'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative h-full p-5 flex flex-col justify-between">
        {/* Top - Share button and Customer Avatar */}
        <div className="flex justify-between items-start">
          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="p-2.5 rounded-full bg-white/20 hover:bg-white hover:text-[var(--color-accent-primary)] transition-all group/share"
            aria-label="Share"
          >
            <Share2 className="w-4 h-4 text-white/80 group-hover/share:text-[var(--color-accent-primary)]" />
          </button>
          <Avatar
            name={customer}
            src={customerAvatar}
            size="md"
            className="ring-2 ring-white/35"
          />
        </div>

        {/* Bottom - Service info */}
        <div className="space-y-3">
          <div>
            <h3 className="text-xl font-normal text-white leading-tight">
              {service}
            </h3>
            <p className="text-white/60 text-sm font-light mt-1">
              w/ {customer}
            </p>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-white/50 text-xs">{date}</p>
              <p className="text-white text-lg font-normal">{time}</p>
            </div>

            {/* CTA Arrow */}
            <div
              className={cn(
                "p-3 rounded-full transition-all",
                status === "upcoming"
                  ? "bg-white/20 group-hover:bg-white"
                  : "bg-white/10"
              )}
            >
              <ArrowUpRight className={cn(
                "w-4 h-4 transition-colors",
                status === "upcoming"
                  ? "text-white/80 group-hover:text-[var(--color-accent-primary)]"
                  : "text-white/50"
              )} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hero variant for the "Create Booking" CTA
interface HeroBookingCardProps {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  onClick?: () => void;
  className?: string;
}

export function HeroBookingCard({
  title,
  subtitle,
  imageUrl,
  onClick,
  className,
}: HeroBookingCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative w-full rounded-[var(--radius-2xl)] overflow-hidden cursor-pointer shadow-[var(--shadow-md)]",
        "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)] active:scale-[0.99]",
        "h-[360px] md:h-[420px]",
        "flex",
        className
      )}
    >
      {/* Left 50% - Clear image */}
      <div className="relative w-1/2 h-full">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#173B3D] via-[#2D6668] to-[#0F292A]" />
        )}
      </div>

      {/* Right 50% - Blurred image background (same image, heavily blurred) */}
      <div className="relative w-1/2 h-full overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover blur-3xl scale-150"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#173B3D] via-[#2D6668] to-[#0F292A]" />
        )}
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-[#173B3D]/45" />

        {/* Content */}
        <div className="relative h-full flex flex-col justify-between p-6 md:p-8">
          {/* Top left - Title */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/45 mb-4">
              Fast intake
            </p>
            <h2 className="font-normal leading-[0.98]" style={{ fontSize: '48px', color: '#FFFFFF' }}>
              {title}
            </h2>
            {subtitle && <p className="text-white/60 text-xl mt-3">{subtitle}</p>}
          </div>

          {/* Bottom right - CTA Button */}
          <div className="flex justify-end">
            <div className="flex items-center gap-3 px-8 py-4 rounded-full border border-white/30 group-hover:bg-white group-hover:border-white transition-all">
              <span className="text-white text-lg font-medium group-hover:text-[var(--color-accent-primary)] transition-colors">Book</span>
              <ArrowUpRight className="w-5 h-5 text-white group-hover:text-[var(--color-accent-primary)] transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
