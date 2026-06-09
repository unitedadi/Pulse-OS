"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button, Avatar } from "@/components/ui";
import {
  Users,
  Search,
  X,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { appendPulseAccountId, normalizePulseAccountId } from "@/lib/pulse-account-selector";

// Mock customers data
const MOCK_CUSTOMERS = [
  {
    id: "1",
    firstName: "Sarah",
    lastName: "Chen",
    phone: "+971 50 123 4567",
    email: "sarah.chen@email.com",
    bookingCount: 5,
    totalSpent: 2250,
    lastBookingAt: new Date(2025, 0, 25),
  },
  {
    id: "2",
    firstName: "Mohammed",
    lastName: "Al-Hassan",
    phone: "+971 55 234 5678",
    email: "mohammed@email.com",
    bookingCount: 3,
    totalSpent: 1050,
    lastBookingAt: new Date(2025, 0, 24),
  },
  {
    id: "3",
    firstName: "Emma",
    lastName: "Wilson",
    phone: "+971 52 345 6789",
    email: "emma.wilson@email.com",
    bookingCount: 8,
    totalSpent: 3600,
    lastBookingAt: new Date(2025, 0, 23),
  },
  {
    id: "4",
    firstName: "Ahmed",
    lastName: "Khalid",
    phone: "+971 50 456 7890",
    email: null,
    bookingCount: 2,
    totalSpent: 850,
    lastBookingAt: new Date(2025, 0, 22),
  },
  {
    id: "5",
    firstName: "Lisa",
    lastName: "Park",
    phone: "+971 56 567 8901",
    email: "lisa.park@email.com",
    bookingCount: 12,
    totalSpent: 5400,
    lastBookingAt: new Date(2025, 0, 21),
  },
  {
    id: "6",
    firstName: "Omar",
    lastName: "Farouk",
    phone: "+971 54 678 9012",
    email: null,
    bookingCount: 1,
    totalSpent: 150,
    lastBookingAt: new Date(2025, 0, 15),
  },
];

export default function CustomersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const accountId = normalizePulseAccountId(searchParams.get("account_id"));
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);

  // Filter customers
  const filteredCustomers = MOCK_CUSTOMERS.filter((customer) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();

    return (
      fullName.includes(query) ||
      customer.phone.includes(query) ||
      customer.email?.toLowerCase().includes(query)
    );
  });

  // Sort by most recent booking
  const sortedCustomers = [...filteredCustomers].sort(
    (a, b) => b.lastBookingAt.getTime() - a.lastBookingAt.getTime()
  );

  // Pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(sortedCustomers.length / itemsPerPage);
  const paginatedCustomers = sortedCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate totals
  const totalBookings = MOCK_CUSTOMERS.reduce((sum, c) => sum + c.bookingCount, 0);

  return (
    <div className="space-y-8 pt-12">
      {/* Top Row: Stats + Action */}
      <div className="flex items-center justify-between">
        {/* Inline Stats */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#1A1A1A] flex items-center justify-center">
              <Users className="h-5 w-5 text-[#666666]" />
            </div>
            <div>
              <p className="text-2xl font-extralight text-white tabular-nums">
                {MOCK_CUSTOMERS.length}
              </p>
              <p className="text-xs text-[#555555] uppercase tracking-wider">Customers</p>
            </div>
          </div>

          <div className="h-8 w-px bg-[#1F1F1F]" />

          <div>
            <p className="text-2xl font-extralight text-white tabular-nums">
              {totalBookings}
            </p>
            <p className="text-xs text-[#555555] uppercase tracking-wider">Bookings</p>
          </div>

        </div>

        {/* Action Button */}
        <Link href={appendPulseAccountId("/bookings/new", accountId)}>
          <Button leftIcon={<Plus className="h-4 w-4" />}>
            New Customer
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555555]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search by name, phone, or email..."
          className="w-full pl-11 pr-10 py-3 bg-transparent border border-[#2A2A2A] rounded-full text-white placeholder:text-[#555555] transition-colors text-sm font-light focus:border-[#E07A3C]/50"
          style={{ outline: "none", boxShadow: "none" }}
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

      {/* Customer List */}
      {paginatedCustomers.length === 0 ? (
        <div className="py-20 text-center">
          <div className="h-16 w-16 rounded-full bg-[#1A1A1A] flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-[#444444]" />
          </div>
          <h3 className="text-white font-light text-lg mb-2">
            {searchQuery ? "No customers found" : "No customers yet"}
          </h3>
          <p className="text-[#555555] text-sm max-w-sm mx-auto">
            {searchQuery
              ? "Try adjusting your search query"
              : "Customers will appear here once you create bookings for them"}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 text-[#E07A3C] text-sm hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Customer List */}
          <div className="divide-y divide-[var(--color-border-subtle)]">
            {paginatedCustomers.map((customer) => (
              <button
                key={customer.id}
                onClick={() => router.push(appendPulseAccountId(`/customers/${customer.id}`, accountId))}
                className="group w-full text-left"
              >
                <div className="flex items-center gap-4 py-3">
                  {/* Avatar */}
                  <Avatar
                    name={`${customer.firstName} ${customer.lastName}`}
                    size="md"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-normal text-[var(--color-text-primary)] transition-colors">
                      {customer.firstName} {customer.lastName}
                    </p>
                    <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                      {customer.phone}
                    </p>
                  </div>

                  {/* Stats - Right side */}
                  <div className="hidden sm:flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-normal text-[var(--color-text-primary)] tabular-nums">
                        {customer.bookingCount}
                      </p>
                      <p className="text-[10px] text-[var(--color-text-soft)] uppercase tracking-wider">
                        Bookings
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="flex items-baseline gap-1 justify-end">
                        <span className="text-[var(--color-text-muted)] text-[10px]">AED</span>
                        <span className="text-sm font-normal text-[var(--color-accent-primary)] tabular-nums">
                          {customer.totalSpent.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[10px] text-[var(--color-text-soft)] uppercase tracking-wider">
                        Spent
                      </p>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="h-8 w-8 rounded-full border border-[var(--color-border-default)] flex items-center justify-center opacity-0 transition-all group-hover:opacity-100">
                    <ArrowUpRight className="h-4 w-4 text-[var(--color-accent-primary)]" />
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Pagination - Simple */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    "h-8 w-8 rounded-full text-sm transition-all",
                    page === currentPage
                      ? "bg-white text-black"
                      : "text-[#666666] hover:text-white"
                  )}
                >
                  {page}
                </button>
              ))}
            </div>
          )}

          {/* Summary */}
          <div className="pt-4 text-center">
            <p className="text-xs text-[#555555]">
              Showing {paginatedCustomers.length} of {filteredCustomers.length} customers
            </p>
          </div>
        </>
      )}
    </div>
  );
}
