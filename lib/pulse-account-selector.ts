export const PULSE_ACCOUNT_SELECTOR_STORAGE_KEY = "pulse_os_account_id";
export const PULSE_ACCOUNT_SELECTOR_COOKIE_NAME = "pulse_os_account_id";

export type PulseWorkspaceSummary = {
  workspace_id: number;
  seller_id: string;
  clerk_org_id: string;
  seller_display_name: string;
  seller_status: string;
  member_count: number;
};

export function normalizePulseAccountId(value: string | null | undefined) {
  const text = String(value ?? "").trim().toLowerCase();
  return text.startsWith("mp_") ? text : "";
}

export function slugifyPulseAccountName(value: string) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function pulseAccountIdsForWorkspace(workspace: Pick<PulseWorkspaceSummary, "seller_display_name" | "seller_id">) {
  const names = new Set<string>();
  const displayName = String(workspace.seller_display_name ?? "").trim();
  const sellerId = String(workspace.seller_id ?? "").trim();

  if (displayName) {
    names.add(displayName);
    names.add(displayName.replace(/^the\s+/i, ""));
    names.add(displayName.endsWith("Org") ? displayName : `${displayName} Org`);
  }
  if (sellerId) names.add(sellerId);

  return Array.from(names)
    .map((name) => slugifyPulseAccountName(name))
    .filter(Boolean)
    .map((slug) => `mp_${slug}`);
}

export function appendPulseAccountId(href: string, accountId: string | null | undefined) {
  const normalized = normalizePulseAccountId(accountId);
  if (!normalized) return href;

  const [path, hash = ""] = href.split("#");
  const separator = path.includes("?") ? "&" : "?";
  const next = `${path}${separator}account_id=${encodeURIComponent(normalized)}`;
  return hash ? `${next}#${hash}` : next;
}
