import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useTheme } from "@/lib/theme";

export function DemoBanner() {
  return (
    <div className="bg-warning/15 text-warning border-b border-warning/30 px-4 py-1.5 text-center text-xs font-medium tracking-wide">
      Demo mode: simulated data
    </div>
  );
}

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <motion.button
      whileTap={{ scale: 0.9, rotate: -20 }}
      onClick={toggle}
      aria-label="Toggle theme"
      className="glass grid size-9 place-items-center rounded-full text-sm"
    >
      {theme === "dark" ? "☀" : "☾"}
    </motion.button>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const nav = "rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground";
  return (
    <div className="min-h-screen">
      <DemoBanner />
      <header className="mx-auto flex max-w-3xl items-center justify-between gap-2 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid size-7 place-items-center rounded-lg bg-primary text-sm text-primary-foreground shadow-glow">B</span>
          <span>BelPay</span>
        </Link>
        <div className="flex items-center gap-1.5">
          <nav className="glass flex gap-0.5 rounded-full p-0.5">
            <Link to="/" className={nav} activeProps={{ className: "bg-secondary !text-foreground" }} activeOptions={{ exact: true }}>Store</Link>
            <Link to="/dashboard" className={nav} activeProps={{ className: "bg-secondary !text-foreground" }}>Merchant</Link>
          </nav>
          <ThemeToggle />
        </div>
      </header>
      <motion.main
        key={path}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-3xl px-4 pb-16"
      >
        {children}
      </motion.main>
    </div>
  );
}
