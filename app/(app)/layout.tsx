"use client";

import * as React from "react";
import { useAuth } from "@clerk/nextjs";
import {
  AppLayout,
  PartnerContextProvider,
  type PulsePartnerContext,
} from "@/components/layouts";

type PartnerContextResponse = PulsePartnerContext;

export default function AppRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [partnerContext, setPartnerContext] =
    React.useState<PartnerContextResponse | null>(null);
  const [contextError, setContextError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    let cancelled = false;

    async function loadPartnerContext() {
      try {
        setContextError(null);
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
  }, [getToken, isLoaded, isSignedIn]);

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

  const contextValue = React.useMemo(
    () => ({
      context: partnerContext,
      loading: Boolean(isLoaded && isSignedIn && !partnerContext && !contextError),
      error: contextError,
    }),
    [contextError, isLoaded, isSignedIn, partnerContext]
  );

  return (
    <PartnerContextProvider value={contextValue}>
      <AppLayout partner={partner} userRole={mockUserRole}>
        {children}
      </AppLayout>
    </PartnerContextProvider>
  );
}
