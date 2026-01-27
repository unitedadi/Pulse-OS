"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { Avatar, StatusBadge, ConfirmDialog } from "@/components/ui";
import { useImmersiveMode } from "@/components/layouts";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Clock,
  ArrowUpRight,
  X,
  Share2,
  Copy,
  Check,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock booking data - in real app this would come from API
const MOCK_BOOKING = {
  id: "BK-001",
  customer: {
    name: "Sarah Chen",
    phone: "+971 50 123 4567",
    email: "sarah.chen@email.com",
    avatar: undefined,
  },
  product: {
    name: "IV Therapy",
    category: "Wellness",
    description:
      "Vitamin-infused IV drip therapy for hydration and wellness boost.",
    duration: "45-60 min",
    image: "/services/skin-therapy.png",
  },
  provider: {
    name: "Nurse Fatima",
    role: "Registered Nurse",
    avatar: undefined,
  },
  scheduledDate: new Date(2025, 0, 28, 10, 0),
  location: {
    type: "home",
    address: "Marina Residence Tower A, Apt 2301",
    area: "Dubai Marina",
    city: "Dubai",
  },
  status: "upcoming" as "upcoming" | "pending_payment" | "completed" | "cancelled",
  amount: 450,
  currency: "AED",
  commission: {
    rate: 0.25,
    amount: 112,
    status: "pending" as const,
  },
  paymentLink: {
    url: "https://pay.dardoc.com/BK-001-XYZ123",
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    status: "active" as const,
  },
  createdAt: new Date(2025, 0, 24, 14, 30),
  createdBy: "Ahmed (Staff)",
};

// Service-based gradient backgrounds
const getServiceGradient = (service: string) => {
  const gradients: Record<string, string> = {
    "IV Therapy": "from-amber-900/60 via-orange-950/40 to-black",
    "Vitamin Infusion": "from-emerald-900/60 via-teal-950/40 to-black",
    "Blood Test": "from-rose-900/60 via-red-950/40 to-black",
    "NAD+ Therapy": "from-violet-900/60 via-purple-950/40 to-black",
    "Hydration Boost": "from-sky-900/60 via-blue-950/40 to-black",
    "Glutathione IV": "from-pink-900/60 via-fuchsia-950/40 to-black",
    "Immunity Drip": "from-lime-900/60 via-green-950/40 to-black",
    "Energy Boost": "from-yellow-900/60 via-amber-950/40 to-black",
  };
  return gradients[service] || "from-amber-900/60 via-orange-950/40 to-black";
};

export default function BookingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;

  // Enable immersive mode - hides header, removes padding
  useImmersiveMode();

  const [showCancelDialog, setShowCancelDialog] = React.useState(false);
  const [cancelling, setCancelling] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  // In real app, fetch booking by ID
  const booking = MOCK_BOOKING;

  const handleCancel = async () => {
    setCancelling(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setCancelling(false);
    setShowCancelDialog(false);
    router.push("/bookings");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(booking.paymentLink.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="h-screen overflow-hidden">
      {/* Split Layout Container */}
      <div className="flex flex-col lg:flex-row h-screen">
        {/* Left Side - Hero Image */}
        <div className="relative w-full lg:w-1/2 h-[200px] lg:h-full flex-shrink-0">
          {/* Background Image or Gradient */}
          {booking.product.image ? (
            <img
              src={booking.product.image}
              alt={booking.product.name}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : null}
          {/* Gradient overlay - always visible */}
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br",
              getServiceGradient(booking.product.name)
            )}
          />

          {/* Back Button */}
          <div className="absolute top-6 left-6 z-10">
            <button
              onClick={() => router.back()}
              className="p-3 rounded-full bg-black/30 backdrop-blur-sm text-white/80 hover:bg-white hover:text-black transition-all"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          </div>

          {/* Service Title Overlay - Bottom Left */}
          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10">
            <p className="text-white/60 text-xs uppercase tracking-widest mb-2">
              {booking.product.category}
            </p>
            <h1
              className="font-extrabold text-white leading-none"
              style={{ fontSize: "clamp(32px, 6vw, 56px)" }}
            >
              {booking.product.name}
            </h1>
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="flex-1 bg-[#0A0A0A] px-6 lg:px-10 py-6 lg:py-8 flex flex-col overflow-y-auto lg:overflow-hidden">
          {/* Top Row: Status + Date/Time */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <StatusBadge status={booking.status} />
              <p className="text-white text-2xl font-light mt-3">
                {formatDate(booking.scheduledDate)}
              </p>
              <div className="flex items-center gap-2 mt-1 text-[#666666]">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-light">
                  {formatTime(booking.scheduledDate)} · {booking.product.duration}
                </span>
              </div>
            </div>
            {/* Payment - Top Right */}
            <div className="text-right">
              <p className="text-[#555555] text-xs uppercase tracking-widest mb-1">
                Total
              </p>
              <div className="flex items-baseline gap-1 justify-end">
                <span className="text-[#666666]">{booking.currency}</span>
                <span className="text-3xl font-extralight text-white tabular-nums">
                  {booking.amount}
                </span>
              </div>
              <p className="text-[#E07A3C] text-sm mt-1">
                +{booking.currency} {booking.commission.amount} commission
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-[#666666] font-light text-sm mb-6">
            {booking.product.description}
          </p>

          {/* Divider */}
          <div className="h-px bg-[#1A1A1A] mb-6" />

          {/* Customer + Location Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Customer */}
            <div>
              <p className="text-[#555555] text-xs uppercase tracking-widest mb-3">
                Customer
              </p>
              <div className="flex items-center gap-3">
                <Avatar name={booking.customer.name} size="md" />
                <div>
                  <p className="text-white font-light">{booking.customer.name}</p>
                  <div className="flex items-center gap-1.5 text-[#666666]">
                    <Phone className="h-3 w-3" />
                    <span className="text-sm font-light">{booking.customer.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <p className="text-[#555555] text-xs uppercase tracking-widest mb-3">
                {booking.location.type === "home" ? "Home Visit" : "Location"}
              </p>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[#666666] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white font-light text-sm">{booking.location.address}</p>
                  <p className="text-[#666666] text-sm font-light">
                    {booking.location.area}, {booking.location.city}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Provider (if assigned) */}
          {booking.provider && (
            <div className="mb-6">
              <p className="text-[#555555] text-xs uppercase tracking-widest mb-3">
                Provider
              </p>
              <div className="flex items-center gap-3">
                <Avatar name={booking.provider.name} size="sm" />
                <div>
                  <p className="text-white font-light text-sm">{booking.provider.name}</p>
                  <p className="text-[#666666] text-xs">{booking.provider.role}</p>
                </div>
              </div>
            </div>
          )}

          {/* Spacer to push buttons to bottom */}
          <div className="flex-1 min-h-4" />

          {/* Action Buttons - Fixed at bottom */}
          <div className="space-y-3 pt-4">
            {/* Primary CTA */}
            {booking.status === "pending_payment" && (
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-full bg-white text-black font-medium hover:bg-white/90 transition-all"
              >
                {copied ? (
                  <>
                    <Check className="h-5 w-5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-5 w-5" />
                    <span>Copy Payment Link</span>
                  </>
                )}
              </button>
            )}

            {booking.status === "upcoming" && (
              <button className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-full bg-white text-black font-medium hover:bg-white/90 transition-all">
                <span>View on Map</span>
                <ArrowUpRight className="h-5 w-5" />
              </button>
            )}

            {/* Secondary Actions */}
            <div className="flex gap-3">
              {(booking.status === "pending_payment" ||
                booking.status === "upcoming") && (
                <button
                  onClick={() => router.push(`/bookings/new?edit=${booking.id}`)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-[#2A2A2A] text-white/80 hover:border-white/40 hover:text-white transition-all text-sm"
                >
                  <Pencil className="h-4 w-4" />
                  <span>Edit</span>
                </button>
              )}

              <button
                onClick={() => {}}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-[#2A2A2A] text-white/80 hover:border-white/40 hover:text-white transition-all text-sm"
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </button>

              {(booking.status === "pending_payment" ||
                booking.status === "upcoming") && (
                <button
                  onClick={() => setShowCancelDialog(true)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-[#2A2A2A] text-[#F87171] hover:border-[#F87171]/40 hover:bg-[#F87171]/10 transition-all text-sm"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Dialog */}
      <ConfirmDialog
        open={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={handleCancel}
        title="Cancel booking?"
        description={
          booking.status === "pending_payment"
            ? "This booking hasn't been paid yet. You can cancel it without any charges."
            : "This will cancel the booking and initiate a refund to the customer. Commission will be clawed back."
        }
        confirmLabel="Yes, Cancel Booking"
        cancelLabel="Keep Booking"
        variant="destructive"
        loading={cancelling}
      />
    </div>
  );
}
