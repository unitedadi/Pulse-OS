import type { BookingStatus } from "@/types";

export type BookingAddress = {
  address_id?: string | null;
  saved_name?: string | null;
  building_name?: string | null;
  floor_number?: string | null;
  line1?: string | null;
  area?: string | null;
  city?: string | null;
  emirate?: string | null;
  country?: string | null;
};

export type BookingInvoice = {
  available?: boolean | string | null;
  invoice_number?: string | null;
  pdf_path?: string | null;
};

export type CustomerBooking = {
  booking_id: number | null;
  order_id: string;
  booking_status: string | null;
  order_status: string | null;
  vertical: string | null;
  start_at: string | null;
  end_at: string | null;
  created_at: string | null;
  paid_at: string | null;
  amount_expected_aed_fils: number | null;
  amount_captured_aed_fils: number | null;
  currency_expected: string | null;
  currency_captured: string | null;
  product_name: string | null;
  product_names: string[];
  patient_names: string[];
  address_id: string | null;
  address: BookingAddress | null;
  invoice?: BookingInvoice | null;
  is_payment_pending?: boolean | null;
};

export type CustomerBookingsResponse = {
  customer_id: string;
  items: CustomerBooking[];
  next_before_start_at?: string | null;
};

export type OrderDetail = {
  order_id: string;
  status?: string | null;
  booking_status?: string | null;
  order_status?: string | null;
  vertical?: string | null;
  customer_id?: string | null;
  seller_id?: string | null;
  slot_start?: string | null;
  slot_end?: string | null;
  start_at?: string | null;
  end_at?: string | null;
  created_at?: string | null;
  paid_at?: string | null;
  amount_captured?: number | null;
  amount_expected_aed_fils?: number | null;
  amount_captured_aed_fils?: number | null;
  currency_captured?: string | null;
  currency_expected?: string | null;
  product_uuid?: string | null;
  product_name?: string | null;
  product_names?: string[] | null;
  customer?: {
    full_name?: string | null;
    phone?: string | null;
    email?: string | null;
  } | null;
  address?: BookingAddress | null;
  results?: {
    available?: boolean | null;
    mode?: string | null;
    reported_at?: string | null;
    pdf?: { available?: boolean | null; path?: string | null } | null;
    advanced?: {
      available?: boolean | null;
      summary?: {
        total_biomarkers?: number | null;
        out_of_range_count?: number | null;
      } | null;
    } | null;
  } | null;
  patients?: Array<{
    name?: string | null;
    patient_id?: string | null;
    member_name?: string | null;
    items?: Array<{ product_name?: string | null; display_name?: string | null; name?: string | null }>;
    tests?: Array<{ product_name?: string | null; display_name?: string | null; name?: string | null }>;
  }> | null;
  cart?: {
    patients?: Array<{
      name?: string | null;
      member_name?: string | null;
      items?: Array<{ product_name?: string | null; display_name?: string | null; name?: string | null }>;
      tests?: Array<{ product_name?: string | null; display_name?: string | null; name?: string | null }>;
    }>;
  } | null;
  invoice?: BookingInvoice | null;
  timeline?: Array<{ event?: string | null; at?: string | null }>;
  checkout_url?: string | null;
  workflow?: { name?: string | null; version?: number | null } | null;
};

const DEFAULT_API_BASE_URL = "https://api-prod.dardoc.com";
const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL).replace(/\/+$/, "");

function requireApiBaseUrl() {
  if (!apiBaseUrl) throw new Error("api_base_url_missing");
  return apiBaseUrl;
}

export function absoluteApiUrl(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (typeof window !== "undefined") return `/api/backend${normalized}`;
  return `${requireApiBaseUrl()}${normalized}`;
}

async function fetchJson<T>(path: string, token?: string | null): Promise<T> {
  const response = await fetch(absoluteApiUrl(path), {
    headers: {
      Accept: "application/json",
      "ngrok-skip-browser-warning": "1",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const error =
      payload && typeof payload === "object" && "error" in payload
        ? String((payload as { error?: unknown }).error)
        : `request_${response.status}`;
    throw new Error(error);
  }

  return payload as T;
}

function normalizeBooking(raw: Partial<CustomerBooking>): CustomerBooking {
  return {
    booking_id: raw.booking_id ?? null,
    order_id: String(raw.order_id ?? ""),
    booking_status: raw.booking_status ?? null,
    order_status: raw.order_status ?? null,
    vertical: raw.vertical ?? null,
    start_at: raw.start_at ?? null,
    end_at: raw.end_at ?? null,
    created_at: raw.created_at ?? null,
    paid_at: raw.paid_at ?? null,
    amount_expected_aed_fils: raw.amount_expected_aed_fils ?? null,
    amount_captured_aed_fils: raw.amount_captured_aed_fils ?? null,
    currency_expected: raw.currency_expected ?? null,
    currency_captured: raw.currency_captured ?? null,
    product_name: raw.product_name ?? null,
    product_names: Array.isArray(raw.product_names) ? raw.product_names : [],
    patient_names: Array.isArray(raw.patient_names) ? raw.patient_names : [],
    address_id: raw.address_id ?? null,
    address: raw.address ?? null,
    invoice: raw.invoice ?? null,
    is_payment_pending: raw.is_payment_pending ?? null,
  };
}

export async function fetchCustomerBookings({
  customerId,
  token,
  limit = 100,
}: {
  customerId: string;
  token?: string | null;
  limit?: number;
}) {
  const encodedCustomerId = encodeURIComponent(customerId);
  const labPath = `/verticals/laboratory/customers/${encodedCustomerId}/bookings?limit=${limit}`;
  const ivPath = `/verticals/iv-drips/customers/${encodedCustomerId}/bookings?limit=${limit}`;

  const [lab, iv] = await Promise.allSettled([
    fetchJson<CustomerBookingsResponse>(labPath, token),
    fetchJson<CustomerBookingsResponse>(ivPath, token),
  ]);

  const failures = [lab, iv].filter((result) => result.status === "rejected");
  if (failures.length === 2) {
    throw new Error(
      failures[0].status === "rejected" && failures[0].reason instanceof Error
        ? failures[0].reason.message
        : "bookings_load_failed"
    );
  }

  const items = [
    ...(lab.status === "fulfilled" ? lab.value.items : []),
    ...(iv.status === "fulfilled" ? iv.value.items : []),
  ]
    .map(normalizeBooking)
    .filter((booking) => booking.order_id);

  return items.sort((left, right) => {
    const leftTime = parseBookingDate(left)?.getTime() ?? 0;
    const rightTime = parseBookingDate(right)?.getTime() ?? 0;
    return rightTime - leftTime;
  });
}

export async function fetchOrderDetail({
  orderId,
  vertical,
  token,
}: {
  orderId: string;
  vertical?: string | null;
  token?: string | null;
}) {
  const encodedOrderId = encodeURIComponent(orderId);
  const preferred = verticalPathFor(vertical);
  const paths = preferred
    ? [`${preferred}/orders/${encodedOrderId}`]
    : [
        `/verticals/laboratory/orders/${encodedOrderId}`,
        `/verticals/iv-drips/orders/${encodedOrderId}`,
      ];

  let lastError: unknown;
  for (const path of paths) {
    try {
      return await fetchJson<OrderDetail>(path, token);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error("order_detail_load_failed");
}

export function verticalPathFor(vertical?: string | null) {
  const key = String(vertical ?? "").toLowerCase();
  if (["iv", "iv-drips", "iv_drips"].includes(key)) return "/verticals/iv-drips";
  if (["lab", "laboratory"].includes(key)) return "/verticals/laboratory";
  return null;
}

export function parseDate(value?: string | null) {
  if (!value) return null;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? new Date(timestamp) : null;
}

export function parseBookingDate(booking: CustomerBooking) {
  return (
    parseDate(booking.start_at) ??
    parseDate(booking.created_at) ??
    parseDate(booking.paid_at)
  );
}

export function formatDateLabel(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);

  if (normalized.getTime() === today.getTime()) return "Today";
  if (normalized.getTime() === tomorrow.getTime()) return "Tomorrow";

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

export function formatShortDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatTimeRange(start?: string | null, end?: string | null) {
  const startDate = parseDate(start);
  const endDate = parseDate(end);
  if (!startDate) return "Time pending";

  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Dubai",
  });

  if (!endDate) return formatter.format(startDate);
  return `${formatter.format(startDate)} - ${formatter.format(endDate)}`;
}

export function bookingTitle(booking: CustomerBooking) {
  if (booking.product_names.length) return booking.product_names.join(", ");
  return booking.product_name || defaultVerticalTitle(booking.vertical);
}

export function bookingCustomerName(booking: CustomerBooking) {
  if (booking.patient_names.length) return booking.patient_names.join(", ");
  return "Customer";
}

export function bookingAddressLabel(address?: BookingAddress | null) {
  if (!address) return "Address pending";
  return [
    address.building_name,
    address.saved_name && address.saved_name !== address.building_name
      ? address.saved_name
      : null,
    address.area,
    address.city ?? address.emirate,
  ]
    .map((part) => String(part ?? "").trim())
    .filter(Boolean)
    .join(" · ") || "Address pending";
}

export function bookingFullAddressLabel(address?: BookingAddress | null) {
  if (!address) return "Address pending";
  return [
    address.building_name,
    address.floor_number ? `Floor ${address.floor_number}` : null,
    address.line1,
    address.area,
    address.city ?? address.emirate,
    address.country,
  ]
    .map((part) => String(part ?? "").trim())
    .filter(Boolean)
    .join(", ") || bookingAddressLabel(address);
}

export function formatMoneyFromFils(
  amountFils?: number | null,
  currency?: string | null
) {
  if (amountFils === null || amountFils === undefined) return "Amount pending";
  return `${currency || "AED"} ${(amountFils / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function verticalLabel(value?: string | null) {
  const key = String(value ?? "").toLowerCase();
  if (["lab", "laboratory"].includes(key)) return "LAB";
  if (["iv", "iv-drips", "iv_drips"].includes(key)) return "IV";
  return value || "Booking";
}

export function toBookingStatus(value?: string | null): BookingStatus {
  const raw = String(value ?? "").toUpperCase();
  switch (raw) {
    case "PENDING_PAYMENT":
      return "pending_payment";
    case "PAID":
      return "paid";
    case "ACTIVE":
    case "TRIALING":
    case "TRAILING":
      return "active";
    case "CREATED":
    case "CONFIRMED":
      return "upcoming";
    case "SAMPLE_COLLECTED":
    case "SAMPLE_DELIVERED":
    case "FULFILLED":
    case "REPORTS_AVAILABLE":
      return "in_progress";
    case "COMPLETED":
      return "completed";
    case "CANCELLED":
      return "cancelled";
    case "FAILED":
      return "failed";
    case "EXPIRED":
      return "expired";
    default:
      return "upcoming";
  }
}

export function statusDisplayLabel(value?: string | null) {
  const raw = String(value ?? "").trim();
  const normalized = raw.replace(/_/g, " ").trim();
  const uppercase = normalized.toUpperCase();
  if (uppercase === "TRIALING" || uppercase === "TRAILING") return "ACTIVE";
  if (!normalized) return "Active";
  return normalized
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function detailTitle(detail: OrderDetail, summary?: CustomerBooking | null) {
  if (summary) return bookingTitle(summary);
  if (Array.isArray(detail.product_names) && detail.product_names.length) {
    return detail.product_names.join(", ");
  }
  const cartNames = detail.cart?.patients
    ?.flatMap((patient) => [...(patient.items ?? []), ...(patient.tests ?? [])])
    .map((item) => item.display_name ?? item.product_name ?? item.name)
    .filter(Boolean);
  if (cartNames?.length) return cartNames.join(", ");
  return detail.product_name ?? detail.product_uuid ?? defaultVerticalTitle(detail.vertical);
}

export function detailCustomerName(detail: OrderDetail, summary?: CustomerBooking | null) {
  return (
    summary?.patient_names.join(", ") ||
    detail.patients?.map((patient) => patient.name ?? patient.member_name).filter(Boolean).join(", ") ||
    detail.cart?.patients?.map((patient) => patient.name ?? patient.member_name).filter(Boolean).join(", ") ||
    detail.customer?.full_name ||
    "Customer"
  );
}

function defaultVerticalTitle(vertical?: string | null) {
  const key = String(vertical ?? "").toLowerCase();
  if (["iv", "iv-drips", "iv_drips"].includes(key)) return "IV booking";
  if (["lab", "laboratory"].includes(key)) return "Lab booking";
  return "Booking";
}
