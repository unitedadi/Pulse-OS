"use client";

import * as React from "react";

export type PulsePartnerContext = {
  seller_id: string;
  customer_id: string;
  address_id: string | null;
  seller?: {
    display_name?: string | null;
  };
};

type PartnerContextValue = {
  context: PulsePartnerContext | null;
  loading: boolean;
  error: string | null;
};

const PartnerContext = React.createContext<PartnerContextValue | null>(null);

export function PartnerContextProvider({
  value,
  children,
}: {
  value: PartnerContextValue;
  children: React.ReactNode;
}) {
  return (
    <PartnerContext.Provider value={value}>{children}</PartnerContext.Provider>
  );
}

export function usePartnerContext() {
  const value = React.useContext(PartnerContext);
  if (!value) {
    throw new Error("usePartnerContext must be used inside PartnerContextProvider");
  }
  return value;
}
