"use client";

import * as React from "react";
import { Monitor } from "lucide-react";

export function MobileGate({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const checkDevice = () => {
      // Check if device is mobile or tablet (width < 1024px)
      const isMobileOrTablet = window.innerWidth < 1024;
      setIsMobile(isMobileOrTablet);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // Show nothing while checking (prevents flash)
  if (isMobile === null) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)]" />
    );
  }

  // Show desktop-only message on mobile/tablet
  if (isMobile) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          {/* Icon */}
          <div className="h-20 w-20 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center mx-auto mb-8">
            <Monitor className="h-10 w-10 text-[var(--color-accent-primary)]" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-normal text-[var(--color-text-primary)] mb-4">
            Desktop Only
          </h1>

          {/* Description */}
          <p className="text-[var(--color-text-muted)] leading-relaxed mb-8">
            Pulse OS is optimized for desktop browsers. Please open this page on a laptop or desktop computer for the best experience.
          </p>

          {/* URL hint */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[var(--color-border-default)] shadow-[var(--shadow-sm)]">
            <span className="text-sm text-[var(--color-text-muted)]">Visit</span>
            <span className="text-sm text-[var(--color-text-primary)]">pulse-os.vercel.app</span>
          </div>
        </div>
      </div>
    );
  }

  // Show app on desktop
  return <>{children}</>;
}
