export type AnalyticsPeriod = "wtd" | "mtd" | "qtd" | "ytd" | "custom";

export type PartnerAnalyticsResponse = {
  seller_id: string;
  period: AnalyticsPeriod;
  timezone: string;
  start_date: string;
  end_date: string;
  currency: string;
  summary: {
    total_bookings: number;
    paid_bookings: number;
    pending_payment_bookings: number;
    gross_revenue_fils: number;
    captured_revenue_fils: number;
    pending_payments_fils: number;
    refunds_fils: number;
    commission_earned_fils: number;
    commission_clawbacks_fils: number;
    estimated_payout_fils: number;
  };
  breakdown: {
    by_vertical: Array<{
      vertical: string;
      bookings: number;
      gross_revenue_fils: number;
      commission_earned_fils: number;
    }>;
  };
  recent_transactions: Array<{
    transaction_id: string;
    order_id: string;
    vertical: string;
    created_at: string | null;
    paid_at: string | null;
    customer_name?: string | null;
    member_name?: string | null;
    product_name: string | null;
    gross_amount_fils: number;
    commission_fils: number;
    status: "paid" | "pending_payment" | "refunded" | "cancelled" | "completed";
  }>;
};

type AnalyticsParams = {
  sellerId: string;
  period: AnalyticsPeriod;
  timezone?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
};

function analyticsSearchParams({
  period,
  timezone = "Asia/Dubai",
  startDate,
  endDate,
  limit,
}: Omit<AnalyticsParams, "sellerId">) {
  const search = new URLSearchParams({
    period,
    timezone,
  });

  if (period === "custom" && startDate && endDate) {
    search.set("start_date", startDate);
    search.set("end_date", endDate);
  }
  if (limit) search.set("limit", String(limit));

  return search;
}

export function analyticsPath(params: AnalyticsParams) {
  const search = analyticsSearchParams(params);
  return `/partners/${encodeURIComponent(params.sellerId)}/analytics?${search.toString()}`;
}

export function analyticsExportPath(params: AnalyticsParams) {
  const search = analyticsSearchParams(params);
  search.set("format", "csv");
  return `/partners/${encodeURIComponent(params.sellerId)}/analytics/export?${search.toString()}`;
}

export async function fetchPartnerAnalytics(params: AnalyticsParams) {
  const response = await fetch(`/api/backend${analyticsPath(params)}`, {
    headers: {
      Accept: "application/json",
      "ngrok-skip-browser-warning": "1",
    },
  });

  const payload = (await response.json().catch(() => null)) as
    | (PartnerAnalyticsResponse & { error?: string; detail?: string })
    | null;

  if (!response.ok) {
    throw new Error(payload?.error || payload?.detail || `analytics_${response.status}`);
  }

  if (!payload?.summary) throw new Error("analytics_payload_invalid");
  return payload;
}

export function moneyFromFils(amountFils: number, currency = "AED") {
  return `${currency} ${(amountFils / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function numberFromFils(amountFils: number) {
  return (amountFils / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
