import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Pulse OS",
  description: "View your bookings, revenue, and commission at a glance. Manage your DarDoc partner services.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
