import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function DemoBanner() {
  return (
    <div className="bg-warning/15 text-warning border-b border-warning/30 px-4 py-2 text-center text-xs font-medium tracking-wide">
      Demo mode: simulated data
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const nav = "rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground";
  return (
    <div className="min-h-screen">
      <DemoBanner />
      <header className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-4">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid size-7 place-items-center rounded-lg bg-primary text-primary-foreground text-sm">B</span>
          BelPay <span className="text-muted-foreground font-normal">Checkout</span>
        </Link>
        <nav className="flex gap-1">
          <Link to="/" className={nav} activeProps={{ className: "bg-secondary !text-foreground" }} activeOptions={{ exact: true }}>Store</Link>
          <Link to="/dashboard" className={nav} activeProps={{ className: "bg-secondary !text-foreground" }}>Merchant</Link>
        </nav>
      </header>
      <main className="mx-auto max-w-3xl px-4 pb-16">{children}</main>
    </div>
  );
}
