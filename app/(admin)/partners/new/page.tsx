"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Beaker,
  Building2,
  CheckCircle2,
  Copy,
  FlaskConical,
  Loader2,
  Mail,
  PackageCheck,
  ShieldCheck,
} from "lucide-react";
import { Badge, Button, Card, Input } from "@/components/ui";
import { onboardPulsePartner, type PulsePartnerOnboardResponse } from "@/lib/api/pulse-partners";
import { cn } from "@/lib/utils";

type EligibilityKey = "iv" | "lab";

const ELIGIBILITY_OPTIONS: Array<{
  key: EligibilityKey;
  title: string;
  description: string;
  icon: React.ReactNode;
}> = [
  {
    key: "iv",
    title: "IV drips",
    description: "Seeds all B2B IV products, package offers, and the 25% seller commission.",
    icon: <Beaker className="h-5 w-5" />,
  },
  {
    key: "lab",
    title: "Lab tests",
    description: "Seeds all B2B lab packages and lab seller commission terms.",
    icon: <FlaskConical className="h-5 w-5" />,
  },
];

function emailsFromText(value: string) {
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

function setupCount(label: string, value: number | boolean) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/45 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.05em] text-[var(--color-text-muted)]">{label}</p>
      <p className="mt-1 text-lg text-[var(--color-text-primary)]">
        {typeof value === "boolean" ? (value ? "Ready" : "Skipped") : value}
      </p>
    </div>
  );
}

export default function NewPartnerPage() {
  const router = useRouter();
  const [partnerName, setPartnerName] = React.useState("");
  const [inviteEmails, setInviteEmails] = React.useState("");
  const [eligibility, setEligibility] = React.useState<Record<EligibilityKey, boolean>>({
    iv: true,
    lab: true,
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<PulsePartnerOnboardResponse | null>(null);
  const [copied, setCopied] = React.useState(false);

  const parsedEmails = React.useMemo(() => emailsFromText(inviteEmails), [inviteEmails]);
  const invalidEmails = parsedEmails.filter((email) => !isEmail(email));
  const pulseUrl = result ? `https://www.pulsehealthuae.com/dashboard?account_id=${result.account_id}` : null;

  const toggleEligibility = (key: EligibilityKey) => {
    setEligibility((current) => ({ ...current, [key]: !current[key] }));
  };

  const copyPulseUrl = async () => {
    if (!pulseUrl) return;
    await navigator.clipboard.writeText(pulseUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
    if (!parsedEmails.length) {
      setError("Enter at least one invite email.");
      return;
    }
    if (invalidEmails.length) {
      setError(`Invalid email: ${invalidEmails[0]}`);
      return;
    }

    setSubmitting(true);
    try {
      const payload = await onboardPulsePartner({
        name,
        eligible_for_iv: eligibility.iv,
        eligible_for_lab: eligibility.lab,
        invite_emails: parsedEmails,
      });
      setResult(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "partner_onboarding_failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl pb-20">
      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-bg-card)] px-4 py-2 text-sm text-[var(--color-text-secondary)] shadow-[var(--shadow-xs)] transition-colors hover:text-[var(--color-text-primary)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to partners
          </button>
          <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)]">Pulse setup</p>
          <h1 className="mt-2 text-4xl font-normal text-[var(--color-text-primary)]">Create B2B partner</h1>
          <p className="mt-2 max-w-2xl text-[var(--color-text-secondary)]">
            This creates the seller, attaches the customer profile used by checkout, seeds selected B2B products, and queues the Pulse invite.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <Card padding="lg">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-accent-glow)] text-[var(--color-accent-primary)]">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl text-[var(--color-text-primary)]">Partner details</h2>
                <p className="text-sm text-[var(--color-text-muted)]">Use the public business name the team recognizes.</p>
              </div>
            </div>
            <Input
              label="Partner name"
              placeholder="Example: Ikigai"
              value={partnerName}
              onChange={(event) => setPartnerName(event.target.value)}
              required
            />
          </Card>

          <Card padding="lg">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-success-light)] text-[var(--color-success)]">
                <PackageCheck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl text-[var(--color-text-primary)]">Eligible products</h2>
                <p className="text-sm text-[var(--color-text-muted)]">The backend copies the approved B2B catalog and commission setup.</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {ELIGIBILITY_OPTIONS.map((option) => {
                const selected = eligibility[option.key];
                return (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => toggleEligibility(option.key)}
                    className={cn(
                      "rounded-[var(--radius-xl)] border p-5 text-left transition-all",
                      selected
                        ? "border-[var(--color-accent-primary)] bg-[var(--color-accent-glow)] shadow-[var(--shadow-sm)]"
                        : "border-[var(--color-border-subtle)] bg-[var(--color-bg-card)] hover:border-[var(--color-border-hover)]"
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-bg-secondary)] text-[var(--color-accent-primary)]">
                        {option.icon}
                      </div>
                      <span
                        className={cn(
                          "flex h-5 w-5 items-center justify-center rounded-full border",
                          selected
                            ? "border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)] text-[var(--color-text-inverse)]"
                            : "border-[var(--color-border-default)]"
                        )}
                      >
                        {selected ? <CheckCircle2 className="h-3.5 w-3.5" /> : null}
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg text-[var(--color-text-primary)]">{option.title}</h3>
                    <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{option.description}</p>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border-default)] bg-[var(--color-bg-secondary)]/35 px-4 py-3 text-sm text-[var(--color-text-muted)]">
              Peptides and weight loss are intentionally not enabled from this screen yet.
            </div>
          </Card>

          <Card padding="lg">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-info-light)] text-[var(--color-info)]">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl text-[var(--color-text-primary)]">Invite access</h2>
                <p className="text-sm text-[var(--color-text-muted)]">Add one or more admins. Separate emails with commas, spaces, or new lines.</p>
              </div>
            </div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)]">
              Invite emails <span className="text-[var(--color-error)]">*</span>
            </label>
            <textarea
              value={inviteEmails}
              onChange={(event) => setInviteEmails(event.target.value)}
              placeholder="info@partner.ae"
              className="mt-1.5 min-h-28 w-full rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-bg-card)] px-3 py-3 text-base text-[var(--color-text-primary)] shadow-[var(--shadow-xs)] outline-none transition-all placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-border-focus)] focus:shadow-[var(--shadow-focus)]"
              required
            />
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              {parsedEmails.length ? `${parsedEmails.length} invite${parsedEmails.length === 1 ? "" : "s"} will be queued.` : "At least one email is required."}
            </p>
          </Card>
        </div>

        <div className="space-y-6">
          <Card padding="lg" className="sticky top-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-success-light)] text-[var(--color-success)]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg text-[var(--color-text-primary)]">Safety checklist</h2>
                <p className="text-sm text-[var(--color-text-muted)]">Done by the API</p>
              </div>
            </div>
            <div className="space-y-3 text-sm text-[var(--color-text-secondary)]">
              <p>Creates or reuses the seller by name.</p>
              <p>Creates the attached checkout customer profile.</p>
              <p>Copies selected IV and Lab products from DarDoc.</p>
              <p>Queues Pulse invites and reports failures inline.</p>
            </div>

            {error ? (
              <div className="mt-5 rounded-[var(--radius-lg)] bg-[var(--color-error-light)] px-4 py-3 text-sm text-[var(--color-error)]">
                {error}
              </div>
            ) : null}

            <Button type="submit" className="mt-6 w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating partner
                </>
              ) : (
                "Create and invite"
              )}
            </Button>
          </Card>
        </div>
      </form>

      {result ? (
        <Card padding="lg" className="mt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl text-[var(--color-text-primary)]">{result.seller.display_name}</h2>
                <Badge variant={result.seller.reused ? "warning" : "success"}>{result.seller.reused ? "Existing seller updated" : "New seller created"}</Badge>
              </div>
              <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                Seller: {result.seller.seller_id} · Customer: {result.seller.customer_id} · Account: {result.account_id}
              </p>
            </div>
            {pulseUrl ? (
              <Button type="button" variant="accent" onClick={copyPulseUrl} leftIcon={<Copy className="h-4 w-4" />}>
                {copied ? "Copied" : "Copy Pulse URL"}
              </Button>
            ) : null}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {setupCount("Vertical links", result.setup.vertical_product_links.upserted_count)}
            {setupCount("IV offers", result.setup.iv_offers.upserted_count)}
            {setupCount("IV bundles", result.setup.iv_offers.bundle_upserted_count)}
            {setupCount("Lab terms", result.setup.lab_terms.upserted_count)}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div>
              <h3 className="text-sm uppercase tracking-[0.08em] text-[var(--color-text-muted)]">Invites</h3>
              <div className="mt-3 space-y-2">
                {result.invites.map((invite) => (
                  <div
                    key={invite.email}
                    className="flex items-center justify-between gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/35 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm text-[var(--color-text-primary)]">{invite.email}</p>
                      {invite.error ? <p className="mt-1 text-xs text-[var(--color-error)]">{invite.error}</p> : null}
                    </div>
                    <Badge variant={invite.status === "FAILED" ? "error" : "success"} size="sm">
                      {invite.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm uppercase tracking-[0.08em] text-[var(--color-text-muted)]">Open portal</h3>
              <div className="mt-3 rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/35 px-4 py-3">
                <p className="break-all text-sm text-[var(--color-text-primary)]">{pulseUrl}</p>
                <Link href={`/dashboard?account_id=${result.account_id}`} className="mt-3 inline-flex text-sm text-[var(--color-accent-primary)] underline">
                  Preview inside Pulse
                </Link>
              </div>
              {result.warnings.length ? (
                <div className="mt-3 rounded-[var(--radius-lg)] bg-[var(--color-warning-light)] px-4 py-3 text-sm text-[var(--color-warning)]">
                  {result.warnings.join(", ")}
                </div>
              ) : null}
            </div>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
