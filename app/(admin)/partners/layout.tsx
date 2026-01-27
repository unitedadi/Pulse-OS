import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partners | Pulse OS Admin",
  description: "Manage partner accounts, commission rates, and access permissions.",
};

export default function PartnersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
