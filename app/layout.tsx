import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "@/components/providers";
import { MobileGate } from "@/components/mobile-gate";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pulse OS | DarDoc Partner Portal",
  description: "Book and manage DarDoc services for your customers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
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
