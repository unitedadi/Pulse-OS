import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Pulse OS",
  description: "Sign in to your Pulse OS partner account to manage bookings and track commissions.",
};

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
