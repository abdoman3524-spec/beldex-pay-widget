import type { PaymentStatus } from "@/lib/beldexAdapter";

const steps = [
  { key: "waiting", label: "Waiting for payment" },
  { key: "detected", label: "Detected" },
  { key: "confirmed", label: "Confirmed" },
] as const;

const order: Record<PaymentStatus, number> = { waiting: 0, detected: 1, confirmed: 2, expired: -1 };

export function StatusTimeline({ status, confirmations, required }: { status: PaymentStatus; confirmations: number; required: number }) {
  const idx = order[status];
  return (
    <ol className="space-y-3">
      {steps.map((s, i) => {
        const done = i < idx || (i === idx && status === "confirmed");
        const active = i === idx && !done;
        return (
          <li key={s.key} className="flex items-center gap-3">
            <span
              className={`grid size-6 shrink-0 place-items-center rounded-full border text-xs transition-all duration-500 ${
                done ? "border-primary bg-primary text-primary-foreground scale-100" : active ? "border-primary text-primary animate-pulse" : "border-border text-muted-foreground"
              }`}
            >
              {done ? "✓" : i + 1}
            </span>
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
  );
}
