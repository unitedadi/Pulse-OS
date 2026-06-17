"use client";

import * as React from "react";
import { useAuth } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import {
  AppLayout,
  PartnerContextProvider,
  type PulsePartnerContext,
} from "@/components/layouts";
import {
  appendPulseAccountId,
  PULSE_ACCOUNT_SELECTOR_COOKIE_NAME,
  PULSE_ACCOUNT_SELECTOR_STORAGE_KEY,
  getKnownPulseAccountById,
  normalizePulseAccountId,
  pulseAccountIdsForWorkspace,
  type PulseWorkspaceSummary,
} from "@/lib/pulse-account-selector";

type PartnerContextResponse = PulsePartnerContext;

export default function AppRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const searchParams = useSearchParams();
  const [partnerContext, setPartnerContext] =
    React.useState<PartnerContextResponse | null>(null);
  const [contextError, setContextError] = React.useState<string | null>(null);
  const [storedAccountId, setStoredAccountId] = React.useState<string>("");

  const queryAccountId = normalizePulseAccountId(searchParams.get("account_id"));
  const selectedAccountId = queryAccountId || storedAccountId;

  const persistAccountSelector = React.useCallback((accountId: string) => {
    window.localStorage.setItem(PULSE_ACCOUNT_SELECTOR_STORAGE_KEY, accountId);
    document.cookie = `${PULSE_ACCOUNT_SELECTOR_COOKIE_NAME}=${encodeURIComponent(
      accountId
    )}; path=/; max-age=2592000; samesite=lax`;
  }, []);

  React.useEffect(() => {
    const saved = normalizePulseAccountId(
      window.localStorage.getItem(PULSE_ACCOUNT_SELECTOR_STORAGE_KEY)
    );
    if (saved) {
      persistAccountSelector(saved);
      setStoredAccountId(saved);
    }
  }, [persistAccountSelector]);

  React.useEffect(() => {
    if (!queryAccountId) return;
    persistAccountSelector(queryAccountId);
    setStoredAccountId(queryAccountId);
  }, [persistAccountSelector, queryAccountId]);

  React.useEffect(() => {
    if (!selectedAccountId && (!isLoaded || !isSignedIn)) return;

    let cancelled = false;

    async function loadPartnerContext() {
      try {
        setContextError(null);
        if (selectedAccountId) {
          const knownAccount = getKnownPulseAccountById(selectedAccountId);
          if (knownAccount) {
            const onboardingResponse = await fetch(
              appendPulseAccountId(
                `/api/backend/admin/partners/${encodeURIComponent(knownAccount.seller_id)}/onboarding`,
                selectedAccountId
              ),
              { cache: "no-store" }
            );
            const onboardingPayload = (await onboardingResponse.json().catch(() => null)) as
              | { customer_id?: string | null; status?: string | null }
              | null;

            if (!onboardingResponse.ok) throw new Error(`account_context_${onboardingResponse.status}`);
            if (String(onboardingPayload?.status ?? "ACTIVE").toUpperCase() !== "ACTIVE") {
              throw new Error("pulse_account_inactive");
            }

            if (!cancelled) {
              setPartnerContext({
                seller_id: knownAccount.seller_id,
                customer_id: onboardingPayload?.customer_id || knownAccount.seller_id,
                address_id: null,
                seller: {
                  display_name: knownAccount.display_name,
                },
                account_id: selectedAccountId,
                resolved_by: "account_selector",
              });
            }
            return;
          }

          const workspacesResponse = await fetch(
            appendPulseAccountId("/api/backend/admin/partner-workspaces", selectedAccountId),
            { cache: "no-store" }
          );
          const workspacesPayload = (await workspacesResponse.json().catch(() => null)) as
            | { items?: PulseWorkspaceSummary[] }
            | null;

          if (!workspacesResponse.ok) throw new Error(`account_selector_${workspacesResponse.status}`);

          const workspaces = Array.isArray(workspacesPayload?.items) ? workspacesPayload.items : [];
          const workspace = workspaces.find((item) =>
            pulseAccountIdsForWorkspace(item).includes(selectedAccountId)
          );

          if (!workspace) throw new Error("pulse_account_not_found");
          if (String(workspace.seller_status ?? "").toUpperCase() !== "ACTIVE") {
            throw new Error("pulse_account_inactive");
          }

          const onboardingResponse = await fetch(
            appendPulseAccountId(
              `/api/backend/admin/partners/${encodeURIComponent(workspace.seller_id)}/onboarding`,
              selectedAccountId
            ),
            { cache: "no-store" }
          );
          const onboardingPayload = (await onboardingResponse.json().catch(() => null)) as
            | { customer_id?: string | null }
            | null;

          if (!onboardingResponse.ok) throw new Error(`account_context_${onboardingResponse.status}`);

          if (!cancelled) {
            setPartnerContext({
              seller_id: workspace.seller_id,
              customer_id: onboardingPayload?.customer_id || workspace.seller_id,
              address_id: null,
              seller: {
                display_name: workspace.seller_display_name,
              },
              account_id: selectedAccountId,
              resolved_by: "account_selector",
            });
          }
          return;
        }

        const token = await getToken();
        if (!token) throw new Error("missing_clerk_token");

        const response = await fetch("/api/backend/partners/me/context", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const payload = (await response.json().catch(() => null)) as
          | PartnerContextResponse
          | { error?: string; detail?: string }
          | null;

        if (!response.ok) {
          const error =
            payload && "error" in payload && payload.error
              ? payload.error
              : `context_${response.status}`;
          throw new Error(error);
        }

        if (!payload || !("seller_id" in payload) || !("customer_id" in payload)) {
          throw new Error("context_missing_ids");
        }

        if (!cancelled) setPartnerContext(payload);
      } catch (error) {
        if (!cancelled) {
          setPartnerContext(null);
          setContextError(
            error instanceof Error ? error.message : "context_load_failed"
          );
        }
      }
    }

    void loadPartnerContext();

    return () => {
      cancelled = true;
    };
  }, [getToken, isLoaded, isSignedIn, selectedAccountId]);

  const partner = partnerContext
    ? {
        name: partnerContext.seller?.display_name || partnerContext.seller_id,
        sellerId: partnerContext.seller_id,
        customerId: partnerContext.customer_id,
        logo: undefined,
      }
    : {
        name: contextError ? "Pulse OS" : "Loading partner...",
        logo: undefined,
      };

  const mockUserRole = "owner"; // Will come from user context
  const contextLoading = selectedAccountId
    ? !partnerContext && !contextError
    : Boolean(isLoaded && isSignedIn && !partnerContext && !contextError);

  const contextValue = React.useMemo(
    () => ({
      context: partnerContext,
      loading: contextLoading,
      error: contextError,
    }),
    [contextError, contextLoading, partnerContext]
  );

  return (
    <PartnerContextProvider value={contextValue}>
      <AppLayout partner={partner} userRole={mockUserRole}>
        {children}
      </AppLayout>
    </PartnerContextProvider>
  );
}
