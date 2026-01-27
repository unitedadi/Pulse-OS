import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Booking | Pulse OS",
  description: "Create a new booking for your customer. Select service, schedule appointment, and generate payment link.",
};

export default function NewBookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
