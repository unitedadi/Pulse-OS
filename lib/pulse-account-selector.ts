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

export type PulseKnownAccount = {
  account_id: string;
  seller_id: string;
  display_name: string;
};

export const PULSE_KNOWN_B2B_ACCOUNTS: PulseKnownAccount[] = [
  { account_id: "mp_dardoc", seller_id: "SELLER_dardoc", display_name: "DarDoc" },
  { account_id: "mp_demo_b2b_partner", seller_id: "SELLER_dardoc", display_name: "DarDoc" },
  { account_id: "mp_kiva_wellness", seller_id: "seller_5d9a01c8f501", display_name: "Kiva Wellness" },
  { account_id: "mp_cyan", seller_id: "seller_5d68c3205b06", display_name: "Cyan" },
  { account_id: "mp_free_soul", seller_id: "seller_821dbc801786", display_name: "Free Soul" },
  { account_id: "mp_free_soul_org", seller_id: "seller_821dbc801786", display_name: "Free Soul" },
  { account_id: "mp_method_studio", seller_id: "seller_4e5f546eeac2", display_name: "Method Studio" },
  { account_id: "mp_the_method_studio", seller_id: "seller_4e5f546eeac2", display_name: "Method Studio" },
  { account_id: "mp_dr_elie", seller_id: "seller_dab522c6f350", display_name: "Dr.Elie" },
  { account_id: "mp_revive", seller_id: "seller_8c670d20e6ea", display_name: "Revive" },
  { account_id: "mp_inspire_sports", seller_id: "seller_d46df83a306f", display_name: "Inspire Sports" },
];

const LEGACY_WORKSPACE_ALIASES_BY_SELLER_ID: Record<string, string[]> = {
  SELLER_dardoc: ["DarDoc", "Demo B2B Partner"],
  seller_655656ac86b8: ["DarDoc Seller"],
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

export function getKnownPulseAccountById(accountId: string | null | undefined) {
  const normalized = normalizePulseAccountId(accountId);
  if (!normalized) return null;
  return PULSE_KNOWN_B2B_ACCOUNTS.find((account) => account.account_id === normalized) ?? null;
}

export function getPreferredPulseAccountIdForSeller(
  seller: Pick<PulseWorkspaceSummary, "seller_display_name" | "seller_id">
) {
  const known = PULSE_KNOWN_B2B_ACCOUNTS.find((account) => account.seller_id === seller.seller_id);
  if (known) return known.account_id;
  return pulseAccountIdsForWorkspace(seller)[0] ?? null;
}

export function pulseAccountIdsForWorkspace(workspace: Pick<PulseWorkspaceSummary, "seller_display_name" | "seller_id">) {
  const names = new Set<string>();
  const displayName = String(workspace.seller_display_name ?? "").trim();
  const sellerId = String(workspace.seller_id ?? "").trim();

  for (const account of PULSE_KNOWN_B2B_ACCOUNTS) {
    if (account.seller_id === sellerId) names.add(account.account_id.replace(/^mp_/, ""));
  }

  if (displayName) {
    names.add(displayName);
    names.add(displayName.replace(/^the\s+/i, ""));
    names.add(displayName.endsWith("Org") ? displayName : `${displayName} Org`);
  }
  if (sellerId) names.add(sellerId);
  for (const alias of LEGACY_WORKSPACE_ALIASES_BY_SELLER_ID[sellerId] ?? []) {
    names.add(alias);
  }

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
