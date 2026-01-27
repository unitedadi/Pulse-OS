import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics | Pulse OS",
  description: "Track your earnings, commissions, and business performance. View detailed financial breakdowns and transaction history.",
};

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
