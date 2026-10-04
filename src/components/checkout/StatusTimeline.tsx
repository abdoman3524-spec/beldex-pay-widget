import { motion } from "motion/react";
import type { PaymentStatus } from "@/lib/beldexAdapter";

const steps = [
  { key: "waiting", label: "Waiting for payment" },
  { key: "detected", label: "Detected" },
  { key: "confirmed", label: "Confirmed" },
] as const;

const order: Record<PaymentStatus, number> = { waiting: 0, detected: 1, confirmed: 2, expired: -1 };

export function StatusTimeline({ status, confirmations, required }: { status: PaymentStatus; confirmations: number; required: number }) {
  const idx = order[status];
  const progress = status === "confirmed" ? 1 : Math.max(0, idx) / (steps.length - 1);
  return (
    <div className="relative">
      <div className="absolute start-3 top-3 bottom-3 w-px -translate-x-1/2 bg-border rtl:translate-x-1/2" />
      <motion.div
        className="absolute start-3 top-3 w-px -translate-x-1/2 bg-primary rtl:translate-x-1/2"
        initial={{ height: 0 }}
        animate={{ height: `calc((100% - 1.5rem) * ${progress})` }}
        transition={{ type: "spring", stiffness: 80, damping: 20 }}
      />
      <ol className="relative space-y-4">
        {steps.map((s, i) => {
          const done = i < idx || (i === idx && status === "confirmed");
          const active = i === idx && !done;
          return (
            <li key={s.key} className="flex items-center gap-3">
              <motion.span
                animate={
                  done
                    ? { scale: 1, boxShadow: "0 0 16px 2px color-mix(in oklab, var(--primary) 50%, transparent)" }
                    : active
                      ? { scale: [1, 1.15, 1], boxShadow: "0 0 0 0 transparent" }
                      : { scale: 1, boxShadow: "0 0 0 0 transparent" }
                }
                transition={active ? { duration: 1.4, repeat: Infinity } : { type: "spring", stiffness: 300, damping: 18 }}
                className={`grid size-6 shrink-0 place-items-center rounded-full border text-xs ${
                  done ? "border-primary bg-primary text-primary-foreground" : active ? "border-primary bg-background text-primary" : "border-border bg-background text-muted-foreground"
                }`}
              >
                {done ? (
                  <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="3">
                    <motion.path d="M5 12l5 5 9-10" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
                  </svg>
                ) : (
                  i + 1
                )}
              </motion.span>
              <span className={`text-sm transition-colors duration-500 ${done || active ? "text-foreground" : "text-muted-foreground"}`}>
                {s.label}
                {s.key === "detected" && status === "detected" && (
                  <span className="ms-2 text-xs text-muted-foreground">{confirmations}/{required} conf.</span>
                )}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
