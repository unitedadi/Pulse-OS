"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Plus, Search, X } from "lucide-react";
import Link from "next/link";
import { Button, EmptyState, StatusBadge } from "@/components/ui";
import { usePartnerContext } from "@/components/layouts";
import { appendPulseAccountId } from "@/lib/pulse-account-selector";
import { cn } from "@/lib/utils";
import {
  bookingAddressLabel,
  bookingCustomerName,
  bookingTitle,
  fetchCustomerBookings,
  formatMoneyFromFils,
  formatShortDate,
  formatTimeRange,
  parseBookingDate,
  type CustomerBooking,
  toBookingStatus,
} from "@/lib/api/bookings";

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "upcoming", label: "Upcoming" },
  { value: "pending_payment", label: "Pending" },
  { value: "completed", label: "Completed" },
];

const DATE_FILTERS = [
  { value: "all", label: "Any time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
];

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

export default function BookingsPage() {
  const router = useRouter();
  const { context, loading: contextLoading, error: contextError } = usePartnerContext();
  const scopedHref = React.useCallback(
    (href: string) => appendPulseAccountId(href, context?.account_id),
    [context?.account_id]
  );

  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [dateFilter, setDateFilter] = React.useState("all");
  const [bookings, setBookings] = React.useState<CustomerBooking[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadBookings = React.useCallback(async () => {
    if (!context?.customer_id) return;

    setLoading(true);
    setError(null);
    try {
      const items = await fetchCustomerBookings({
        customerId: context.customer_id,
      });
      setBookings(items);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "bookings_load_failed"
      );
    } finally {
      setLoading(false);
    }
  }, [context?.customer_id]);

  React.useEffect(() => {
    if (contextLoading) return;
    if (!context?.customer_id) {
      setLoading(false);
      setError(contextError ?? "partner_context_missing");
      return;
    }
    void loadBookings();
  }, [context?.customer_id, contextError, contextLoading, loadBookings]);

  const filteredBookings = bookings.filter((booking) => {
    const status = toBookingStatus(booking.booking_status ?? booking.order_status);
    if (statusFilter !== "all" && status !== statusFilter) return false;

    const date = parseBookingDate(booking);
    if (dateFilter === "today" && (!date || !isToday(date))) return false;
    if (dateFilter === "week" && (!date || !isThisWeek(date))) return false;
    if (dateFilter === "month" && (!date || !isThisMonth(date))) return false;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return [
        bookingTitle(booking),
        bookingCustomerName(booking),
        booking.order_id,
        booking.vertical,
        bookingAddressLabel(booking.address),
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
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
      <div className="flex justify-end">
        <Link href={scopedHref("/bookings/new")}>
          <Button leftIcon={<Plus className="h-4 w-4" />}>
            New Booking
          </Button>
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search customers, services, locations..."
          className="w-full pl-11 pr-10 py-3 bg-transparent border border-[var(--color-border-default)] rounded-full text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-colors text-sm focus:border-[var(--color-accent-primary)]"
          style={{ outline: "none", boxShadow: "none" }}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
        <div className="flex items-center gap-1">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setStatusFilter(filter.value)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-light transition-all",
                statusFilter === filter.value
                  ? "bg-[var(--color-accent-primary)] text-[var(--color-text-inverse)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="hidden sm:block w-px h-6 bg-[var(--color-border-subtle)]" />

        <div className="flex items-center gap-1">
          {DATE_FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setDateFilter(filter.value)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-light transition-all",
                dateFilter === filter.value
                  ? "bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-[var(--color-text-muted)]">
            {filteredBookings.length} result{filteredBookings.length !== 1 ? "s" : ""}
          </span>
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm text-[var(--color-accent-primary)] hover:text-[var(--color-accent-secondary)] transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-sm text-[var(--color-text-muted)]">
          Loading bookings...
        </div>
      ) : error ? (
        <div className="py-20">
          <EmptyState
            title="Couldn't load bookings"
            description={`Refresh and try again. ${error}`}
            action={{
              label: "Refresh",
              onClick: () => void loadBookings(),
            }}
          />
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="py-20">
          <EmptyState
            title="No bookings found"
            description={
              hasActiveFilters
                ? "Try adjusting your search or filters"
                : "Create your first booking to get started"
            }
            action={{
              label: hasActiveFilters ? "Clear Filters" : "Create Booking",
              onClick: hasActiveFilters ? clearFilters : () => router.push(scopedHref("/bookings/new")),
            }}
          />
        </div>
      ) : (
        <div className="divide-y divide-[var(--color-border-subtle)]">
          {filteredBookings.map((booking) => {
            const date = parseBookingDate(booking);
            return (
              <Link
                key={booking.order_id}
                href={scopedHref(
                  `/bookings/${encodeURIComponent(booking.order_id)}?vertical=${encodeURIComponent(
                    booking.vertical ?? ""
                  )}`
                )}
                className="group grid grid-cols-[120px_1fr_auto] items-center gap-6 py-4"
              >
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
                    {date ? formatShortDate(date) : "Date pending"}
                  </p>
                  <p className="mt-1 text-[var(--color-text-primary)] tabular-nums">
                    {formatTimeRange(booking.start_at, booking.end_at)}
                  </p>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-normal text-[var(--color-text-primary)]">
                      {bookingTitle(booking)}
                    </p>
                    <StatusBadge
                      status={toBookingStatus(booking.booking_status ?? booking.order_status)}
                      size="sm"
                    />
                  </div>
                  <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                    w/ {bookingCustomerName(booking)} ·{" "}
                    {bookingAddressLabel(booking.address)} · {booking.order_id}
                  </p>
                </div>

                <div className="flex items-center gap-5">
                  <div className="text-right">
                    <p className="text-[var(--color-text-primary)] tabular-nums">
                      {formatMoneyFromFils(
                        booking.amount_captured_aed_fils ?? booking.amount_expected_aed_fils,
                        booking.currency_captured ?? booking.currency_expected
                      )}
                    </p>
                  </div>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border-default)] text-[var(--color-text-muted)] transition-colors group-hover:border-[var(--color-accent-primary)] group-hover:text-[var(--color-accent-primary)]">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
