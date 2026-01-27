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
      "from-amber-900/80 via-orange-900/60 to-black",
      "from-rose-900/70 via-red-950/50 to-black",
      "from-orange-900/70 via-amber-950/50 to-black",
      "from-yellow-900/60 via-orange-950/40 to-black",
      "from-red-900/60 via-rose-950/40 to-black",
    ];
    const index = name.length % gradients.length;
    return gradients[index];
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative w-full rounded-2xl overflow-hidden cursor-pointer",
        "transition-all duration-300",
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
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
            className="p-2.5 rounded-full bg-black/30 hover:bg-white hover:text-black transition-all group/share"
            aria-label="Share"
          >
            <Share2 className="w-4 h-4 text-white/80 group-hover/share:text-black" />
          </button>
          <Avatar
            name={customer}
            src={customerAvatar}
            size="md"
            className="ring-2 ring-white/20"
          />
        </div>

        {/* Bottom - Service info */}
        <div className="space-y-3">
          <div>
            <h3 className="text-xl font-light text-white leading-tight">
              {service}
            </h3>
            <p className="text-white/60 text-sm font-light mt-1">
              w/ {customer}
            </p>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-white/50 text-xs">{date}</p>
              <p className="text-white text-lg font-light">{time}</p>
            </div>

            {/* CTA Arrow */}
            <div
              className={cn(
                "p-3 rounded-full transition-all",
                status === "upcoming"
                  ? "bg-black/30 group-hover:bg-white"
                  : "bg-black/20"
              )}
            >
              <ArrowUpRight className={cn(
                "w-4 h-4 transition-colors",
                status === "upcoming"
                  ? "text-white/80 group-hover:text-black"
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
        "group relative w-full rounded-2xl overflow-hidden cursor-pointer",
        "transition-all duration-300",
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
          <div className="w-full h-full bg-gradient-to-br from-amber-900/50 via-orange-950/30 to-black" />
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
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900/50 via-orange-950/30 to-black" />
        )}
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Content */}
        <div className="relative h-full flex flex-col justify-between p-6 md:p-8">
          {/* Top left - Title */}
          <div>
            <h2 className="font-extrabold text-white" style={{ fontSize: '48px' }}>
              {title}
            </h2>
            {subtitle && <p className="text-white/50 text-xl font-light mt-3">{subtitle}</p>}
          </div>

          {/* Bottom right - CTA Button */}
          <div className="flex justify-end">
            <div className="flex items-center gap-3 px-8 py-4 rounded-full border border-white/30 group-hover:bg-white group-hover:border-white transition-all">
              <span className="text-white text-lg font-medium group-hover:text-black transition-colors">Book</span>
              <ArrowUpRight className="w-5 h-5 text-white group-hover:text-black transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
