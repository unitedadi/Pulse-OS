"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DateSelectorProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  className?: string;
}

const VISIBLE_DAYS = 7;

export function DateSelector({
  selectedDate,
  onDateSelect,
  className,
}: DateSelectorProps) {
  const [startIndex, setStartIndex] = React.useState(0);

  // Generate 14 days starting from today
  const allDates = React.useMemo(() => {
    const result: Date[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      result.push(date);
    }
    return result;
  }, []);

  // Get only the visible dates
  const visibleDates = allDates.slice(startIndex, startIndex + VISIBLE_DAYS);

  const formatDayAbbrev = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "short" }).charAt(0);
  };

  const formatDayNum = (date: Date) => {
    return date.getDate();
  };

  const isSameDay = (a: Date, b: Date) => {
    return (
      a.getDate() === b.getDate() &&
      a.getMonth() === b.getMonth() &&
      a.getFullYear() === b.getFullYear()
    );
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return isSameDay(date, today);
  };

  const canScrollLeft = startIndex > 0;
  const canScrollRight = startIndex < allDates.length - VISIBLE_DAYS;

  const scrollLeft = () => {
    if (canScrollLeft) {
      setStartIndex((prev) => Math.max(0, prev - VISIBLE_DAYS));
    }
  };

  const scrollRight = () => {
    if (canScrollRight) {
      setStartIndex((prev) => Math.min(allDates.length - VISIBLE_DAYS, prev + VISIBLE_DAYS));
    }
  };

  return (
    <div className={cn("flex items-center justify-center gap-3", className)}>
      {/* Left arrow - only visible when can scroll back */}
      <div className="w-8 h-8">
        {canScrollLeft && (
          <button
            type="button"
            onClick={scrollLeft}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 text-white/70 hover:text-black hover:bg-white cursor-pointer"
            aria-label="Previous week"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Date container - shows exactly 7 days */}
      <div className="flex gap-4">
        {visibleDates.map((date) => {
          const selected = isSameDay(date, selectedDate);
          const today = isToday(date);

          return (
            <button
              type="button"
              key={date.toISOString()}
              onClick={() => onDateSelect(date)}
              className="w-16 flex flex-col items-center justify-center py-3 transition-all duration-200"
            >
              <div className="flex flex-col items-center justify-center pb-2">
                {/* Weekday letter */}
                <span
                  className={cn(
                    "text-xs font-normal tracking-wide transition-colors duration-200",
                    selected
                      ? "text-white"
                      : today
                        ? "text-[#E07A3C]"
                        : "text-[#555555]"
                  )}
                >
                  {formatDayAbbrev(date)}
                </span>

                {/* Day number */}
                <span
                  className={cn(
                    "text-xl font-light mt-0.5 transition-colors duration-200 tabular-nums",
                    selected
                      ? "text-white"
                      : today
                        ? "text-[#E07A3C]"
                        : "text-[#888888] hover:text-white"
                  )}
                >
                  {formatDayNum(date)}
                </span>
              </div>

              {/* Selection indicator */}
              <div
                className={cn(
                  "h-0.5 w-5 rounded-full transition-all duration-200",
                  selected ? "bg-white" : "bg-transparent"
                )}
              />
            </button>
          );
        })}
      </div>

      {/* Right arrow */}
      <button
        type="button"
        onClick={scrollRight}
        disabled={!canScrollRight}
        className={cn(
          "w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200",
          canScrollRight
            ? "text-white/70 hover:text-black hover:bg-white cursor-pointer"
            : "text-[#333333] cursor-not-allowed"
        )}
        aria-label="Next week"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
