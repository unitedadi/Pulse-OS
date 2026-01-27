import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bookings | Pulse OS",
  description: "View and manage all your customer bookings. Track upcoming appointments, completed services, and pending payments.",
};

export default function BookingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
