import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { usePayments } from "@/lib/paymentsStore";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Merchant Dashboard — BelPay Checkout" },
      { name: "description", content: "Track BDX payments received through the BelPay checkout demo." },
      { property: "og:title", content: "Merchant Dashboard — BelPay Checkout" },
      { property: "og:description", content: "Track BDX payments received through the BelPay checkout demo." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const payments = usePayments();
  const confirmed = payments.filter((p) => p.status === "confirmed");
  const total = confirmed.reduce((s, p) => s + p.amount, 0);

  return (
    <AppShell>
      <h1 className="text-2xl font-semibold tracking-tight">Payments</h1>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Total received</p>
          <p className="mt-1 text-2xl font-semibold" dir="ltr">{total} <span className="text-primary text-base">BDX</span></p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Confirmed / all</p>
          <p className="mt-1 text-2xl font-semibold">{confirmed.length} / {payments.length}</p>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground">
            <tr className="border-b border-border">
              <th className="p-3 text-start font-medium">ID</th>
              <th className="p-3 text-start font-medium">Amount</th>
              <th className="p-3 text-start font-medium">Status</th>
              <th className="p-3 text-start font-medium">Time</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 && (
              <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">No payments yet. Try a checkout in the store.</td></tr>
            )}
            {payments.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0 animate-in fade-in">
                <td className="p-3 font-mono text-xs" dir="ltr">{p.id}</td>
                <td className="p-3 whitespace-nowrap" dir="ltr">{p.amount} BDX</td>
                <td className="p-3"><StatusBadge status={p.status} /></td>
                <td className="p-3 whitespace-nowrap text-muted-foreground">{new Date(p.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
