import { appendPulseAccountId } from "@/lib/pulse-account-selector";

export type PulseMemberOption = {
  customerId: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  createdAt?: string | null;
};

type AdminCustomerRow = {
  customer_id?: string | null;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  created_at?: string | null;
};

type AdminCustomersResponse = {
  items?: AdminCustomerRow[];
  total?: number | null;
  error?: string;
  detail?: string;
};

function cleanString(value: unknown) {
  const text = String(value ?? "").trim();
  return text || null;
}

function normalizeMember(row: AdminCustomerRow): PulseMemberOption | null {
  const customerId = cleanString(row.customer_id);
  if (!customerId) return null;

  const name = cleanString(row.full_name) || cleanString(row.email) || cleanString(row.phone) || customerId;

  return {
    customerId,
    name,
    phone: cleanString(row.phone),
    email: cleanString(row.email),
    createdAt: cleanString(row.created_at),
  };
}

export async function fetchPulseMembers({
  query = "",
  accountId,
  limit = 100,
}: {
  query?: string;
  accountId?: string | null;
  limit?: number;
}) {
  const search = new URLSearchParams({
    page: "1",
    limit: String(limit),
  });
  const trimmedQuery = query.trim();
  if (trimmedQuery) search.set("q", trimmedQuery);

  const response = await fetch(
    appendPulseAccountId(`/api/backend/admin/customers?${search.toString()}`, accountId),
    {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    }
  );

  const payload = (await response.json().catch(() => null)) as AdminCustomersResponse | null;
  if (!response.ok) {
    throw new Error(payload?.error || payload?.detail || `members_${response.status}`);
  }

  return {
    members: (payload?.items ?? []).map(normalizeMember).filter((member): member is PulseMemberOption => Boolean(member)),
    total: Number(payload?.total ?? 0),
  };
}
