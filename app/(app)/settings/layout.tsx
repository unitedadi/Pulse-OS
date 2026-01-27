import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | Pulse OS",
  description: "Manage your business profile, team members, notification preferences, and account settings.",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
