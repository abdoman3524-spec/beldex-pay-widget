import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { GlassCard } from "@/components/ui-motion";
import type { PaymentRecord } from "@/lib/paymentsStore";

export function PaymentsChart({ payments }: { payments: PaymentRecord[] }) {
  const data = payments.slice(0, 12).reverse().map((p) => ({
    name: new Date(p.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    amount: p.amount,
    paid: p.status === "confirmed",
  }));
  return (
    <GlassCard className="p-4">
      <p className="text-sm font-semibold">Recent payments</p>
      <div className="mt-3 h-36" dir="ltr">
        {data.length === 0 ? (
          <p className="grid h-full place-items-center text-xs text-muted-foreground">No data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ fill: "var(--secondary)" }}
                contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12, color: "var(--foreground)" }}
                formatter={(v) => [`${v} BDX`, "Amount"]}
              />
              <Bar dataKey="amount" radius={[6, 6, 2, 2]} animationDuration={700}>
                {data.map((d, i) => <Cell key={i} fill={d.paid ? "var(--primary)" : "var(--muted-foreground)"} fillOpacity={d.paid ? 1 : 0.4} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </GlassCard>
  );
}
