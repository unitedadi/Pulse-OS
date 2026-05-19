"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  React.useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <main className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] flex items-center justify-center">
      <div className="space-y-4 text-center">
        <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--color-text-soft)]">
          Pulse OS
        </p>
        <div className="w-72 h-3 rounded-full bg-[var(--color-bg-secondary)] overflow-hidden">
          <div className="h-full w-1/2 rounded-full bg-[var(--color-accent-primary)] animate-pulse" />
        </div>
      </div>
    </main>
  );
}
