"use client";

import { AppLayout } from "@/components/layouts";

export default function AppRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Fetch partner and user data from context/API
  const mockPartner = {
    name: "Barry's Bootcamp",
    logo: undefined,
  };

  const mockUserRole = "owner"; // Will come from user context

  return (
    <AppLayout partner={mockPartner} userRole={mockUserRole}>
      {children}
    </AppLayout>
  );
}
