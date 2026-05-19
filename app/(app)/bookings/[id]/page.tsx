"use client";

import * as React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, CalendarDays, CreditCard, Download, FileText, FlaskConical, MapPin, Phone, RefreshCw, UserRound } from "lucide-react";
import { Avatar, StatusBadge } from "@/components/ui";
import { useImmersiveMode, usePartnerContext } from "@/components/layouts";
import {
  absoluteApiUrl,
  bookingFullAddressLabel,
  bookingCustomerName,
  detailCustomerName,
  detailTitle,
  fetchCustomerBookings,
  fetchOrderDetail,
  formatMoneyFromFils,
  formatTimeRange,
  parseDate,
  type CustomerBooking,
  type OrderDetail,
  toBookingStatus,
  verticalLabel,
} from "@/lib/api/bookings";

function formatDetailDate(value?: string | null) {
  const date = parseDate(value);
  if (!date) return "Date pending";
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Dubai",
  });
}

function formatDetailTimestamp(value?: string | null) {
  const date = parseDate(value);
  if (!date) return "Pending";
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Dubai",
  });
}

function timelineLabel(value?: string | null) {
  return String(value ?? "event").replace(/_/g, " ");
}

function patientNames(detail?: OrderDetail | null, summary?: CustomerBooking | null) {
  const detailNames = detail?.patients
    ?.map((patient) => patient.name ?? patient.member_name)
    .filter((name): name is string => Boolean(name));
  if (detailNames?.length) return detailNames;
  if (summary?.patient_names.length) return summary.patient_names;
  return [detailCustomerName(detail ?? { order_id: "" }, summary)];
}

function invoicePathFor(orderId: string, detail?: OrderDetail | null, summary?: CustomerBooking | null) {
  const detailPath = detail?.invoice?.pdf_path;
  if (detailPath) return detailPath;
  const summaryPath = summary?.invoice?.pdf_path;
  if (summaryPath) return summaryPath;
  return `/orders/${encodeURIComponent(orderId)}/invoice/pdf`;
}

export default function BookingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { context, loading: contextLoading, error: contextError } = usePartnerContext();
  const orderId = String(params.id ?? "");

  useImmersiveMode();

  const [summary, setSummary] = React.useState<CustomerBooking | null>(null);
  const [detail, setDetail] = React.useState<OrderDetail | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadDetail = React.useCallback(async () => {
    if (!context?.customer_id || !orderId) return;

    setLoading(true);
    setError(null);
    try {
      let nextSummary: CustomerBooking | null = null;
      try {
        const bookings = await fetchCustomerBookings({
          customerId: context.customer_id,
        });
        nextSummary =
          bookings.find((booking) => booking.order_id === orderId) ?? null;
      } catch {
        nextSummary = null;
      }
      setSummary(nextSummary);

      const nextDetail = await fetchOrderDetail({
        orderId,
        vertical: searchParams.get("vertical") || nextSummary?.vertical,
      });
      setDetail(nextDetail);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "booking_detail_load_failed"
      );
    } finally {
      setLoading(false);
    }
  }, [context?.customer_id, orderId, searchParams]);

  React.useEffect(() => {
    if (contextLoading) return;
    if (!context?.customer_id) {
      setLoading(false);
      setError(contextError ?? "partner_context_missing");
      return;
    }
    void loadDetail();
  }, [context?.customer_id, contextError, contextLoading, loadDetail]);

  const title = detail ? detailTitle(detail, summary) : summary ? bookingCustomerName(summary) : "Booking";
  const customerName = detail ? detailCustomerName(detail, summary) : summary ? bookingCustomerName(summary) : "Customer";
  const statusValue =
    detail?.booking_status ??
    detail?.order_status ??
    detail?.status ??
    summary?.booking_status ??
    summary?.order_status;
  const startAt = detail?.slot_start ?? detail?.start_at ?? summary?.start_at;
  const endAt = detail?.slot_end ?? detail?.end_at ?? summary?.end_at;
  const address = detail?.address ?? summary?.address ?? null;
  const amountFils =
    detail?.amount_captured ??
    detail?.amount_captured_aed_fils ??
    detail?.amount_expected_aed_fils ??
    summary?.amount_captured_aed_fils ??
    summary?.amount_expected_aed_fils;
  const currency =
    detail?.currency_captured ??
    detail?.currency_expected ??
    summary?.currency_captured ??
    summary?.currency_expected;
  const phone = detail?.customer?.phone ?? null;
  const invoiceUrl = orderId ? absoluteApiUrl(invoicePathFor(orderId, detail, summary)) : null;
  const patients = patientNames(detail, summary);
  const productCode = detail?.product_uuid ?? summary?.product_name;
  const orderStatus = detail?.status ?? detail?.order_status ?? summary?.order_status;
  const bookingStatus = detail?.booking_status ?? summary?.booking_status;
  const timeline = (detail?.timeline?.length ? detail.timeline : [
    { event: "created", at: detail?.created_at ?? summary?.created_at },
    { event: "paid", at: detail?.paid_at ?? summary?.paid_at },
  ]).filter((event) => event.at);

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-6 lg:px-10 lg:py-8">
        <div className="mb-8">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border-default)] text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary)]"
            aria-label="Back to home"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        </div>

          {loading ? (
            <div className="flex flex-1 items-center justify-center text-sm text-[var(--color-text-muted)]">
              Loading booking details...
            </div>
          ) : error ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
              <p className="text-xl text-[var(--color-text-primary)]">Couldn&apos;t load booking</p>
              <p className="max-w-sm text-sm text-[var(--color-text-muted)]">{error}</p>
              <button
                type="button"
                onClick={() => void loadDetail()}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent-primary)] px-5 py-2.5 text-sm text-[var(--color-text-inverse)]"
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <header className="border-b border-[var(--color-border-subtle)] pb-8">
                <div className="mb-5 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[var(--color-bg-tertiary)] px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-[var(--color-text-secondary)]">
                    {verticalLabel(detail?.vertical ?? summary?.vertical)}
                  </span>
                  <StatusBadge status={toBookingStatus(statusValue)} />
                  {orderStatus && (
                    <span className="rounded-full border border-[var(--color-border-subtle)] px-3 py-1 text-xs text-[var(--color-text-muted)]">
                      Payment {String(orderStatus).replace(/_/g, " ").toLowerCase()}
                    </span>
                  )}
                </div>
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-end">
                  <div>
                    <p className="mb-2 text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-soft)]">
                      Booking detail
                    </p>
                    <h1 className="text-4xl leading-tight text-[var(--color-text-primary)] lg:text-5xl">
                      {title}
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-text-muted)]">
                      {formatDetailDate(startAt)} · {formatTimeRange(startAt, endAt)}
                    </p>
                  </div>
                  <div className="border-t border-[var(--color-border-subtle)] pt-4 lg:border-t-0 lg:text-right">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
                      Total paid
                    </p>
                    <p className="mt-2 text-2xl tabular-nums text-[var(--color-text-primary)]">
                      {formatMoneyFromFils(amountFils, currency)}
                    </p>
                    <p className="mt-1 font-mono text-xs text-[var(--color-text-muted)]">{orderId}</p>
                  </div>
                </div>
              </header>

              <section className="grid border-b border-[var(--color-border-subtle)] lg:grid-cols-3">
                <div className="border-t border-[var(--color-border-subtle)] py-5 lg:pr-6">
                  <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[var(--color-text-soft)]">
                    <UserRound className="h-4 w-4" />
                    Member
                  </div>
                  <div className="flex items-center gap-3">
                    <Avatar name={customerName} size="md" />
                    <div className="min-w-0">
                      <p className="truncate text-sm text-[var(--color-text-primary)]">{customerName}</p>
                      {phone && (
                        <div className="mt-1 flex items-center gap-1.5 text-[var(--color-text-muted)]">
                          <Phone className="h-3 w-3" />
                          <span className="text-xs">{phone}</span>
                        </div>
                      )}
                      <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                        {patients.join(", ")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[var(--color-border-subtle)] py-5 lg:border-l lg:px-6">
                  <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[var(--color-text-soft)]">
                    <MapPin className="h-4 w-4" />
                    Visit address
                  </div>
                  <div className="flex items-start gap-2">
                    <p className="text-sm leading-6 text-[var(--color-text-primary)]">
                      {bookingFullAddressLabel(address)}
                    </p>
                  </div>
                </div>

                <div className="border-t border-[var(--color-border-subtle)] py-5 lg:border-l lg:pl-6">
                  <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[var(--color-text-soft)]">
                    <CreditCard className="h-4 w-4" />
                    Payment
                  </div>
                  <p className="text-sm text-[var(--color-text-primary)]">
                    {formatMoneyFromFils(amountFils, currency)}
                  </p>
                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                    Paid {formatDetailTimestamp(detail?.paid_at ?? summary?.paid_at)}
                  </p>
                </div>
              </section>

              <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
                <div className="space-y-8">
                  <div className="border-b border-[var(--color-border-subtle)] pb-8">
                    <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[var(--color-text-soft)]">
                      <FlaskConical className="h-4 w-4" />
                      Service
                    </div>
                    <div className="divide-y divide-[var(--color-border-subtle)]">
                      <div className="grid gap-1 py-3 sm:grid-cols-[150px_1fr]">
                        <p className="text-sm text-[var(--color-text-muted)]">Product</p>
                        <p className="text-sm text-[var(--color-text-primary)]">{title}</p>
                      </div>
                      {productCode && (
                        <div className="grid gap-1 py-3 sm:grid-cols-[150px_1fr]">
                          <p className="text-sm text-[var(--color-text-muted)]">Product code</p>
                          <p className="font-mono text-xs text-[var(--color-text-primary)]">{productCode}</p>
                        </div>
                      )}
                      <div className="grid gap-1 py-3 sm:grid-cols-[150px_1fr]">
                        <p className="text-sm text-[var(--color-text-muted)]">Booking status</p>
                        <p className="text-sm capitalize text-[var(--color-text-primary)]">
                          {String(bookingStatus ?? "active").replace(/_/g, " ").toLowerCase()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-b border-[var(--color-border-subtle)] pb-8">
                    <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[var(--color-text-soft)]">
                      <FileText className="h-4 w-4" />
                      Documents
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      {invoiceUrl && (
                        <button
                          type="button"
                          onClick={() => window.open(invoiceUrl, "_blank", "noopener,noreferrer")}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[var(--color-accent-primary)] px-5 py-3 text-sm text-[var(--color-text-inverse)] transition-colors hover:bg-[var(--color-accent-secondary)]"
                        >
                          <Download className="h-4 w-4" />
                          Open invoice
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <aside className="border-b border-[var(--color-border-subtle)] pb-8 lg:border-l lg:pl-8">
                  <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[var(--color-text-soft)]">
                    <CalendarDays className="h-4 w-4" />
                    Timeline
                  </div>
                  <div className="space-y-4">
                    {timeline.length > 0 ? (
                      timeline.map((event) => (
                        <div key={`${event.event}-${event.at}`} className="flex gap-3">
                          <div className="mt-1 h-2 w-2 rounded-full bg-[var(--color-accent-primary)]" />
                          <div>
                            <p className="text-sm capitalize text-[var(--color-text-primary)]">
                              {timelineLabel(event.event)}
                            </p>
                            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                              {formatDetailTimestamp(event.at)}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-[var(--color-text-muted)]">No timeline events yet.</p>
                    )}
                  </div>
                </aside>
              </section>

              <div className="flex flex-col gap-3 border-t border-[var(--color-border-subtle)] pt-6 sm:flex-row">
                <button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  className="inline-flex flex-1 items-center justify-center rounded-full border border-[var(--color-border-default)] px-6 py-3.5 text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-accent-primary)]"
                >
                  Back home
                </button>
                {invoiceUrl && (
                  <button
                    type="button"
                    onClick={() => window.open(invoiceUrl, "_blank", "noopener,noreferrer")}
                    className="inline-flex flex-1 items-center justify-center gap-3 rounded-full bg-[var(--color-accent-primary)] px-6 py-3.5 text-[var(--color-text-inverse)] transition-colors hover:bg-[var(--color-accent-secondary)]"
                  >
                    <Download className="h-5 w-5" />
                    Open invoice
                  </button>
                )}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
