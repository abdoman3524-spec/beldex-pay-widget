import { useEffect, useRef } from "react";
import { animate } from "motion/react";
import { GlassCard } from "@/components/ui-motion";
import type { PaymentRecord } from "@/lib/paymentsStore";

function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(0);
  useEffect(() => {
    const c = animate(prev.current, value, {
      duration: 0.8,
      ease: "easeOut",
      onUpdate: (v) => { if (ref.current) ref.current.textContent = Math.round(v).toLocaleString(); },
    });
    prev.current = value;
    return () => c.stop();
  }, [value]);
  return <span ref={ref}>0</span>;
}

export function StatsRow({ payments }: { payments: PaymentRecord[] }) {
  const paid = payments.filter((p) => p.status === "confirmed");
  const pending = payments.filter((p) => p.status === "waiting" || p.status === "detected");
  const stats = [
    { label: "Received", value: paid.reduce((s, p) => s + p.amount, 0), unit: "BDX" },
    { label: "Pending", value: pending.reduce((s, p) => s + p.amount, 0), unit: "BDX" },
    { label: "Paid", value: paid.length, unit: "orders" },
  ];
  return (
    <div className="grid grid-cols-3 gap-2">
      {stats.map((s, i) => (
        <GlassCard key={s.label} hover initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="p-3">
          <p className="text-[11px] text-muted-foreground">{s.label}</p>
          <p className="mt-0.5 text-lg font-semibold tabular-nums" dir="ltr"><AnimatedNumber value={s.value} /></p>
          <p className="text-[10px] text-primary">{s.unit}</p>
        </GlassCard>
      ))}
    </div>
  );
}
