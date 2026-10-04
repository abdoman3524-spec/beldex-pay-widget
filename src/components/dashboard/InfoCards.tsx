import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { GlassCard, MotionButton } from "@/components/ui-motion";
import { beldex } from "@/lib/beldexAdapter";
import { upsertPayment } from "@/lib/paymentsStore";
import { CodePanel } from "./CodePanel";

const SNIPPET = `<script src="https://cdn.belpay.dev/widget.js"></script>
<belpay-checkout amount="120" merchant="YOUR_VIEW_ONLY_ID"></belpay-checkout>`;

export function IntegrationCard() {
  return (
    <GlassCard className="space-y-3 p-4">
      <div>
        <p className="text-sm font-semibold">Integration</p>
        <p className="text-xs text-muted-foreground">Embed the widget with two lines.</p>
      </div>
      <CodePanel code={SNIPPET} />
    </GlassCard>
  );
}

export function WebhookSimulator() {
  const [json, setJson] = useState<string | null>(null);
  const run = async () => {
    // Simulated only. TODO: real webhooks would be sent by the merchant's
    // view-only watcher service, signed with an HMAC secret.
    const amount = [45, 120, 300][Math.floor(Math.random() * 3)]!;
    const req = await beldex.createPaymentRequest(amount);
    const net = await beldex.getNetworkInfo();
    upsertPayment({ id: req.id, amount, status: "confirmed", time: req.createdAt, address: req.address });
    setJson(JSON.stringify({
      event: "payment.confirmed",
      id: req.id,
      amount: { value: amount, currency: "BDX" },
      address: req.address,
      confirmations: net.requiredConfirmations,
      network: net.network,
      timestamp: new Date(req.createdAt).toISOString(),
    }, null, 2));
  };
  return (
    <GlassCard className="space-y-3 p-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold">Webhook simulator</p>
          <p className="text-xs text-muted-foreground">Sends a fake confirmed payment.</p>
        </div>
        <MotionButton onClick={run} className="shrink-0 px-3 py-2 text-sm">Simulate</MotionButton>
      </div>
      <AnimatePresence mode="wait">
        {json && (
          <motion.div key={json} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0 }}>
            <CodePanel code={json} />
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}

const never = ["No accounts or logins", "No tracking or analytics cookies", "No private keys — ever", "No customer personal data"];

export function PrivacyCard() {
  return (
    <GlassCard className="p-4">
      <p className="text-sm font-semibold">Privacy</p>
      <p className="text-xs text-muted-foreground">What BelPay never collects:</p>
      <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
        {never.map((n) => (
          <li key={n} className="flex items-center gap-2 text-sm">
            <span className="grid size-5 place-items-center rounded-full bg-primary/15 text-[10px] text-primary">✕</span>
            {n}
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
