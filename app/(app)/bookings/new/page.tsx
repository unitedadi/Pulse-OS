"use client";

import * as React from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Copy, Droplet, ExternalLink, FlaskConical, Pill, Search, UserRoundPlus, X } from "lucide-react";

import { useImmersiveMode, usePartnerContext } from "@/components/layouts";
import { Button } from "@/components/ui";
import { createPulseCheckoutIntent } from "@/lib/api/pulse-checkout";
import { fetchPulseMembers, type PulseMemberOption } from "@/lib/api/pulse-members";
import { appendPulseAccountId } from "@/lib/pulse-account-selector";
import { isDardocPulseSeller } from "@/lib/pulse-sellers";
import {
  fetchSellerProductsForVertical,
  fetchSellerVerticals,
  type PulseCatalogProduct,
  type PulseVerticalId,
  type PulseVerticalOption,
} from "@/lib/api/pulse-catalog";
import { cn } from "@/lib/utils";

const VERTICAL_ICONS: Record<PulseVerticalId, typeof Droplet> = {
  "iv-drips": Droplet,
  laboratory: FlaskConical,
  peptides: Pill,
};

function formatAed(amount: number) {
  return `AED ${amount.toLocaleString("en-AE", { maximumFractionDigits: 2 })}`;
}

function checkoutUrlForCurrentEnvironment(checkoutUrl: string) {
  const overrideBaseUrl =
    process.env.NEXT_PUBLIC_CHECKOUT_BASE_URL ??
    "https://checkout.dardoc.com";

  if (!overrideBaseUrl) return checkoutUrl;

  const sourceUrl = new URL(checkoutUrl);
  const targetBaseUrl = new URL(overrideBaseUrl);

  return `${targetBaseUrl.origin}${sourceUrl.pathname}${sourceUrl.search}${sourceUrl.hash}`;
}

function DetailBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-[var(--color-border-subtle)] pt-5">
      <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-soft)]">{title}</p>
      {children}
    </div>
  );
}

function DetailRows({
  rows,
}: {
  rows: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="divide-y divide-[var(--color-border-subtle)] overflow-hidden rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)]">
      {rows.map((row) => (
        <div key={`${row.label}-${row.value}`} className="grid grid-cols-[120px_1fr] gap-3 px-3 py-2.5 text-sm">
          <p className="text-[var(--color-text-muted)]">{row.label}</p>
          <p className="text-[var(--color-text-primary)]">{row.value}</p>
        </div>
      ))}
    </div>
  );
}

function memberMeta(member: PulseMemberOption) {
  return [member.phone, member.email].filter(Boolean).join(" · ");
}

function MemberSelector({
  members,
  loading,
  error,
  query,
  selectedMember,
  onQueryChange,
  onSelect,
  onRetry,
}: {
  members: PulseMemberOption[];
  loading: boolean;
  error: string | null;
  query: string;
  selectedMember: PulseMemberOption | null;
  onQueryChange: (value: string) => void;
  onSelect: (member: PulseMemberOption) => void;
  onRetry: () => void;
}) {
  return (
    <section className="mb-8 overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/45">
      <div className="grid gap-5 p-5 lg:grid-cols-[320px_1fr]">
        <div>
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-accent-primary)] text-[var(--color-text-inverse)]">
            <UserRoundPlus className="h-5 w-5" />
          </div>
          <p className="mt-4 text-[11px] uppercase tracking-[0.2em] text-[var(--color-text-soft)]">Book on behalf</p>
          <h2 className="mt-2 text-2xl leading-tight text-[var(--color-text-primary)]">Choose registered member</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
            The checkout link will be created for this customer. They will finish member, address, slot, wallet, promo, and payment on checkout.
          </p>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              type="text"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search by name, phone, email, or customer ID"
              className="h-12 w-full rounded-full border border-[var(--color-border-default)] bg-[var(--color-bg-card)] pl-11 pr-4 text-sm text-[var(--color-text-primary)] shadow-[var(--shadow-xs)] transition-colors placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-border-focus)]"
              style={{ outline: "none" }}
            />
          </div>

          <div className="max-h-[280px] overflow-y-auto rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)]">
            {loading ? (
              <div className="px-4 py-6 text-sm text-[var(--color-text-muted)]">Loading registered members...</div>
            ) : error ? (
              <div className="flex items-center justify-between gap-3 px-4 py-5">
                <p className="text-sm text-[var(--color-error)]">{error}</p>
                <Button size="sm" variant="ghost" onClick={onRetry}>
                  Retry
                </Button>
              </div>
            ) : members.length === 0 ? (
              <div className="px-4 py-6 text-sm text-[var(--color-text-muted)]">No registered members found.</div>
            ) : (
              <div className="divide-y divide-[var(--color-border-subtle)]">
                {members.map((member) => {
                  const selected = selectedMember?.customerId === member.customerId;
                  return (
                    <button
                      key={member.customerId}
                      type="button"
                      onClick={() => onSelect(member)}
                      className={cn(
                        "grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 text-left transition-colors",
                        selected ? "bg-[var(--color-accent-primary)]/10" : "hover:bg-[var(--color-bg-secondary)]/70"
                      )}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm text-[var(--color-text-primary)]">{member.name}</p>
                        <p className="mt-0.5 truncate text-xs text-[var(--color-text-muted)]">
                          {memberMeta(member) || member.customerId}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-full border transition-colors",
                          selected
                            ? "border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)] text-[var(--color-text-inverse)]"
                            : "border-[var(--color-border-default)] text-transparent"
                        )}
                      >
                        <Check className="h-4 w-4" />
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function CheckoutLinkPanel({
  url,
  expiresAt,
  total,
  member,
}: {
  url: string;
  expiresAt?: string | null;
  total: number;
  member: PulseMemberOption | null;
}) {
  const [copied, setCopied] = React.useState(false);
  const expiryDate = expiresAt ? new Date(expiresAt) : null;
  const expiryLabel =
    expiryDate && Number.isFinite(expiryDate.getTime())
      ? expiryDate.toLocaleString("en-AE", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })
      : "Not provided";

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section className="mb-8 rounded-2xl border border-[var(--color-accent-primary)]/20 bg-[rgba(23,59,61,0.04)] p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-text-soft)]">Checkout link ready</p>
          <h2 className="mt-2 text-xl text-[var(--color-text-primary)]">
            {member ? `For ${member.name}` : "Generated checkout link"}
          </h2>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Total {formatAed(total)} · Expires {expiryLabel}
          </p>
          <p className="mt-3 truncate rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-bg-card)] px-4 py-2 font-mono text-xs text-[var(--color-text-secondary)]">
            {url}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="accent" onClick={copyLink} leftIcon={copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}>
            {copied ? "Copied" : "Copy link"}
          </Button>
          <Button variant="primary" onClick={() => window.open(url, "_blank")} rightIcon={<ExternalLink className="h-4 w-4" />}>
            Open checkout
          </Button>
        </div>
      </div>
    </section>
  );
}

function ProductDetails({
  product,
}: {
  product: PulseCatalogProduct | null;
}) {
  if (!product) {
    return (
      <aside className="rounded-2xl border border-dashed border-[var(--color-border-default)] p-8 text-center">
        <p className="text-sm text-[var(--color-text-muted)]">Select a product to review details.</p>
      </aside>
    );
  }

  const highlights = product.highlights ?? [];
  const ingredients = product.ingredients ?? [];
  const biomarkers = product.biomarkers ?? [];
  const categoryTags = product.categoryTags ?? [];
  const specs = product.specs ?? [];
  const fullSpecs = product.fullSpecs ?? [];
  const clinical = product.clinical ?? [];
  const faqs = product.faqs ?? [];
  const bundleOffers = product.bundleOffers ?? [];

  return (
    <aside className="overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/45">
      <div className="border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)] p-5">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">{product.category}</p>
        <h2 className="mt-2 text-2xl leading-tight text-[var(--color-text-primary)]">{product.name}</h2>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)] px-3 py-1.5 text-[var(--color-text-primary)]">
            {formatAed(product.price)}
          </span>
          <span className="rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)] px-3 py-1.5 text-[var(--color-text-secondary)]">
            {product.duration}
          </span>
          {product.rating && (
            <span className="rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)] px-3 py-1.5 text-[var(--color-text-secondary)]">
              {product.rating.stars.toFixed(1)} rating
              {product.rating.reviewCount ? ` · ${product.rating.reviewCount} reviews` : ""}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div>
          <p className="text-sm leading-6 text-[var(--color-text-muted)]">{product.description}</p>
          {product.subtitle && product.subtitle !== product.description && (
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-soft)]">{product.subtitle}</p>
          )}
        </div>

        {categoryTags.length > 0 && (
          <DetailBlock title="Categories">
            <div className="flex flex-wrap gap-2">
              {categoryTags.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-[var(--color-bg-primary)] px-3 py-1 text-xs text-[var(--color-text-secondary)]"
                >
                  {item}
                </span>
              ))}
            </div>
          </DetailBlock>
        )}

        {specs.length > 0 && (
          <DetailBlock title="Specs">
            <DetailRows rows={specs} />
          </DetailBlock>
        )}

        {highlights.length > 0 && (
          <DetailBlock title="Key benefits">
            <div className="space-y-2">
              {highlights.map((item) => (
                <div key={item} className="flex gap-2 text-sm text-[var(--color-text-primary)]">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--color-accent-primary)]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </DetailBlock>
        )}

        {ingredients.length > 0 && (
          <DetailBlock title="Ingredients">
            <div className="space-y-2">
              {ingredients.map((item) => (
                <div key={`${item.title}-${item.detail ?? ""}`} className="text-sm">
                  <p className="text-[var(--color-text-primary)]">{item.title}</p>
                  {item.detail && <p className="text-xs text-[var(--color-text-muted)]">{item.detail}</p>}
                </div>
              ))}
            </div>
          </DetailBlock>
        )}

        {biomarkers.length > 0 && (
          <DetailBlock title="Biomarkers">
            <div className="flex flex-wrap gap-2">
              {biomarkers.slice(0, 20).map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-[var(--color-bg-primary)] px-3 py-1 text-xs text-[var(--color-text-secondary)]"
                >
                  {item}
                </span>
              ))}
              {biomarkers.length > 20 && (
                <span className="rounded-full bg-[var(--color-bg-primary)] px-3 py-1 text-xs text-[var(--color-text-muted)]">
                  +{biomarkers.length - 20} more
                </span>
              )}
            </div>
          </DetailBlock>
        )}

        {product.howItWorks && (
          <DetailBlock title="How it works">
            <p className="text-sm leading-6 text-[var(--color-text-muted)]">{product.howItWorks}</p>
          </DetailBlock>
        )}

        {fullSpecs.length > 0 && (
          <DetailBlock title="Full specs">
            <DetailRows rows={fullSpecs} />
          </DetailBlock>
        )}

        {clinical.length > 0 && (
          <DetailBlock title="Clinical requirements">
            <DetailRows rows={clinical} />
          </DetailBlock>
        )}

        {product.recommendedUse && (
          <DetailBlock title="Recommended use">
            <p className="text-sm leading-6 text-[var(--color-text-muted)]">{product.recommendedUse}</p>
          </DetailBlock>
        )}

        {product.prepare && (
          <DetailBlock title="How to prepare">
            <p className="text-sm leading-6 text-[var(--color-text-muted)]">{product.prepare}</p>
          </DetailBlock>
        )}

        {product.safety && (
          <DetailBlock title="Safety information">
            <p className="text-sm leading-6 text-[var(--color-text-muted)]">{product.safety}</p>
          </DetailBlock>
        )}

        {product.safetyDisclaimer && product.safetyDisclaimer !== product.safety && (
          <DetailBlock title="Safety disclaimer">
            <p className="text-sm leading-6 text-[var(--color-text-muted)]">{product.safetyDisclaimer}</p>
          </DetailBlock>
        )}

        {faqs.length > 0 && (
          <DetailBlock title="FAQs">
            <div className="space-y-4">
              {faqs.slice(0, 4).map((item) => (
                <div key={item.question}>
                  <p className="text-sm text-[var(--color-text-primary)]">{item.question}</p>
                  <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">{item.answer}</p>
                </div>
              ))}
            </div>
          </DetailBlock>
        )}

        {bundleOffers.length > 0 && (
          <DetailBlock title="Bundle offers">
            <div className="space-y-2">
              {bundleOffers.map((offer) => (
                <div
                  key={`${offer.label}-${offer.price}`}
                  className="flex items-center justify-between gap-3 rounded-lg bg-[var(--color-bg-primary)] px-3 py-2.5 text-sm"
                >
                  <p className="text-[var(--color-text-primary)]">{offer.label}</p>
                  <p className="whitespace-nowrap text-[var(--color-text-secondary)]">{formatAed(offer.price)}</p>
                </div>
              ))}
            </div>
          </DetailBlock>
        )}

        <p className="text-center text-xs leading-5 text-[var(--color-text-soft)]">
          Add one or more products, then continue from the checkout bar.
        </p>
      </div>
    </aside>
  );
}

function NewBookingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { context, loading: contextLoading, error: contextError } = usePartnerContext();
  const scopedHref = React.useCallback(
    (href: string) => appendPulseAccountId(href, context?.account_id),
    [context?.account_id]
  );
  useImmersiveMode();

  const requestedBehalfMode = searchParams.get("mode") === "behalf";
  const isBehalfMode = requestedBehalfMode && isDardocPulseSeller(context?.seller_id);
  const [verticals, setVerticals] = React.useState<PulseVerticalOption[]>([]);
  const [selectedVertical, setSelectedVertical] = React.useState<PulseVerticalOption | null>(null);
  const [verticalsLoading, setVerticalsLoading] = React.useState(true);
  const [verticalsError, setVerticalsError] = React.useState<string | null>(null);
  const [products, setProducts] = React.useState<PulseCatalogProduct[]>([]);
  const [productsLoading, setProductsLoading] = React.useState(false);
  const [productsError, setProductsError] = React.useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = React.useState<PulseCatalogProduct | null>(null);
  const [selectedProducts, setSelectedProducts] = React.useState<PulseCatalogProduct[]>([]);
  const [checkoutLoading, setCheckoutLoading] = React.useState(false);
  const [checkoutError, setCheckoutError] = React.useState<string | null>(null);
  const [memberQuery, setMemberQuery] = React.useState("");
  const [members, setMembers] = React.useState<PulseMemberOption[]>([]);
  const [membersLoading, setMembersLoading] = React.useState(false);
  const [membersError, setMembersError] = React.useState<string | null>(null);
  const [selectedMember, setSelectedMember] = React.useState<PulseMemberOption | null>(null);
  const [checkoutLink, setCheckoutLink] = React.useState<{
    url: string;
    expiresAt?: string | null;
  } | null>(null);

  const loadMembers = React.useCallback(async () => {
    if (!isBehalfMode) return;

    setMembersLoading(true);
    setMembersError(null);
    try {
      const result = await fetchPulseMembers({
        query: memberQuery,
        accountId: context?.account_id,
        limit: 100,
      });
      setMembers(result.members);
      setSelectedMember((current) => {
        if (!current) return null;
        return result.members.some((member) => member.customerId === current.customerId) ? current : null;
      });
    } catch (error) {
      setMembers([]);
      setMembersError(error instanceof Error ? error.message : "members_load_failed");
    } finally {
      setMembersLoading(false);
    }
  }, [context?.account_id, isBehalfMode, memberQuery]);

  React.useEffect(() => {
    if (!isBehalfMode) {
      setMembers([]);
      setSelectedMember(null);
      setMembersError(null);
      setMembersLoading(false);
      return;
    }

    const timer = window.setTimeout(() => {
      void loadMembers();
    }, 250);

    return () => window.clearTimeout(timer);
  }, [isBehalfMode, loadMembers]);

  React.useEffect(() => {
    if (contextLoading) return;
    if (!context?.seller_id) {
      setVerticalsLoading(false);
      setVerticalsError(contextError ?? "seller_context_missing");
      return;
    }

    const sellerId = context.seller_id;
    const accountId = context.account_id;
    let cancelled = false;

    async function loadVerticals() {
      setVerticalsLoading(true);
      setVerticalsError(null);
      try {
        const nextVerticals = await fetchSellerVerticals(sellerId, accountId);
        if (cancelled) return;
        setVerticals(nextVerticals);
        if (nextVerticals.length > 0) setSelectedVertical(nextVerticals[0]);
      } catch (error) {
        if (!cancelled) setVerticalsError(error instanceof Error ? error.message : "verticals_load_failed");
      } finally {
        if (!cancelled) setVerticalsLoading(false);
      }
    }

    void loadVerticals();

    return () => {
      cancelled = true;
    };
  }, [context?.account_id, context?.seller_id, contextError, contextLoading]);

  React.useEffect(() => {
    if (!context?.seller_id || !selectedVertical) {
      setProducts([]);
      return;
    }

    const sellerId = context.seller_id;
    const accountId = context.account_id;
    const verticalId = selectedVertical.id;
    let cancelled = false;

    async function loadProducts() {
      setProductsLoading(true);
      setProductsError(null);
      setSelectedProduct(null);
      setSelectedProducts([]);
      setCheckoutError(null);
      setCheckoutLink(null);
      try {
        const nextProducts = await fetchSellerProductsForVertical(sellerId, verticalId, accountId);
        if (!cancelled) setProducts(nextProducts);
      } catch (error) {
        if (!cancelled) {
          setProducts([]);
          setProductsError(error instanceof Error ? error.message : "products_load_failed");
        }
      } finally {
        if (!cancelled) setProductsLoading(false);
      }
    }

    void loadProducts();

    return () => {
      cancelled = true;
    };
  }, [context?.account_id, context?.seller_id, selectedVertical]);

  const selectedProductIds = React.useMemo(
    () => new Set(selectedProducts.map((product) => product.id)),
    [selectedProducts]
  );
  const selectedCount = selectedProducts.length;
  const selectedTotal = selectedProducts.reduce((sum, product) => sum + product.price, 0);
  const checkoutCustomerReady = isBehalfMode ? Boolean(selectedMember?.customerId) : Boolean(context?.customer_id);

  function toggleProduct(product: PulseCatalogProduct) {
    setSelectedProduct(product);
    setCheckoutError(null);
    setCheckoutLink(null);
    setSelectedProducts((current) => {
      if (current.some((item) => item.id === product.id)) {
        return current.filter((item) => item.id !== product.id);
      }
      return [...current, product];
    });
  }

  async function handleCreateCheckout() {
    const customerId = isBehalfMode ? selectedMember?.customerId : context?.customer_id;
    if (!context?.seller_id || !customerId || selectedProducts.length === 0 || checkoutLoading) return;

    setCheckoutLoading(true);
    setCheckoutError(null);
    setCheckoutLink(null);
    try {
      const origin = window.location.origin;
      const intent = await createPulseCheckoutIntent({
        sellerId: context.seller_id,
        customerId,
        products: selectedProducts,
        returnUrl: `${origin}/bookings`,
        cancelUrl: isBehalfMode ? `${origin}/bookings/new?mode=behalf` : `${origin}/bookings/new`,
        accountId: context.account_id,
      });
      const checkoutUrl = checkoutUrlForCurrentEnvironment(intent.checkout_url);
      if (isBehalfMode) {
        setCheckoutLink({
          url: checkoutUrl,
          expiresAt: intent.expires_at,
        });
      } else {
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "checkout_link_failed");
    } finally {
      setCheckoutLoading(false);
    }
  }

  return (
    <div className="min-h-[100dvh] overflow-hidden bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <button
        onClick={() => router.push(scopedHref("/dashboard"))}
        className="absolute left-6 top-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border-default)] text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary)]"
      >
        <X className="h-5 w-5" />
      </button>

      <main className="h-[100dvh] overflow-y-auto pb-32">
        <div className="mx-auto max-w-7xl px-8 py-12">
          <header className="mb-8 max-w-3xl">
            <p className="mb-2 text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-soft)]">
              {isBehalfMode ? "DarDoc operator flow" : "New booking"}
            </p>
            <h1 className="text-3xl font-normal text-[var(--color-text-primary)]">
              {isBehalfMode ? "Book on behalf" : "New Booking"}
            </h1>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
              {isBehalfMode
                ? "Select a registered member, build their cart, then create a checkout link they can complete."
                : "Choose the seller's product here. Checkout will collect the member, address, slot, and payment."}
            </p>
          </header>

          {requestedBehalfMode && !isBehalfMode && !contextLoading && (
            <section className="mb-8 rounded-2xl border border-[var(--color-error)]/20 bg-[var(--color-error-light)] p-5">
              <p className="text-sm text-[var(--color-error)]">
                Book on behalf is available only for the DarDoc Pulse seller.
              </p>
            </section>
          )}

          {isBehalfMode && (
            <MemberSelector
              members={members}
              loading={membersLoading}
              error={membersError}
              query={memberQuery}
              selectedMember={selectedMember}
              onQueryChange={(value) => {
                setMemberQuery(value);
                setCheckoutError(null);
                setCheckoutLink(null);
              }}
              onSelect={(member) => {
                setSelectedMember(member);
                setCheckoutError(null);
                setCheckoutLink(null);
              }}
              onRetry={() => void loadMembers()}
            />
          )}

          {checkoutLink && (
            <CheckoutLinkPanel
              url={checkoutLink.url}
              expiresAt={checkoutLink.expiresAt}
              total={selectedTotal}
              member={selectedMember}
            />
          )}

          <section className="mb-8">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {verticalsLoading ? (
                <div className="col-span-full rounded-lg border border-[var(--color-border-subtle)] px-4 py-5 text-sm text-[var(--color-text-muted)]">
                  Loading enrolled verticals...
                </div>
              ) : verticalsError ? (
                <div className="col-span-full rounded-lg border border-[var(--color-border-subtle)] px-4 py-5 text-sm text-[var(--color-text-muted)]">
                  Couldn&apos;t load enrolled verticals. {verticalsError}
                </div>
              ) : verticals.length === 0 ? (
                <div className="col-span-full rounded-lg border border-[var(--color-border-subtle)] px-4 py-5 text-sm text-[var(--color-text-muted)]">
                  This seller is not enrolled in any bookable verticals yet.
                </div>
              ) : (
                verticals.map((vertical) => {
                  const Icon = VERTICAL_ICONS[vertical.id];
                  return (
                    <button
                      key={vertical.id}
                      onClick={() => {
                        setSelectedVertical(vertical);
                        setSelectedProduct(null);
                        setSelectedProducts([]);
                        setCheckoutError(null);
                        setCheckoutLink(null);
                      }}
                      className={cn(
                        "grid grid-cols-[44px_1fr_auto] items-center gap-4 rounded-lg border p-4 text-left transition-colors",
                        selectedVertical?.id === vertical.id
                          ? "border-[var(--color-accent-primary)] bg-[var(--color-bg-secondary)]"
                          : "border-[var(--color-border-subtle)] bg-transparent hover:border-[var(--color-border-hover)]"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-11 w-11 items-center justify-center rounded-full",
                          selectedVertical?.id === vertical.id
                            ? "bg-[var(--color-accent-primary)] text-[var(--color-text-inverse)]"
                            : "bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-normal text-[var(--color-text-primary)]">{vertical.title}</p>
                        <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">{vertical.description}</p>
                        <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-[var(--color-text-soft)]">
                          {vertical.productCount} active product{vertical.productCount === 1 ? "" : "s"}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-full border transition-colors",
                          selectedVertical?.id === vertical.id
                            ? "border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)] text-[var(--color-text-inverse)]"
                            : "border-[var(--color-border-default)] text-transparent"
                        )}
                      >
                        <Check className="h-4 w-4" />
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-start">
            <div>
              <div className="mb-4">
                <h2 className="text-xl font-normal text-[var(--color-text-primary)]">Products</h2>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                  {selectedVertical
                    ? `Showing ${selectedVertical.title} products from the active DarDoc catalog.`
                    : "Select a vertical to see available products."}
                </p>
              </div>

              <div className="overflow-hidden rounded-xl border border-[var(--color-border-subtle)]">
                {!selectedVertical ? (
                  <div className="px-4 py-6 text-sm text-[var(--color-text-muted)]">Choose a vertical first.</div>
                ) : productsLoading ? (
                  <div className="px-4 py-6 text-sm text-[var(--color-text-muted)]">Loading products...</div>
                ) : productsError ? (
                  <div className="px-4 py-6 text-sm text-[var(--color-text-muted)]">Couldn&apos;t load products. {productsError}</div>
                ) : products.length === 0 ? (
                  <div className="px-4 py-6 text-sm text-[var(--color-text-muted)]">
                    No active products found for {selectedVertical.title}.
                  </div>
                ) : (
                  <div className="divide-y divide-[var(--color-border-subtle)]">
                    {products.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => toggleProduct(product)}
                        className={cn(
                          "grid w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-5 p-4 text-left transition-colors",
                          selectedProductIds.has(product.id)
                            ? "bg-[var(--color-accent-primary)]/5"
                            : "bg-transparent hover:bg-[var(--color-bg-secondary)]/60"
                        )}
                      >
                        <div className="min-w-0">
                          <p className="product-cell-title text-[15px] leading-5 text-[var(--color-text-primary)]">{product.name}</p>
                          <p className="mt-1 text-xs text-[var(--color-text-muted)]">{product.category} · {product.duration}</p>
                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--color-text-soft)]">{product.description}</p>
                        </div>
                        <div className="min-w-[92px] text-right">
                          <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--color-text-soft)]">Price</p>
                          <p className="mt-1 whitespace-nowrap text-sm text-[var(--color-text-primary)]">{formatAed(product.price)}</p>
                        </div>
                        <span
                          className={cn(
                            "flex h-7 w-7 items-center justify-center rounded-full border transition-colors",
                            selectedProductIds.has(product.id)
                              ? "border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)] text-[var(--color-text-inverse)]"
                              : "border-[var(--color-border-default)] text-transparent"
                          )}
                        >
                          <Check className="h-4 w-4" />
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:sticky lg:top-8">
              <ProductDetails
                product={selectedProduct}
              />
            </div>
          </section>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)]/95 px-8 py-4 shadow-lg backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-normal text-[var(--color-text-primary)]">
              {selectedCount > 0
                ? `${selectedCount} item${selectedCount === 1 ? "" : "s"} selected`
                : isBehalfMode && !selectedMember
                  ? "Select a member first"
                  : "Select products to create checkout"}
            </p>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              {selectedCount > 0
                ? isBehalfMode && selectedMember
                  ? `For ${selectedMember.name} · Total ${formatAed(selectedTotal)}`
                  : `Total ${formatAed(selectedTotal)}`
                : isBehalfMode
                  ? "The checkout link will be generated for the selected registered member."
                  : "Member, address, slot, and payment happen on checkout.dardoc.com."}
            </p>
            {checkoutError && (
              <p className="mt-2 text-xs text-[var(--color-error)]">{checkoutError}</p>
            )}
          </div>

          <Button
            variant="primary"
            disabled={selectedCount === 0 || !checkoutCustomerReady}
            loading={checkoutLoading}
            onClick={handleCreateCheckout}
            rightIcon={<ExternalLink className="h-4 w-4" />}
            className="w-full sm:w-auto sm:min-w-[220px]"
          >
            {isBehalfMode ? "Create checkout link" : "Continue to checkout"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function NewBookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--color-bg-primary)]" />}>
      <NewBookingPageContent />
    </Suspense>
  );
}
