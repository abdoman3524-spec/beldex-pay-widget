import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { GlassCard } from "@/components/ui-motion";
import { StatsRow } from "@/components/dashboard/StatsRow";
import { PaymentsChart } from "@/components/dashboard/PaymentsChart";
import { IntegrationCard, PrivacyCard, WebhookSimulator } from "@/components/dashboard/InfoCards";
import { shortAddress, usePayments } from "@/lib/paymentsStore";

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
  return (
    <AppShell>
      <h1 className="text-2xl font-semibold tracking-tight">Merchant</h1>
      <div className="mt-5 space-y-3">
        <StatsRow payments={payments} />
        <PaymentsChart payments={payments} />
        <GlassCard className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr className="border-b border-border">
                {["ID", "Address", "Amount", "Status", "Time"].map((h) => <th key={h} className="px-3 py-2.5 text-start font-medium">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 && (
                <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No payments yet. Try a checkout in the store.</td></tr>
              )}
              {payments.map((p) => (
                <motion.tr key={p.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-border last:border-0 hover:bg-secondary/40">
                  <td className="px-3 py-2.5 font-mono text-xs" dir="ltr">{p.id}</td>
                  <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground" dir="ltr">{shortAddress(p.address)}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap" dir="ltr">{p.amount} BDX</td>
                  <td className="px-3 py-2.5"><StatusBadge status={p.status} /></td>
                  <td className="px-3 py-2.5 whitespace-nowrap text-muted-foreground">{new Date(p.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
        <IntegrationCard />
        <WebhookSimulator />
        <PrivacyCard />
      </div>
    </AppShell>
  );
}
