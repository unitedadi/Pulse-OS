"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Clock, Sun, Sunset, Moon } from "lucide-react";

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

export interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedSlotId?: string;
  onSelect?: (slot: TimeSlot) => void;
  className?: string;
}

// Helper to categorize slots by time of day
function categorizeSlots(slots: TimeSlot[]) {
  const morning: TimeSlot[] = [];
  const afternoon: TimeSlot[] = [];
  const evening: TimeSlot[] = [];

  slots.forEach((slot) => {
    const hour = parseInt(slot.time.split(":")[0], 10);
    if (hour < 12) {
      morning.push(slot);
    } else if (hour < 17) {
      afternoon.push(slot);
    } else {
      evening.push(slot);
    }
  });

  return { morning, afternoon, evening };
}

export function TimeSlotPicker({
  slots,
  selectedSlotId,
  onSelect,
  className,
}: TimeSlotPickerProps) {
  const { morning, afternoon, evening } = categorizeSlots(slots);

  const TimeSlotButton = ({ slot }: { slot: TimeSlot }) => (
    <button
      onClick={() => slot.available && onSelect?.(slot)}
      disabled={!slot.available}
      className={cn(
        "px-4 py-3 rounded-xl text-sm font-light transition-all",
        slot.available
          ? selectedSlotId === slot.id
            ? "bg-white text-[#0A0A0A]"
            : "bg-[#1A1A1A] text-white border border-[#2A2A2A] hover:border-[#3A3A3A]"
          : "bg-[#111111] text-[#444444] cursor-not-allowed"
      )}
    >
      {slot.time}
    </button>
  );

  const SlotGroup = ({
    title,
    icon,
    slots,
  }: {
    title: string;
    icon: React.ReactNode;
    slots: TimeSlot[];
  }) => {
    if (slots.length === 0) return null;

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-[#666666]">
          {icon}
          <span className="text-sm">{title}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {slots.map((slot) => (
            <TimeSlotButton key={slot.id} slot={slot} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={cn("space-y-6", className)}>
      <SlotGroup
        title="Morning"
        icon={<Sun className="h-4 w-4" />}
        slots={morning}
      />
      <SlotGroup
        title="Afternoon"
        icon={<Sunset className="h-4 w-4" />}
        slots={afternoon}
      />
      <SlotGroup
        title="Evening"
        icon={<Moon className="h-4 w-4" />}
        slots={evening}
      />

      {slots.length === 0 && (
        <div className="text-center py-8">
          <Clock className="h-10 w-10 text-[#444444] mx-auto mb-3" />
          <p className="text-[#666666]">No available time slots</p>
        </div>
      )}
    </div>
  );
}

// Compact variant for showing in a row
export interface CompactTimeSlotPickerProps {
  slots: TimeSlot[];
  selectedSlotId?: string;
  onSelect?: (slot: TimeSlot) => void;
  className?: string;
}

export function CompactTimeSlotPicker({
  slots,
  selectedSlotId,
  onSelect,
  className,
}: CompactTimeSlotPickerProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {slots.map((slot) => (
        <button
          key={slot.id}
          onClick={() => slot.available && onSelect?.(slot)}
          disabled={!slot.available}
          className={cn(
            "px-4 py-2.5 rounded-full text-sm font-light transition-all",
            slot.available
              ? selectedSlotId === slot.id
                ? "bg-white text-[#0A0A0A]"
                : "bg-[#1A1A1A] text-white border border-[#2A2A2A] hover:border-[#3A3A3A]"
              : "bg-[#111111] text-[#444444] cursor-not-allowed line-through"
          )}
        >
          {slot.time}
        </button>
      ))}
    </div>
  );
}
