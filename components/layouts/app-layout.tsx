"use client";

import * as React from "react";
import { Header } from "./header";
import { MenuOverlay } from "./menu-overlay";
import { LayoutProvider, useLayoutContext } from "./layout-context";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
  partner?: {
    name: string;
    logo?: string;
    sellerId?: string;
    customerId?: string;
  };
  userRole?: string;
}

function AppLayoutInner({ children, partner, userRole }: AppLayoutProps) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const { headerContent, isImmersive } = useLayoutContext();

  // Stable callback for closing menu
  const handleCloseMenu = React.useCallback(() => {
    setMenuOpen(false);
  }, []);

  // Live time update
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      {/* Header - Hidden in immersive mode */}
      {!isImmersive && (
        <Header
          onMenuClick={() => setMenuOpen(true)}
          currentTime={currentTime}
          partner={partner}
        >
          {headerContent}
        </Header>
      )}

      {/* Full-screen Menu Overlay - Always available */}
      <MenuOverlay
        isOpen={menuOpen}
        onClose={handleCloseMenu}
        partner={partner}
        userRole={userRole}
      />

      {/* Main Content Area - No padding in immersive mode */}
      <main
        className={cn(
          !isImmersive && "px-6 lg:px-10 pb-14"
        )}
      >
        {children}
      </main>
    </div>
  );
}

export function AppLayout(props: AppLayoutProps) {
  return (
    <LayoutProvider>
      <AppLayoutInner {...props} />
    </LayoutProvider>
  );
}
