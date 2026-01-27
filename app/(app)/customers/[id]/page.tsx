"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { Button, Avatar, StatusBadge } from "@/components/ui";
import {
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock customer data
const MOCK_CUSTOMER = {
  id: "1",
  firstName: "Sarah",
  lastName: "Chen",
  phone: "+971 50 123 4567",
  email: "sarah.chen@email.com",
  addresses: [
    {
      label: "Home",
      address: "Marina Residence Tower A, Apt 2301",
      area: "Dubai Marina",
      city: "Dubai",
    },
    {
      label: "Office",
      address: "Emirates Towers, Level 15",
      area: "Sheikh Zayed Road",
      city: "Dubai",
    },
  ],
  bookingCount: 5,
  totalSpent: 2250,
  memberSince: new Date(2024, 8, 15),
  lastBookingAt: new Date(2025, 0, 25),
};

// Mock bookings for this customer
const MOCK_BOOKINGS = [
  {
    id: "BK-005",
    product: "IV Therapy",
    scheduledDate: new Date(2025, 0, 25, 10, 0),
    amount: 450,
    status: "upcoming" as const,
  },
  {
    id: "BK-004",
    product: "Blood Test Panel",
    scheduledDate: new Date(2025, 0, 18, 14, 30),
    amount: 350,
    status: "completed" as const,
  },
  {
    id: "BK-003",
    product: "Vitamin Infusion",
    scheduledDate: new Date(2025, 0, 10, 11, 0),
    amount: 500,
    status: "completed" as const,
  },
  {
    id: "BK-002",
    product: "IV Therapy",
    scheduledDate: new Date(2024, 11, 20, 9, 0),
    amount: 450,
    status: "completed" as const,
  },
  {
    id: "BK-001",
    product: "Health Checkup",
    scheduledDate: new Date(2024, 11, 5, 15, 0),
    amount: 500,
    status: "completed" as const,
  },
];

export default function CustomerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const customerId = params.id as string;

  // In real app, fetch customer by ID
  const customer = MOCK_CUSTOMER;
  const bookings = MOCK_BOOKINGS;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatMemberSince = (date: Date) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 pt-6 relative">
      {/* Close Button */}
      <button
        onClick={() => router.back()}
        className="absolute top-6 right-0 h-10 w-10 rounded-full flex items-center justify-center text-[#666666] hover:bg-white hover:text-black transition-all"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Header with Avatar */}
      <div className="flex items-center gap-5 mb-6">
        <Avatar
          name={`${customer.firstName} ${customer.lastName}`}
          size="xl"
        />
        <div>
          <h1 className="text-3xl font-extralight text-white tracking-tight">
            {customer.firstName} {customer.lastName}
          </h1>
          <p className="text-[#555555] font-light mt-1">
            Customer since {formatMemberSince(customer.memberSince)}
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex items-center gap-16 mb-10">
        <div>
          <p className="text-4xl font-extralight text-white tabular-nums">
            {customer.bookingCount}
          </p>
          <p className="text-xs text-[#555555] uppercase tracking-wider mt-1">Bookings</p>
        </div>
        <div className="h-10 w-px bg-[#1F1F1F]" />
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extralight text-white tabular-nums">
              {customer.totalSpent.toLocaleString()}
            </span>
            <span className="text-sm text-[#555555]">AED</span>
          </div>
          <p className="text-xs text-[#555555] uppercase tracking-wider mt-1">Total Spent</p>
        </div>
        <div className="h-10 w-px bg-[#1F1F1F]" />
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extralight text-[#E07A3C] tabular-nums">
              {Math.round(customer.totalSpent * 0.25).toLocaleString()}
            </span>
            <span className="text-sm text-[#555555]">AED</span>
          </div>
          <p className="text-xs text-[#555555] uppercase tracking-wider mt-1">Commission</p>
        </div>
        <div className="h-10 w-px bg-[#1F1F1F]" />
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extralight text-white tabular-nums">
              {Math.round(customer.totalSpent / customer.bookingCount)}
            </span>
            <span className="text-sm text-[#555555]">AED</span>
          </div>
          <p className="text-xs text-[#555555] uppercase tracking-wider mt-1">Avg. Order</p>
        </div>
      </div>

      {/* Contact Info - Inline */}
      <div className="flex items-center gap-6 mb-10 text-[#A0A0A0]">
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-[#555555]" />
          <span className="font-light">{customer.phone}</span>
        </div>
        {customer.email && (
          <>
            <div className="h-4 w-px bg-[#2A2A2A]" />
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-[#555555]" />
              <span className="font-light">{customer.email}</span>
            </div>
          </>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-[#1F1F1F] mb-8" />

      {/* Addresses Section */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs text-[#555555] uppercase tracking-wider">
            Saved Addresses
          </h3>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#2A2A2A] text-[#555555] text-xs font-medium hover:bg-white hover:text-black hover:border-white transition-all">
            <Plus className="h-3 w-3" />
            Add
          </button>
        </div>

        {customer.addresses.length === 0 ? (
          <p className="text-[#555555] text-sm">No saved addresses</p>
        ) : (
          <div className="space-y-3">
            {customer.addresses.map((address, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 rounded-2xl border border-transparent hover:bg-[#111111] hover:border-[#1F1F1F] transition-all"
              >
                <MapPin className="h-4 w-4 text-[#555555] mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-[#E07A3C] uppercase tracking-wider mb-1">
                    {address.label}
                  </p>
                  <p className="text-white font-light">{address.address}</p>
                  <p className="text-sm text-[#555555]">
                    {address.area}, {address.city}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-[#1F1F1F] mb-8" />

      {/* Booking History Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xs text-[#555555] uppercase tracking-wider">
            Booking History
          </h3>
          <Button
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => router.push(`/bookings/new?customerId=${customerId}`)}
          >
            New Booking
          </Button>
        </div>

        {bookings.length === 0 ? (
          <div className="py-12 text-center">
            <div className="h-12 w-12 rounded-full bg-[#1A1A1A] flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-6 w-6 text-[#444444]" />
            </div>
            <p className="text-white font-light mb-1">No bookings yet</p>
            <p className="text-sm text-[#555555]">Create a booking for this customer</p>
          </div>
        ) : (
          <div className="space-y-2">
            {bookings.map((booking) => (
              <button
                key={booking.id}
                onClick={() => router.push(`/bookings/${booking.id}`)}
                className="w-full text-left group"
              >
                <div className="flex items-center gap-4 p-4 rounded-2xl border border-transparent hover:bg-[#111111] hover:border-[#1F1F1F] transition-all">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-white font-light">
                        {booking.product}
                      </h4>
                      <StatusBadge status={booking.status} size="sm" />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-[#555555]">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(booking.scheduledDate)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {formatTime(booking.scheduledDate)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-white font-light tabular-nums">
                      AED {booking.amount}
                    </span>
                    <div className="h-8 w-8 rounded-full border border-[#2A2A2A] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                      <ArrowUpRight className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions - Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A] to-transparent pointer-events-none">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-3 pointer-events-auto">
          <button
            onClick={() => router.push(`/bookings/new?customerId=${customerId}`)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition-all"
          >
            <Plus className="h-4 w-4" />
            New Booking
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#2A2A2A] text-white/80 text-sm hover:border-white/40 hover:text-white transition-all">
            <Phone className="h-4 w-4" />
            Call
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#2A2A2A] text-white/80 text-sm hover:border-white/40 hover:text-white transition-all">
            <Mail className="h-4 w-4" />
            Email
          </button>
        </div>
      </div>
    </div>
  );
}
