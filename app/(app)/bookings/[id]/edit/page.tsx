"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Card,
  Button,
  DatePicker,
  TimeSlotPicker,
} from "@/components/ui";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Loader2,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { TimeSlot } from "@/components/ui/time-slot-picker";

// Mock booking data
const MOCK_BOOKING = {
  id: "BK-001",
  customer: {
    name: "Sarah Chen",
    phone: "+971 50 123 4567",
  },
  product: {
    name: "IV Therapy",
    category: "Wellness",
  },
  scheduledDate: new Date(2025, 0, 26),
  scheduledTime: "10:00",
  location: {
    type: "home" as const,
    address: "Marina Residence Tower A, Apt 2301",
    area: "Dubai Marina",
    city: "Dubai",
  },
  status: "pending_payment",
};

// Mock time slots
const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  for (let hour = 8; hour <= 20; hour++) {
    slots.push({
      id: `${hour}:00`,
      time: `${hour.toString().padStart(2, "0")}:00`,
      available: Math.random() > 0.3,
    });
    if (hour < 20) {
      slots.push({
        id: `${hour}:30`,
        time: `${hour.toString().padStart(2, "0")}:30`,
        available: Math.random() > 0.3,
      });
    }
  }
  return slots;
};

export default function EditBookingPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;

  // Form state
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(
    MOCK_BOOKING.scheduledDate
  );
  const [selectedTime, setSelectedTime] = React.useState<string | null>(
    MOCK_BOOKING.scheduledTime
  );
  const [locationType, setLocationType] = React.useState<"partner" | "home">(
    MOCK_BOOKING.location.type === "home" ? "home" : "partner"
  );

  // Loading states
  const [loadingSlots, setLoadingSlots] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [timeSlots, setTimeSlots] = React.useState<TimeSlot[]>([]);

  // Load time slots when date changes
  React.useEffect(() => {
    if (selectedDate) {
      setLoadingSlots(true);
      // Simulate API call
      setTimeout(() => {
        setTimeSlots(generateTimeSlots());
        setLoadingSlots(false);
      }, 800);
    }
  }, [selectedDate]);

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSaving(false);
    router.push(`/bookings/${bookingId}`);
  };

  const booking = MOCK_BOOKING;
  const hasChanges =
    selectedDate?.getTime() !== booking.scheduledDate.getTime() ||
    selectedTime !== booking.scheduledTime ||
    (locationType === "home") !== (booking.location.type === "home");

  return (
    <div className="max-w-2xl mx-auto pb-20">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#666666] hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm">Back to Booking</span>
        </button>

        <h1 className="text-3xl font-extralight text-white tracking-tight">
          Reschedule Booking
        </h1>
        <p className="text-[#666666] mt-2 font-light">
          {booking.product.name} for {booking.customer.name}
        </p>
      </div>

      {/* Current Booking Info */}
      <Card padding="lg" className="bg-[#111111] border-[#1F1F1F] mb-6">
        <h3 className="text-xs text-[#666666] uppercase tracking-wider mb-4">
          Current Schedule
        </h3>

        <div className="flex items-center gap-6 text-[#A0A0A0]">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#666666]" />
            <span>
              {booking.scheduledDate.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#666666]" />
            <span>
              {parseInt(booking.scheduledTime.split(":")[0], 10) % 12 || 12}:
              {booking.scheduledTime.split(":")[1]}{" "}
              {parseInt(booking.scheduledTime.split(":")[0], 10) >= 12 ? "PM" : "AM"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#666666]" />
            <span>{booking.location.area}</span>
          </div>
        </div>
      </Card>

      {/* Edit Form */}
      <div className="space-y-6">
        {/* Date Selection */}
        <Card padding="lg" className="bg-[#111111] border-[#1F1F1F]">
          <DatePicker
            label="New Date"
            value={selectedDate}
            onChange={(date) => {
              setSelectedDate(date);
              setSelectedTime(null); // Reset time when date changes
            }}
            minDate={new Date()}
          />
        </Card>

        {/* Time Selection */}
        {selectedDate && (
          <Card padding="lg" className="bg-[#111111] border-[#1F1F1F]">
            <h3 className="text-xs text-[#666666] uppercase tracking-wider mb-4">
              Available Times
            </h3>

            {loadingSlots ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 text-[#E07A3C] animate-spin" />
                <span className="ml-3 text-[#666666]">Loading available slots...</span>
              </div>
            ) : (
              <TimeSlotPicker
                slots={timeSlots}
                selectedSlotId={selectedTime || undefined}
                onSelect={(slot) => setSelectedTime(slot.time)}
              />
            )}
          </Card>
        )}

        {/* Location Type */}
        <Card padding="lg" className="bg-[#111111] border-[#1F1F1F]">
          <h3 className="text-xs text-[#666666] uppercase tracking-wider mb-4">
            Service Location
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setLocationType("partner")}
              className={cn(
                "p-4 rounded-xl border text-left transition-all",
                locationType === "partner"
                  ? "bg-[#E07A3C]/10 border-[#E07A3C]/30"
                  : "bg-[#0A0A0A] border-[#1F1F1F] hover:border-[#2A2A2A]"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <MapPin
                  className={cn(
                    "h-5 w-5",
                    locationType === "partner" ? "text-[#E07A3C]" : "text-[#666666]"
                  )}
                />
                {locationType === "partner" && (
                  <Check className="h-4 w-4 text-[#E07A3C]" />
                )}
              </div>
              <p className="text-white font-light">Clinic Visit</p>
              <p className="text-xs text-[#666666] mt-1">
                Visit our partner location
              </p>
            </button>

            <button
              onClick={() => setLocationType("home")}
              className={cn(
                "p-4 rounded-xl border text-left transition-all",
                locationType === "home"
                  ? "bg-[#E07A3C]/10 border-[#E07A3C]/30"
                  : "bg-[#0A0A0A] border-[#1F1F1F] hover:border-[#2A2A2A]"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <MapPin
                  className={cn(
                    "h-5 w-5",
                    locationType === "home" ? "text-[#E07A3C]" : "text-[#666666]"
                  )}
                />
                {locationType === "home" && (
                  <Check className="h-4 w-4 text-[#E07A3C]" />
                )}
              </div>
              <p className="text-white font-light">Home Visit</p>
              <p className="text-xs text-[#666666] mt-1">
                Nurse visits customer's address
              </p>
            </button>
          </div>

          {locationType === "home" && (
            <div className="mt-4 p-4 rounded-xl bg-[#0A0A0A] border border-[#1F1F1F]">
              <p className="text-xs text-[#666666] uppercase tracking-wider mb-2">
                Customer Address
              </p>
              <p className="text-white font-light">{booking.location.address}</p>
              <p className="text-sm text-[#666666]">
                {booking.location.area}, {booking.location.city}
              </p>
            </div>
          )}
        </Card>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="ghost"
            className="flex-1"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            variant="accent"
            className="flex-1"
            onClick={handleSave}
            disabled={!selectedDate || !selectedTime || saving || !hasChanges}
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>

        {/* Note about payment link */}
        {booking.status === "pending_payment" && hasChanges && (
          <p className="text-xs text-center text-[#666666]">
            The payment link will be updated to reflect the new schedule.
          </p>
        )}
      </div>
    </div>
  );
}
