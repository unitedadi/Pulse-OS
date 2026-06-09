export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)] relative overflow-hidden p-6">
      {/* Subtle wave pattern background */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 50 Q 25 30, 50 50 T 100 50' stroke='%23119098' fill='none' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: "100px 100px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <div className="text-center mb-10">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--color-text-soft)] mb-4">
            DarDoc Partner Portal
          </p>
          <h1 className="text-5xl font-normal text-[var(--color-brand-primary)]">
            Pulse OS
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-3">
            Warm, text-forward operations for healthcare bookings.
          </p>
        </div>

        <div className="flex justify-center">
          {children}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[var(--color-text-muted)] mt-6">
          Powered by{" "}
          <span className="text-[var(--color-brand-primary)] font-medium">
            DarDoc Health
          </span>
        </p>
      </div>
    </div>
  );
}
