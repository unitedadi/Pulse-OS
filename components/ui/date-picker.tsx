"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

export interface DatePickerProps {
  label?: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function DatePicker({
  label,
  value,
  onChange,
  minDate,
  maxDate,
  error,
  placeholder = "Select date",
  disabled = false,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [viewDate, setViewDate] = React.useState(value || new Date());
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Close on outside click
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get calendar days for current view month
  const getCalendarDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days: (Date | null)[] = [];

    // Add padding for days before first of month
    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }

    // Add actual days
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const isDateDisabled = (date: Date) => {
    if (minDate && date < new Date(minDate.setHours(0, 0, 0, 0))) return true;
    if (maxDate && date > new Date(maxDate.setHours(23, 59, 59, 999))) return true;
    return false;
  };

  const isDateSelected = (date: Date) => {
    if (!value) return false;
    return (
      date.getDate() === value.getDate() &&
      date.getMonth() === value.getMonth() &&
      date.getFullYear() === value.getFullYear()
    );
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setViewDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleSelect = (date: Date) => {
    onChange(date);
    setIsOpen(false);
  };

  const formatDisplayValue = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const days = getCalendarDays();

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label className="block text-xs text-[#666666] uppercase tracking-wider mb-2">
          {label}
        </label>
      )}

      {/* Input Trigger */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 rounded-xl",
          "bg-[#111111] border border-[#1F1F1F] text-left",
          "transition-colors",
          isOpen && "border-[#E07A3C]",
          !isOpen && "hover:border-[#2A2A2A]",
          disabled && "opacity-50 cursor-not-allowed",
          error && "border-[#F87171]"
        )}
      >
        <Calendar className="h-5 w-5 text-[#666666]" />
        <span className={cn(
          "flex-1 font-light",
          value ? "text-white" : "text-[#666666]"
        )}>
          {value ? formatDisplayValue(value) : placeholder}
        </span>
      </button>

      {error && (
        <p className="mt-1.5 text-sm text-[#F87171]">{error}</p>
      )}

      {/* Calendar Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 p-4 rounded-2xl bg-[#111111] border border-[#1F1F1F] shadow-xl z-50 w-80">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => navigateMonth("prev")}
              className="p-2 rounded-lg text-[#666666] hover:text-white hover:bg-[#1A1A1A] transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-white font-light">
              {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
            </span>
            <button
              type="button"
              onClick={() => navigateMonth("next")}
              className="p-2 rounded-lg text-[#666666] hover:text-white hover:bg-[#1A1A1A] transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map((day) => (
              <div
                key={day}
                className="text-center text-xs text-[#666666] py-2 font-medium"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const isDisabled = isDateDisabled(date);
              const isSelected = isDateSelected(date);
              const isTodayDate = isToday(date);

              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  onClick={() => !isDisabled && handleSelect(date)}
                  disabled={isDisabled}
                  className={cn(
                    "aspect-square rounded-lg flex items-center justify-center text-sm transition-all",
                    isDisabled && "text-[#444444] cursor-not-allowed",
                    !isDisabled && !isSelected && "text-[#A0A0A0] hover:bg-[#1A1A1A] hover:text-white",
                    isSelected && "bg-[#E07A3C] text-white",
                    isTodayDate && !isSelected && "ring-1 ring-[#E07A3C]/50"
                  )}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 mt-4 pt-4 border-t border-[#1F1F1F]">
            <button
              type="button"
              onClick={() => handleSelect(new Date())}
              className="flex-1 px-3 py-2 rounded-lg text-sm text-[#A0A0A0] hover:text-white hover:bg-[#1A1A1A] transition-colors"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                handleSelect(tomorrow);
              }}
              className="flex-1 px-3 py-2 rounded-lg text-sm text-[#A0A0A0] hover:text-white hover:bg-[#1A1A1A] transition-colors"
            >
              Tomorrow
            </button>
            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange(null);
                  setIsOpen(false);
                }}
                className="px-3 py-2 rounded-lg text-sm text-[#F87171] hover:bg-[#F87171]/10 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
