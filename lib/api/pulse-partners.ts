export type PulseSellerSummary = {
  seller_id: string;
  display_name: string;
  status: "ACTIVE" | "INACTIVE" | string;
  customer_id?: string | null;
  verticals?: {
    configured?: string[];
    product_count?: number;
  };
  workspace?: {
    workspace_id?: number | null;
    clerk_org_id?: string | null;
    member_count?: number | null;
    pending_jobs?: number | null;
  };
  created_at?: string | null;
  updated_at?: string | null;
};

export type PulsePartnersResponse = {
  items: PulseSellerSummary[];
  total_count: number;
  limit: number;
  offset: number;
};

export type PulsePartnerOnboardInput = {
  name: string;
  eligible_for_iv: boolean;
  eligible_for_lab: boolean;
  invite_emails: string[];
};

export type PulsePartnerOnboardResponse = {
  seller: {
    seller_id: string;
    display_name: string;
    status: "ACTIVE";
    customer_id: string;
    reused: boolean;
  };
  account_id: string;
  source_seller_id: string;
  eligibility: {
    iv_drips: boolean;
    laboratory: boolean;
  };
  setup: {
    vertical_product_links: {
      selected_count: number;
      upserted_count: number;
      skipped_existing_count: number;
    };
    iv_offers: {
      selected_count: number;
      upserted_count: number;
      skipped_existing_count: number;
      bundle_upserted_count: number;
    };
    lab_terms: {
      profile_cloned: boolean;
      selected_count: number;
      upserted_count: number;
      skipped_existing_count: number;
    };
  };
  invites: Array<{
    email: string;
    status: "QUEUED" | "SENT" | "FAILED" | "ALREADY_EXISTS" | "ACCEPTED" | "REVOKED";
    workspace_id: number;
    clerk_org_id: string | null;
    queue_job_id: number | null;
    error?: string | null;
    detail?: string | null;
  }>;
  warnings: string[];
};

type BackendErrorPayload = {
  error?: string;
  detail?: string;
  details?: unknown;
};

async function readBackendPayload<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => null)) as (T & BackendErrorPayload) | null;

  if (!response.ok) {
    const detail =
      payload?.detail ||
      payload?.error ||
      (payload?.details ? JSON.stringify(payload.details) : null) ||
      `request_failed_${response.status}`;
    throw new Error(detail);
  }

  if (!payload) throw new Error("empty_backend_response");
  return payload;
}

export async function fetchPulsePartners() {
  const response = await fetch("/api/backend/ops/sellers?limit=500&status=ACTIVE", {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "ngrok-skip-browser-warning": "1",
    },
  });

  return readBackendPayload<PulsePartnersResponse>(response);
}

export async function onboardPulsePartner(input: PulsePartnerOnboardInput) {
  const response = await fetch("/api/backend/ops/sellers/pulse-onboard", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "1",
    },
    body: JSON.stringify(input),
  });

  return readBackendPayload<PulsePartnerOnboardResponse>(response);
}
