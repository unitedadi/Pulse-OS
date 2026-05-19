"use client";

import * as React from "react";
import { ArrowUpRight, MapPin, RefreshCw, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { EmptyState, HeroBookingCard, StatusBadge } from "@/components/ui";
import { usePartnerContext } from "@/components/layouts";
import {
  bookingCustomerName,
  bookingTitle,
  bookingAddressLabel,
  fetchCustomerBookings,
  formatMoneyFromFils,
  formatDateLabel,
  formatShortDate,
  parseDate,
  parseBookingDate,
  type CustomerBooking,
  toBookingStatus,
  verticalLabel,
} from "@/lib/api/bookings";

interface BookingListRowProps {
  booking: CustomerBooking;
  date: Date;
  onClick: () => void;
}

function paymentCapsule(booking: CustomerBooking) {
  const isPaid =
    String(booking.order_status ?? "").toUpperCase() === "PAID" ||
    Boolean(booking.amount_captured_aed_fils);

  if (isPaid) {
    return {
      label: "Paid",
      className: "bg-[var(--color-success-light)] text-[var(--color-success)]",
    };
  }

  return {
    label: "Pending",
    className: "bg-[var(--color-warning-light)] text-[var(--color-warning)]",
  };
}

function formatStartTime(value?: string | null) {
  const date = parseDate(value);
  if (!date) return "Time pending";

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Dubai",
  }).format(date);
}

function BookingListRow({ booking, date, onClick }: BookingListRowProps) {
  const customer = bookingCustomerName(booking);
  const payment = paymentCapsule(booking);
  const initials = customer
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full grid grid-cols-1 gap-4 py-5 text-left transition-colors sm:grid-cols-[132px_minmax(0,1fr)_auto] sm:items-center sm:gap-6"
    >
      <div className="sm:border-r sm:border-[var(--color-border-subtle)] sm:pr-6">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
          {formatShortDate(date)}
        </p>
        <p className="mt-1 text-sm leading-5 text-[var(--color-text-primary)] tabular-nums">
          {formatStartTime(booking.start_at)}
        </p>
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[15px] leading-6 text-[var(--color-text-primary)] product-cell-title">
            {bookingTitle(booking)}
          </p>
          <span className={`rounded-full px-2.5 py-1 text-[11px] leading-none ${payment.className}`}>
            {payment.label}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--color-text-muted)]">
          <span className="inline-flex items-center gap-1.5">
            <UserRound className="h-3.5 w-3.5" />
            {customer}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {bookingAddressLabel(booking.address)}
          </span>
          <span className="font-mono text-[11px] text-[var(--color-text-soft)]">
            {booking.order_id}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <div className="text-left sm:text-right">
          <p className="text-sm text-[var(--color-text-primary)] tabular-nums">
            {formatMoneyFromFils(
              booking.amount_captured_aed_fils ?? booking.amount_expected_aed_fils,
              booking.currency_captured ?? booking.currency_expected
            )}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2 sm:justify-end">
            <span className="rounded-full bg-[var(--color-bg-tertiary)] px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
              {verticalLabel(booking.vertical)}
            </span>
            <StatusBadge
              status={toBookingStatus(booking.booking_status ?? booking.order_status)}
              size="sm"
            />
          </div>
        </div>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-bg-tertiary)] text-[11px] text-[var(--color-text-secondary)]">
          {initials || "DD"}
        </span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border-default)] text-[var(--color-text-muted)] transition-colors group-hover:border-[var(--color-accent-primary)] group-hover:text-[var(--color-accent-primary)]">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </button>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { context, loading: contextLoading, error: contextError } = usePartnerContext();

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

  const bookingsByDate = React.useMemo(() => {
    const grouped = new Map<string, { date: Date; bookings: CustomerBooking[] }>();

    bookings.forEach((booking) => {
      const date = parseBookingDate(booking);
      if (!date) return;
      const day = new Date(date);
      day.setHours(0, 0, 0, 0);
      const key = day.toDateString();

      const existing = grouped.get(key);
      if (existing) {
        existing.bookings.push(booking);
      } else {
        grouped.set(key, { date: day, bookings: [booking] });
      }
    });

    return Array.from(grouped.values()).sort(
      (left, right) => left.date.getTime() - right.date.getTime()
    );
  }, [bookings]);

  return (
    <div className="space-y-12 pt-4">
      <HeroBookingCard
        title="Create a booking"
        subtitle="Schedule wellness services in seconds."
        imageUrl="/services/create-booking.avif"
        onClick={() => router.push("/bookings/new")}
      />

      {loading ? (
        <div className="py-16 text-center text-sm text-[var(--color-text-muted)]">
          Loading bookings...
        </div>
      ) : error ? (
        <EmptyState
          title="Couldn't load bookings"
          description={`Refresh and try again. ${error}`}
          action={{
            label: "Refresh",
            onClick: () => void loadBookings(),
          }}
        />
      ) : bookingsByDate.length === 0 ? (
        <EmptyState
          title="No bookings yet"
          description="Bookings created for this Pulse customer profile will appear here."
          action={{
            label: "Create booking",
            onClick: () => router.push("/bookings/new"),
          }}
        />
      ) : (
        <div className="space-y-12">
          {bookingsByDate.map(({ date, bookings: dateBookings }) => (
            <div
              key={date.toDateString()}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 lg:gap-12 items-end border-t border-[var(--color-border-subtle)] pt-10">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--color-text-soft)] mb-3">
                    Schedule
                  </p>
                  <h2 className="text-4xl lg:text-5xl font-normal text-[var(--color-text-primary)] leading-none">
                    {formatDateLabel(date)}
                  </h2>
                </div>
                <p className="text-[var(--color-text-muted)] max-w-xl">
                  {dateBookings.length} booking
                  {dateBookings.length === 1 ? "" : "s"} ready for handoff,
                  payment, and clinical coordination.
                </p>
              </div>

              <div className="divide-y divide-[var(--color-border-subtle)]">
                {dateBookings.map((booking) => (
                  <BookingListRow
                    key={booking.order_id}
                    booking={booking}
                    date={parseBookingDate(booking) ?? date}
                    onClick={() =>
                      router.push(
                        `/bookings/${encodeURIComponent(booking.order_id)}?vertical=${encodeURIComponent(
                          booking.vertical ?? ""
                        )}`
                      )
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && bookings.length > 0 && (
        <button
          type="button"
          onClick={() => void loadBookings()}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-subtle)] px-4 py-2 text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)]"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh bookings
        </button>
      )}
    </div>
  );
}
