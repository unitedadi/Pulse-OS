"use client";

import * as React from "react";
import {
  ArrowUpRight,
  Building2,
  Check,
  Copy,
  Loader2,
  MapPin,
  RefreshCw,
  UserRound,
  X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, EmptyState, HeroBookingCard, Input, StatusBadge } from "@/components/ui";
import { usePartnerContext } from "@/components/layouts";
import { appendPulseAccountId } from "@/lib/pulse-account-selector";
import { onboardPulsePartner, type PulsePartnerOnboardResponse } from "@/lib/api/pulse-partners";
import { isDardocPulseSeller } from "@/lib/pulse-sellers";
import { cn } from "@/lib/utils";
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

type PartnerEligibility = "iv" | "lab";

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

function parseEmails(value: string) {
  return Array.from(
    new Set(
      value
        .split(/[\s,;]+/)
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean)
    )
  );
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function DarDocActions({
  onCreatePartner,
  onBook,
}: {
  onCreatePartner: () => void;
  onBook: () => void;
}) {
  const actions = [
    {
      eyebrow: "DarDoc admin",
      title: "Create partner",
      description:
        "Create the B2B seller, attach the checkout customer profile, seed products, and send the Pulse invite in one flow.",
      label: "Create partner",
      icon: <Building2 className="h-5 w-5" />,
      onClick: onCreatePartner,
    },
    {
      eyebrow: "Fast intake",
      title: "Book on behalf",
      description: "Select a Pulse member, build their cart, and share a checkout link for payment.",
      label: "Book",
      icon: <UserRound className="h-5 w-5" />,
      onClick: onBook,
    },
  ];

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      {actions.map((action, index) => (
        <button
          key={action.title}
          type="button"
          onClick={action.onClick}
          className="group relative min-h-[270px] overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-card)] p-7 text-left shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:border-[var(--color-accent-primary)] hover:shadow-[var(--shadow-lg)]"
        >
          <div
            className={cn(
              "absolute inset-0 opacity-80",
              index === 0
                ? "bg-[radial-gradient(circle_at_top_right,rgba(224,122,60,0.18),transparent_38%)]"
                : "bg-[radial-gradient(circle_at_top_right,rgba(23,59,61,0.18),transparent_42%)]"
            )}
          />
          <div className="relative flex h-full min-h-[214px] flex-col justify-between">
            <div>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent-glow)] text-[var(--color-accent-primary)]">
                {action.icon}
              </div>
              <p className="mb-3 text-[11px] uppercase tracking-[0.24em] text-[var(--color-text-soft)]">
                {action.eyebrow}
              </p>
              <h2 className="text-3xl font-normal leading-none text-[var(--color-text-primary)] md:text-4xl">
                {action.title}
              </h2>
              <p className="mt-4 max-w-[520px] text-sm leading-6 text-[var(--color-text-muted)]">
                {action.description}
              </p>
            </div>
            <div className="mt-8 inline-flex w-fit items-center gap-3 rounded-full border border-[var(--color-border-default)] px-6 py-3 text-sm text-[var(--color-text-primary)] transition-colors group-hover:border-[var(--color-accent-primary)] group-hover:text-[var(--color-accent-primary)]">
              {action.label}
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
        </button>
      ))}
    </section>
  );
}

function CreatePartnerModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [partnerName, setPartnerName] = React.useState("");
  const [inviteEmails, setInviteEmails] = React.useState("");
  const [eligibility, setEligibility] = React.useState<Record<PartnerEligibility, boolean>>({
    iv: true,
    lab: true,
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<PulsePartnerOnboardResponse | null>(null);
  const [copied, setCopied] = React.useState(false);

  const emails = React.useMemo(() => parseEmails(inviteEmails), [inviteEmails]);
  const pulseUrl = result
    ? `https://www.pulsehealthuae.com/dashboard?account_id=${result.account_id}`
    : null;

  const reset = React.useCallback(() => {
    setPartnerName("");
    setInviteEmails("");
    setEligibility({ iv: true, lab: true });
    setSubmitting(false);
    setError(null);
    setResult(null);
    setCopied(false);
  }, []);

  const close = React.useCallback(() => {
    if (submitting) return;
    onClose();
  }, [onClose, submitting]);

  React.useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setResult(null);

    const name = partnerName.trim();
    if (!name) {
      setError("Enter the partner name.");
      return;
    }
    if (!eligibility.iv && !eligibility.lab) {
      setError("Select at least IV drips or lab tests.");
      return;
    }
    if (!emails.length) {
      setError("Enter at least one invite email.");
      return;
    }
    const invalidEmail = emails.find((email) => !isEmail(email));
    if (invalidEmail) {
      setError(`Invalid email: ${invalidEmail}`);
      return;
    }

    setSubmitting(true);
    try {
      const payload = await onboardPulsePartner({
        name,
        eligible_for_iv: eligibility.iv,
        eligible_for_lab: eligibility.lab,
        invite_emails: emails,
      });
      setResult(payload);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "partner_onboarding_failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function copyUrl() {
    if (!pulseUrl) return;
    await navigator.clipboard.writeText(pulseUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  React.useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [close, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close create partner dialog"
        className="absolute inset-0 cursor-default bg-[rgba(23,59,61,0.18)] backdrop-blur-sm"
        onClick={submitting ? undefined : close}
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-partner-title"
        className="relative w-full max-w-2xl overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)] p-6 text-[var(--color-text-primary)] shadow-[var(--shadow-xl)]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(224,122,60,0.16),transparent_42%)]" />
        <div className="relative mb-6 flex items-start justify-between gap-6">
          <div>
            <p className="mb-2 text-[11px] uppercase tracking-[0.24em] text-[var(--color-text-soft)]">
              Pulse setup
            </p>
            <h2 id="create-partner-title" className="text-3xl font-normal leading-none text-[var(--color-text-primary)]">
              Create B2B partner
            </h2>
            <p className="mt-2 max-w-lg text-sm leading-6 text-[var(--color-text-muted)]">
              Set up the partner, products, customer profile, and first Pulse invite.
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            disabled={submitting}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-bg-card)] text-[var(--color-text-muted)] shadow-[var(--shadow-xs)] transition-colors hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-primary)] disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="relative space-y-5">
        <Input
          label="Partner name"
          value={partnerName}
          onChange={(event) => setPartnerName(event.target.value)}
          placeholder="Example: Ikigai"
          required
          disabled={submitting || Boolean(result)}
        />

        <div>
          <p className="mb-2 text-sm font-medium text-[var(--color-text-primary)]">Eligible for</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { key: "iv" as const, title: "IV drips", text: "Seed B2B IV products and commission." },
              { key: "lab" as const, title: "Lab tests", text: "Seed B2B lab products and commission." },
            ].map((option) => {
              const selected = eligibility[option.key];
              return (
                <button
                  key={option.key}
                  type="button"
                  disabled={submitting || Boolean(result)}
                  onClick={() =>
                    setEligibility((current) => ({
                      ...current,
                      [option.key]: !current[option.key],
                    }))
                  }
                  className={cn(
                    "rounded-[var(--radius-lg)] border p-4 text-left transition-colors disabled:opacity-60",
                    selected
                      ? "border-[var(--color-accent-primary)] bg-[var(--color-bg-card)] shadow-[var(--shadow-xs)]"
                      : "border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/45 hover:border-[var(--color-border-hover)]"
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-[var(--color-text-primary)]">{option.title}</p>
                      <p className="mt-1 text-xs leading-5 text-[var(--color-text-muted)]">{option.text}</p>
                    </div>
                    <span
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                        selected
                          ? "border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)] text-[var(--color-text-inverse)]"
                          : "border-[var(--color-border-default)]"
                      )}
                    >
                      {selected ? <Check className="h-3.5 w-3.5" /> : null}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-primary)]">
            Invite emails <span className="text-[var(--color-error)]">*</span>
          </label>
          <textarea
            value={inviteEmails}
            onChange={(event) => setInviteEmails(event.target.value)}
            placeholder="info@partner.ae"
            disabled={submitting || Boolean(result)}
            className="min-h-24 w-full rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-bg-card)] px-3 py-3 text-base text-[var(--color-text-primary)] shadow-[var(--shadow-xs)] outline-none transition-all placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-border-focus)] focus:shadow-[var(--shadow-focus)] disabled:opacity-60"
            required
          />
          <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">
            {emails.length ? `${emails.length} invite${emails.length === 1 ? "" : "s"} will be queued.` : "Separate multiple emails with commas or new lines."}
          </p>
        </div>

        {error && (
          <div className="rounded-[var(--radius-md)] border border-[var(--color-error)]/20 bg-[var(--color-error-light)] px-4 py-3 text-sm text-[var(--color-error)]">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-4 rounded-[var(--radius-lg)] border border-[var(--color-success)]/20 bg-[var(--color-success-light)]/40 p-4">
            <div>
              <p className="text-sm text-[var(--color-text-primary)]">Partner created</p>
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                Seller {result.seller.seller_id} · Customer {result.seller.customer_id} · Account {result.account_id}
              </p>
            </div>
            {pulseUrl && (
              <button
                type="button"
                onClick={() => void copyUrl()}
                className="flex w-full items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-card)] px-4 py-3 text-left text-sm text-[var(--color-text-primary)]"
              >
                <span className="truncate">{pulseUrl}</span>
                <span className="inline-flex shrink-0 items-center gap-2 text-[var(--color-accent-primary)]">
                  <Copy className="h-4 w-4" />
                  {copied ? "Copied" : "Copy"}
                </span>
              </button>
            )}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={close} disabled={submitting}>
            {result ? "Close" : "Cancel"}
          </Button>
          {!result && (
            <Button type="submit" disabled={submitting} leftIcon={submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}>
              {submitting ? "Creating" : "Create partner"}
            </Button>
          )}
        </div>
      </form>
      </section>
    </div>
  );
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
  const searchParams = useSearchParams();
  const { context, loading: contextLoading, error: contextError } = usePartnerContext();
  const [createPartnerOpen, setCreatePartnerOpen] = React.useState(false);
  const isDardocWorkspace = isDardocPulseSeller(context?.seller_id);
  const scopedHref = React.useCallback(
    (href: string) => appendPulseAccountId(href, context?.account_id),
    [context?.account_id]
  );

  const [bookings, setBookings] = React.useState<CustomerBooking[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (searchParams.get("action") === "create_partner" && isDardocWorkspace) {
      setCreatePartnerOpen(true);
    }
  }, [isDardocWorkspace, searchParams]);

  const closeCreatePartner = React.useCallback(() => {
    setCreatePartnerOpen(false);
    if (searchParams.get("action") === "create_partner") {
      router.replace(scopedHref("/dashboard"));
    }
  }, [router, scopedHref, searchParams]);

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
      {isDardocWorkspace ? (
        <DarDocActions
          onCreatePartner={() => setCreatePartnerOpen(true)}
          onBook={() => router.push(scopedHref("/bookings/new?mode=behalf"))}
        />
      ) : (
        <HeroBookingCard
          title="Create a booking"
          subtitle="Schedule wellness services in seconds."
          imageUrl="/services/create-booking.avif"
          onClick={() => router.push(scopedHref("/bookings/new"))}
        />
      )}

      <CreatePartnerModal open={createPartnerOpen} onClose={closeCreatePartner} />

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
            onClick: () => router.push(scopedHref("/bookings/new")),
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
                        scopedHref(
                          `/bookings/${encodeURIComponent(booking.order_id)}?vertical=${encodeURIComponent(
                            booking.vertical ?? ""
                          )}`
                        )
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
