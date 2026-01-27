import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customers | Pulse OS",
  description: "Manage your customer database. View booking history, contact details, and create new bookings.",
};

export default function CustomersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
