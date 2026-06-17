"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  ChevronRight,
  CircleAlert,
  Copy,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";
import { Badge, Button, Card, EmptyState, SearchInput } from "@/components/ui";
import { fetchPulsePartners, type PulseSellerSummary } from "@/lib/api/pulse-partners";
import { getPreferredPulseAccountIdForSeller } from "@/lib/pulse-account-selector";

function configuredVerticals(partner: PulseSellerSummary) {
  const verticals = partner.verticals?.configured ?? [];
  return verticals.map((vertical) => {
    if (vertical === "iv-drips") return "IV";
    if (vertical === "laboratory") return "Lab";
    return vertical;
  });
}

function partnerMatchesSearch(partner: PulseSellerSummary, query: string) {
  if (!query.trim()) return true;
  const normalized = query.trim().toLowerCase();
  return (
    partner.display_name.toLowerCase().includes(normalized) ||
    partner.seller_id.toLowerCase().includes(normalized) ||
    (partner.customer_id ?? "").toLowerCase().includes(normalized)
  );
}

export default function PartnersPage() {
  const router = useRouter();
  const [partners, setPartners] = React.useState<PulseSellerSummary[]>([]);
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const loadPartners = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = await fetchPulsePartners();
      setPartners(payload.items ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "partners_load_failed");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadPartners();
  }, [loadPartners]);

  const filteredPartners = React.useMemo(
    () => partners.filter((partner) => partnerMatchesSearch(partner, query)),
    [partners, query]
  );

  const activeCount = partners.filter((partner) => partner.status === "ACTIVE").length;
  const workspaceCount = partners.filter((partner) => partner.workspace?.workspace_id).length;
  const pendingInviteCount = partners.reduce((sum, partner) => sum + Number(partner.workspace?.pending_jobs ?? 0), 0);

  const copyAccountId = async (partner: PulseSellerSummary) => {
    const accountId =
      getPreferredPulseAccountIdForSeller({
        seller_id: partner.seller_id,
        seller_display_name: partner.display_name,
      }) ?? "";
    if (!accountId) return;
    await navigator.clipboard.writeText(accountId);
    setCopiedId(partner.seller_id);
    window.setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="max-w-6xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)]">Pulse admin</p>
          <h1 className="mt-2 text-5xl font-normal text-[var(--color-text-primary)]">Partners</h1>
          <p className="mt-2 max-w-2xl text-[var(--color-text-secondary)]">
            Create Pulse B2B partners, attach the checkout customer profile, seed products, and invite admins from one place.
          </p>
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="accent" onClick={() => void loadPartners()} disabled={loading} leftIcon={<RefreshCw className="h-4 w-4" />}>
            Refresh
          </Button>
          <Button type="button" onClick={() => router.push("/partners/new")} leftIcon={<Plus className="h-4 w-4" />}>
            Create partner
          </Button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Card padding="md">
          <p className="text-sm text-[var(--color-text-muted)]">Active sellers</p>
          <p className="mt-2 text-3xl text-[var(--color-text-primary)]">{activeCount}</p>
        </Card>
        <Card padding="md">
          <p className="text-sm text-[var(--color-text-muted)]">Pulse workspaces</p>
          <p className="mt-2 text-3xl text-[var(--color-text-primary)]">{workspaceCount}</p>
        </Card>
        <Card padding="md">
          <p className="text-sm text-[var(--color-text-muted)]">Pending invite jobs</p>
          <p className="mt-2 text-3xl text-[var(--color-text-primary)]">{pendingInviteCount}</p>
        </Card>
      </div>

      <Card padding="lg">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl text-[var(--color-text-primary)]">Seller directory</h2>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              {loading ? "Loading partners..." : `${filteredPartners.length} of ${partners.length} sellers shown`}
            </p>
          </div>
          <SearchInput value={query} onChange={setQuery} placeholder="Search by name, seller id, customer id..." className="sm:w-[360px]" />
        </div>

        {error ? (
          <div className="flex items-start gap-3 rounded-[var(--radius-lg)] bg-[var(--color-error-light)] px-4 py-3 text-[var(--color-error)]">
            <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="text-sm">Could not load Pulse partners.</p>
              <p className="mt-1 text-sm opacity-80">{error}</p>
            </div>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center gap-3 py-16 text-[var(--color-text-muted)]">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading partner setup
          </div>
        ) : filteredPartners.length === 0 ? (
          <EmptyState
            icon={query ? <Search className="h-7 w-7 text-[var(--color-text-muted)]" /> : <Building2 className="h-7 w-7 text-[var(--color-text-muted)]" />}
            title={query ? "No matching partners" : "No partners found"}
            description={query ? "Try another name or seller ID." : "Create a Pulse partner to seed products and send the first invite."}
            action={!query ? { label: "Create partner", onClick: () => router.push("/partners/new") } : undefined}
          />
        ) : (
          <div className="divide-y divide-[var(--color-border-subtle)]">
            {filteredPartners.map((partner) => {
              const verticals = configuredVerticals(partner);
              const memberCount = Number(partner.workspace?.member_count ?? 0);
              const pendingJobs = Number(partner.workspace?.pending_jobs ?? 0);
              return (
                <div key={partner.seller_id} className="flex items-center gap-4 py-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-bg-secondary)] text-[var(--color-accent-primary)]">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-lg text-[var(--color-text-primary)]">{partner.display_name}</h3>
                      <Badge variant={partner.status === "ACTIVE" ? "success" : "default"} size="sm">
                        {partner.status}
                      </Badge>
                      {verticals.map((vertical) => (
                        <Badge key={vertical} variant="info" size="sm">
                          {vertical}
                        </Badge>
                      ))}
                    </div>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                      {partner.seller_id}
                      {partner.customer_id ? ` · customer ${partner.customer_id}` : ""}
                    </p>
                  </div>
                  <div className="hidden min-w-[180px] text-right text-sm text-[var(--color-text-secondary)] md:block">
                    <p className="inline-flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {memberCount} member{memberCount === 1 ? "" : "s"}
                    </p>
                    <p className="mt-1 text-[var(--color-text-muted)]">{pendingJobs} pending invite job{pendingJobs === 1 ? "" : "s"}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void copyAccountId(partner)}
                    className="rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-bg-card)] px-3 py-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Copy className="h-4 w-4" />
                      {copiedId === partner.seller_id ? "Copied" : "mp id"}
                    </span>
                  </button>
                  <ChevronRight className="hidden h-5 w-5 text-[var(--color-text-soft)] sm:block" />
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
