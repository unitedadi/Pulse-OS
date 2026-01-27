"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  EmptyState,
  StatusBadge,
  Avatar,
} from "@/components/ui";
import { Plus, Clock, Search, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Status filter tabs
const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "upcoming", label: "Upcoming" },
  { value: "pending_payment", label: "Pending" },
  { value: "completed", label: "Completed" },
];

// Date filter presets
const DATE_FILTERS = [
  { value: "all", label: "Any time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
];

// Mock bookings data with images
const MOCK_BOOKINGS = [
  {
    id: "BK-001",
    customer: { name: "Sarah Chen", phone: "+971 50 123 4567" },
    product: { name: "IV Therapy", category: "Wellness", image: "/services/skin-therapy.png" },
    scheduledDate: new Date(2025, 0, 28, 10, 0),
    location: "Dubai Marina",
    status: "upcoming" as const,
    amount: 450,
    commission: 112,
  },
  {
    id: "BK-002",
    customer: { name: "Mohammed Al-Hassan", phone: "+971 55 234 5678" },
    product: { name: "Vitamin Infusion", category: "Wellness", image: "/services/skin-therapy.png" },
    scheduledDate: new Date(2025, 0, 28, 14, 0),
    location: "JBR",
    status: "pending_payment" as const,
    amount: 350,
    commission: 87,
  },
  {
    id: "BK-003",
    customer: { name: "Emma Wilson", phone: "+971 52 345 6789" },
    product: { name: "Blood Test", category: "Diagnostics", image: "/services/skin-therapy.png" },
    scheduledDate: new Date(2025, 0, 27, 16, 30),
    location: "Downtown Dubai",
    status: "upcoming" as const,
    amount: 200,
    commission: 50,
  },
  {
    id: "BK-004",
    customer: { name: "Ahmed Khalid", phone: "+971 50 456 7890" },
    product: { name: "Health Checkup", category: "Checkup", image: "/services/skin-therapy.png" },
    scheduledDate: new Date(2025, 0, 24, 9, 0),
    location: "Palm Jumeirah",
    status: "completed" as const,
    amount: 600,
    commission: 150,
  },
  {
    id: "BK-005",
    customer: { name: "Lisa Park", phone: "+971 56 567 8901" },
    product: { name: "IV Therapy", category: "Wellness", image: "/services/skin-therapy.png" },
    scheduledDate: new Date(2025, 0, 23, 11, 0),
    location: "Business Bay",
    status: "completed" as const,
    amount: 450,
    commission: 112,
  },
  {
    id: "BK-006",
    customer: { name: "Omar Farouk", phone: "+971 54 678 9012" },
    product: { name: "Vaccination", category: "Preventive", image: "/services/skin-therapy.png" },
    scheduledDate: new Date(2025, 0, 22, 15, 0),
    location: "Al Barsha",
    status: "completed" as const,
    amount: 150,
    commission: 37,
  },
];

// Service-based gradient backgrounds
const getServiceGradient = (service: string) => {
  const gradients: Record<string, string> = {
    "IV Therapy": "from-amber-900/80 via-orange-950/60 to-black",
    "Vitamin Infusion": "from-emerald-900/80 via-teal-950/60 to-black",
    "Blood Test": "from-rose-900/80 via-red-950/60 to-black",
    "Health Checkup": "from-sky-900/80 via-blue-950/60 to-black",
    "Vaccination": "from-violet-900/80 via-purple-950/60 to-black",
  };
  return gradients[service] || "from-amber-900/80 via-orange-950/60 to-black";
};

// Date filtering helpers
function isToday(date: Date) {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

function isThisWeek(date: Date) {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  return date >= startOfWeek && date < endOfWeek;
}

function isThisMonth(date: Date) {
  const today = new Date();
  return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
}

// Format date for display
function formatDate(date: Date) {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return "Tomorrow";
  } else {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function BookingsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [dateFilter, setDateFilter] = React.useState("all");

  // Filter bookings
  const filteredBookings = MOCK_BOOKINGS.filter((booking) => {
    // Status filter
    if (statusFilter !== "all" && booking.status !== statusFilter) {
      return false;
    }

    // Date filter
    if (dateFilter === "today" && !isToday(booking.scheduledDate)) {
      return false;
    }
    if (dateFilter === "week" && !isThisWeek(booking.scheduledDate)) {
      return false;
    }
    if (dateFilter === "month" && !isThisMonth(booking.scheduledDate)) {
      return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        booking.customer.name.toLowerCase().includes(query) ||
        booking.customer.phone.includes(query) ||
        booking.id.toLowerCase().includes(query) ||
        booking.product.name.toLowerCase().includes(query) ||
        booking.location.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const hasActiveFilters = searchQuery || statusFilter !== "all" || dateFilter !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setDateFilter("all");
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-end">
        <Link href="/bookings/new">
          <Button leftIcon={<Plus className="h-4 w-4" />}>
            New Booking
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555555]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search customers, services, locations..."
          className="w-full pl-11 pr-10 py-3 bg-transparent border border-[#2A2A2A] rounded-full text-white placeholder:text-[#555555] transition-colors text-sm font-light focus:border-[#E07A3C]/50"
          style={{ outline: 'none', boxShadow: 'none' }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#555555] hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-light transition-all",
                statusFilter === filter.value
                  ? "bg-white text-[#0A0A0A]"
                  : "text-[#555555] hover:text-white"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-6 bg-[#2A2A2A]" />

        {/* Date Filter Tabs */}
        <div className="flex items-center gap-1">
          {DATE_FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setDateFilter(filter.value)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-light transition-all",
                dateFilter === filter.value
                  ? "bg-[#2A2A2A] text-white"
                  : "text-[#555555] hover:text-white"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filters Indicator */}
      {hasActiveFilters && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#555555]">
            {filteredBookings.length} result{filteredBookings.length !== 1 ? "s" : ""}
          </span>
          <button
            onClick={clearFilters}
            className="text-sm text-[#E07A3C] hover:text-[#F5A66A] transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Bookings Grid */}
      {filteredBookings.length === 0 ? (
        <div className="py-20">
          <EmptyState
            title="No bookings found"
            description={hasActiveFilters ? "Try adjusting your search or filters" : "Create your first booking to get started"}
            action={{
              label: hasActiveFilters ? "Clear Filters" : "Create Booking",
              onClick: hasActiveFilters ? clearFilters : () => router.push("/bookings/new"),
            }}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBookings.map((booking) => (
            <Link
              key={booking.id}
              href={`/bookings/${booking.id}`}
              className="group block"
            >
              <div className="relative rounded-2xl overflow-hidden h-[200px]">
                {/* Background Image */}
                {booking.product.image && (
                  <img
                    src={booking.product.image}
                    alt={booking.product.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                {/* Gradient Overlay */}
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br",
                    getServiceGradient(booking.product.name)
                  )}
                />

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  {/* Top Row */}
                  <div className="flex items-start justify-between">
                    <StatusBadge status={booking.status} />
                    <span className="text-white/50 text-xs font-mono">{booking.id}</span>
                  </div>

                  {/* Bottom Row */}
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-widest mb-1">
                      {booking.product.category}
                    </p>
                    <h3 className="text-2xl font-extralight text-white mb-3">
                      {booking.product.name}
                    </h3>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar name={booking.customer.name} size="sm" />
                        <div>
                          <p className="text-white text-sm font-light">{booking.customer.name}</p>
                          <div className="flex items-center gap-1.5 text-white/50 text-xs">
                            <Clock className="h-3 w-3" />
                            <span>{formatDate(booking.scheduledDate)} · {formatTime(booking.scheduledDate)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-white font-light">
                          <span className="text-white/50 text-xs">AED </span>
                          {booking.amount}
                        </p>
                        {booking.commission > 0 && (
                          <p className="text-[#E07A3C] text-xs">
                            +{booking.commission}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
