import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "@/components/providers";
import { MobileGate } from "@/components/mobile-gate";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pulse OS | DarDoc Partner Portal",
  description: "Book and manage DarDoc services for your customers",
};

const clerkPublishableKey =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ??
  "pk_test_cXVhbGl0eS1yb2RlbnQtMzQuY2xlcmsuYWNjb3VudHMuZGV2JA";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <html lang="en">
        <body className="font-sans antialiased">
          <Providers>
            <MobileGate>{children}</MobileGate>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
