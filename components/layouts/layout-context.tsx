"use client";

import * as React from "react";

interface LayoutContextValue {
  // Header content slot
  headerContent: React.ReactNode;
  setHeaderContent: (content: React.ReactNode) => void;

  // Immersive mode - hides header, removes padding for full-bleed pages
  isImmersive: boolean;
  setImmersive: (value: boolean) => void;
}

const LayoutContext = React.createContext<LayoutContextValue | null>(null);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [headerContent, setHeaderContent] = React.useState<React.ReactNode>(null);
  const [isImmersive, setImmersive] = React.useState(false);

  return (
    <LayoutContext.Provider
      value={{
        headerContent,
        setHeaderContent,
        isImmersive,
        setImmersive,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayoutContext() {
  const context = React.useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayoutContext must be used within a LayoutProvider");
  }
  return context;
}

// Hook for pages to set header content
export function useHeaderContent(content: React.ReactNode) {
  const { setHeaderContent } = useLayoutContext();

  React.useEffect(() => {
    setHeaderContent(content);
    return () => setHeaderContent(null);
  }, [content, setHeaderContent]);
}

// Hook for pages to enable immersive/full-bleed mode
export function useImmersiveMode(enabled: boolean = true) {
  const { setImmersive } = useLayoutContext();

  React.useEffect(() => {
    setImmersive(enabled);
    return () => setImmersive(false);
  }, [enabled, setImmersive]);
}
