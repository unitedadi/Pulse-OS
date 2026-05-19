"use client";

import * as React from "react";
import { Button, EmptyState } from "@/components/ui";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { usePartnerContext } from "@/components/layouts";
import {
  analyticsExportPath,
  fetchPartnerAnalytics,
  moneyFromFils,
  numberFromFils,
  type AnalyticsPeriod,
  type PartnerAnalyticsResponse,
} from "@/lib/api/partner-analytics";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const PERIODS = [
  { id: "wtd", label: "WTD", fullLabel: "Week to Date" },
  { id: "mtd", label: "MTD", fullLabel: "Month to Date" },
  { id: "qtd", label: "QTD", fullLabel: "Quarter to Date" },
  { id: "ytd", label: "YTD", fullLabel: "Year to Date" },
  { id: "custom", label: "Custom", fullLabel: "Custom Range" },
] as const;

function isoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function customRange(month: number, year: number) {
  return {
    startDate: isoDate(new Date(year, month, 1)),
    endDate: isoDate(new Date(year, month + 1, 0)),
  };
}

export default function AnalyticsPage() {
  const router = useRouter();
  const { context, loading: contextLoading, error: contextError } = usePartnerContext();
  const now = React.useMemo(() => new Date(), []);
  const [selectedPeriod, setSelectedPeriod] = React.useState<AnalyticsPeriod>("mtd");
  const [selectedMonth, setSelectedMonth] = React.useState(now.getMonth());
  const [selectedYear, setSelectedYear] = React.useState(now.getFullYear());
  const [analytics, setAnalytics] = React.useState<PartnerAnalyticsResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const navigateMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (selectedMonth === 0) {
        setSelectedMonth(11);
        setSelectedYear(selectedYear - 1);
      } else {
        setSelectedMonth(selectedMonth - 1);
      }
    } else {
      if (selectedMonth === 11) {
        setSelectedMonth(0);
        setSelectedYear(selectedYear + 1);
      } else {
        setSelectedMonth(selectedMonth + 1);
      }
    }
  };

  const requestParams = React.useMemo(() => {
    if (!context?.seller_id) return null;
    const range = customRange(selectedMonth, selectedYear);
    return {
      sellerId: context.seller_id,
      period: selectedPeriod,
      timezone: "Asia/Dubai",
      startDate: range.startDate,
      endDate: range.endDate,
      limit: 25,
    };
  }, [context?.seller_id, selectedMonth, selectedPeriod, selectedYear]);

  const loadAnalytics = React.useCallback(async () => {
    if (!requestParams) return;
    setLoading(true);
    setError(null);
    try {
      setAnalytics(await fetchPartnerAnalytics(requestParams));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "analytics_load_failed");
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  }, [requestParams]);

  React.useEffect(() => {
    if (contextLoading) return;
    if (!context?.seller_id) {
      setLoading(false);
      setError(contextError ?? "partner_context_missing");
      return;
    }
    void loadAnalytics();
  }, [context?.seller_id, contextError, contextLoading, loadAnalytics]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Get period label for display
  const getPeriodLabel = () => {
    const period = PERIODS.find(p => p.id === selectedPeriod);
    if (selectedPeriod === "custom") {
      return `${MONTHS[selectedMonth]} ${selectedYear}`;
    }
    return period?.fullLabel || "";
  };

  const handleExport = () => {
    if (!requestParams) return;
    window.open(`/api/backend${analyticsExportPath(requestParams)}`, "_blank", "noopener,noreferrer");
  };

  const summary = analytics?.summary;
  const currency = analytics?.currency ?? "AED";
  const transactions = analytics?.recent_transactions ?? [];

  return (
    <div className="max-w-6xl mx-auto space-y-10 pt-10 relative">
      {/* Close Button */}
      <button
        onClick={() => router.back()}
        className="absolute top-10 right-0 h-10 w-10 rounded-full flex items-center justify-center border border-[var(--color-border-default)] text-[var(--color-text-muted)] hover:border-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary)] transition-colors"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Header */}
      <div className="pr-14 space-y-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-soft)]">Analytics</p>
          <p className="mt-2 text-2xl font-normal text-[var(--color-text-primary)]">
            {getPeriodLabel()}
          </p>
        </div>

        {/* Period Filter Tabs */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 rounded-full border border-[var(--color-border-default)] p-1">
            {PERIODS.map((period) => (
              <button
                key={period.id}
                onClick={() => setSelectedPeriod(period.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm transition-all",
                  selectedPeriod === period.id
                    ? "bg-[var(--color-accent-primary)] text-[var(--color-text-inverse)]"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                )}
              >
                {period.label}
              </button>
            ))}
          </div>

          {/* Month Navigator - only visible when Custom is selected */}
          {selectedPeriod === "custom" && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateMonth("prev")}
                className="h-10 w-10 rounded-full flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-accent-primary)] transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[var(--color-border-default)]">
                <Calendar className="h-4 w-4 text-[var(--color-text-muted)]" />
                <span className="text-[var(--color-text-primary)]">
                  {MONTHS[selectedMonth]} {selectedYear}
                </span>
              </div>

              <button
                onClick={() => navigateMonth("next")}
                className="h-10 w-10 rounded-full flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-accent-primary)] transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Row */}
      {loading ? (
        <div className="py-20 text-center text-sm text-[var(--color-text-muted)]">
          Loading analytics...
        </div>
      ) : error ? (
        <EmptyState
          title="Couldn't load analytics"
          description={`Refresh and try again. ${error}`}
          action={{
            label: "Refresh",
            onClick: () => void loadAnalytics(),
          }}
        />
      ) : !summary ? (
        <EmptyState
          title="No analytics yet"
          description="Analytics will appear after the first seller-scoped order is captured."
        />
      ) : (
        <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6 border-y border-[var(--color-border-subtle)] py-8">
        <div className="space-y-2">
          <p className="text-4xl font-normal text-[var(--color-text-primary)] tabular-nums">
            {summary.total_bookings}
          </p>
          <p className="text-[11px] text-[var(--color-text-soft)] uppercase tracking-[0.18em]">Bookings</p>
        </div>
        <div className="space-y-2 lg:border-l lg:border-[var(--color-border-subtle)] lg:pl-8">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-normal text-[var(--color-text-primary)] tabular-nums">
              {numberFromFils(summary.gross_revenue_fils)}
            </span>
            <span className="text-xs text-[var(--color-text-muted)]">{currency}</span>
          </div>
          <p className="text-[11px] text-[var(--color-text-soft)] uppercase tracking-[0.18em]">Gross Revenue</p>
        </div>
        <div className="space-y-2 lg:border-l lg:border-[var(--color-border-subtle)] lg:pl-8">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-normal text-[var(--color-accent-primary)] tabular-nums">
              {numberFromFils(summary.commission_earned_fils)}
            </span>
            <span className="text-xs text-[var(--color-text-muted)]">{currency}</span>
          </div>
          <p className="text-[11px] text-[var(--color-text-soft)] uppercase tracking-[0.18em]">Commission</p>
        </div>
        <div className="space-y-2 lg:border-l lg:border-[var(--color-border-subtle)] lg:pl-8">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-normal text-[var(--color-text-primary)] tabular-nums">
              {numberFromFils(summary.estimated_payout_fils)}
            </span>
            <span className="text-xs text-[var(--color-text-muted)]">{currency}</span>
          </div>
          <p className="text-[11px] text-[var(--color-text-soft)] uppercase tracking-[0.18em]">Est. Payout</p>
        </div>
      </div>

      {/* Breakdown Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <p className="text-[11px] text-[var(--color-text-soft)] uppercase tracking-[0.18em]">
            {selectedPeriod === "custom"
              ? `${MONTHS[selectedMonth]} Breakdown`
              : `${getPeriodLabel()} Breakdown`}
          </p>
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--color-border-default)] text-[var(--color-text-muted)] text-xs font-medium hover:border-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary)] transition-colors"
          >
            <Download className="h-3 w-3" />
            Export
          </button>
        </div>

        <div className="divide-y divide-[var(--color-border-subtle)]">
          <div className="flex items-center justify-between py-4">
            <span className="text-sm text-[var(--color-text-secondary)]">Gross Revenue</span>
            <span className="text-sm text-[var(--color-text-primary)] tabular-nums">{moneyFromFils(summary.gross_revenue_fils, currency)}</span>
          </div>

          <div className="flex items-center justify-between py-4">
            <span className="text-sm text-[var(--color-accent-primary)]">Commission Earned</span>
            <span className="text-sm text-[var(--color-accent-primary)] tabular-nums flex items-center gap-2">
              <ArrowUpRight className="h-4 w-4" />
              {moneyFromFils(summary.commission_earned_fils, currency)}
            </span>
          </div>

          <div className="flex items-center justify-between py-4">
            <span className="text-sm text-[var(--color-text-secondary)]">Pending Payments</span>
            <span className="text-sm text-[var(--color-warning)] tabular-nums">{moneyFromFils(summary.pending_payments_fils, currency)}</span>
          </div>

          <div className="flex items-center justify-between py-4">
            <span className="text-sm text-[var(--color-text-secondary)]">Refunds</span>
            <span className="text-sm text-[var(--color-error)] tabular-nums flex items-center gap-2">
              <ArrowDownRight className="h-4 w-4" />
              {moneyFromFils(summary.refunds_fils, currency)}
            </span>
          </div>

          <div className="flex items-center justify-between py-4">
            <span className="text-sm text-[var(--color-text-secondary)]">Commission Clawbacks</span>
            <span className="text-sm text-[var(--color-error)] tabular-nums flex items-center gap-2">
              <ArrowDownRight className="h-4 w-4" />
              {moneyFromFils(summary.commission_clawbacks_fils, currency)}
            </span>
          </div>

          <div className="flex items-center justify-between py-5">
            <span className="text-base text-[var(--color-text-primary)]">Estimated Payout</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl text-[var(--color-text-primary)] tabular-nums">
                {numberFromFils(summary.estimated_payout_fils)}
              </span>
              <span className="text-[var(--color-text-muted)] text-sm">{currency}</span>
            </div>
          </div>
        </div>

        {analytics?.breakdown.by_vertical.length ? (
          <div className="mt-6 divide-y divide-[var(--color-border-subtle)] border-t border-[var(--color-border-subtle)]">
            {analytics.breakdown.by_vertical.map((vertical) => (
              <div key={vertical.vertical} className="grid grid-cols-[1fr_auto_auto] items-center gap-6 py-4">
                <span className="text-sm text-[var(--color-text-secondary)]">{vertical.vertical}</span>
                <span className="text-xs text-[var(--color-text-muted)]">{vertical.bookings} bookings</span>
                <span className="text-sm text-[var(--color-text-primary)] tabular-nums">
                  {moneyFromFils(vertical.gross_revenue_fils, currency)}
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {/* Recent Transactions */}
      <div className="border-t border-[var(--color-border-subtle)] pt-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-[11px] text-[var(--color-text-soft)] uppercase tracking-[0.18em]">
            Recent Transactions
          </p>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </div>

        <div className="divide-y divide-[var(--color-border-subtle)]">
          {transactions.length === 0 ? (
            <div className="py-10 text-sm text-[var(--color-text-muted)]">
              No transactions in this period.
            </div>
          ) : transactions.map((txn) => (
            <div
              key={txn.transaction_id}
              className="flex items-center gap-4 py-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <p className="text-sm text-[var(--color-text-primary)]">{txn.member_name || txn.customer_name || "Member"}</p>
                  {txn.status === "refunded" && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-[var(--color-error-light)] text-[var(--color-error)]">
                      Refunded
                    </span>
                  )}
                  {txn.status === "pending_payment" && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-[var(--color-warning-light)] text-[var(--color-warning)]">
                      Pending
                    </span>
                  )}
                </div>
                <div className="mt-1 flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
                  <span>{txn.product_name || txn.vertical}</span>
                  <span>·</span>
                  <span>{formatDate(new Date(txn.paid_at ?? txn.created_at ?? ""))}</span>
                  <span>·</span>
                  <span>{txn.order_id}</span>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-sm text-[var(--color-text-primary)] tabular-nums">{moneyFromFils(txn.gross_amount_fils, currency)}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">Amount</p>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "text-sm tabular-nums",
                    txn.commission_fils > 0 ? "text-[var(--color-accent-primary)]" : "text-[var(--color-text-muted)]"
                  )}>
                    {txn.commission_fils > 0 ? `+${numberFromFils(txn.commission_fils)}` : "-"}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">Commission</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center py-6 border-t border-[var(--color-border-subtle)]">
        <p className="text-xs text-[var(--color-text-muted)]">
          Estimated earnings. Final payout confirmed via monthly statement.
          Payouts are processed by the 10th of each month.
        </p>
      </div>
      </>
      )}
    </div>
  );
}
