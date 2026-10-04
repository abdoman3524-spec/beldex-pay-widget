import { useEffect, useState } from "react";
import { motion, type Variants } from "motion/react";
import { beldex, type PaymentRequest, type PaymentStatusResult } from "@/lib/beldexAdapter";
import { shortAddress, upsertPayment } from "@/lib/paymentsStore";
import { Countdown } from "./Countdown";
import { StatusTimeline } from "./StatusTimeline";
import { QrPanel } from "./QrPanel";
import { SuccessState } from "./SuccessState";

const stagger: Variants = { show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };
const item: Variants = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 26 } } };

interface Props { amount: number; onClose: () => void; onPaid: () => void }

/** Render inside <AnimatePresence> so the exit spring plays. */
export function CheckoutModal({ amount, onClose, onPaid }: Props) {
  const [req, setReq] = useState<PaymentRequest | null>(null);
  const [st, setSt] = useState<PaymentStatusResult | null>(null);
  const [required, setRequired] = useState(10);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    beldex.getNetworkInfo().then((n) => setRequired(n.requiredConfirmations));
    beldex.createPaymentRequest(amount).then((r) => {
      setReq(r);
      upsertPayment({ id: r.id, amount, status: "waiting", time: r.createdAt, address: r.address });
    });
  }, [amount]);

  useEffect(() => {
    if (!req) return;
    const t = setInterval(async () => {
      const s = await beldex.getPaymentStatus(req.id);
      setSt((prev) => {
        if (prev?.status !== s.status) upsertPayment({ id: req.id, amount, status: s.status, time: req.createdAt, address: req.address });
        return s;
      });
      if (s.status === "confirmed" || s.status === "expired") clearInterval(t);
    }, 1000);
    return () => clearInterval(t);
  }, [req, amount]);

  const status = st?.status ?? "waiting";
  const copy = () => {
    if (!req) return;
    navigator.clipboard?.writeText(req.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-background/70 backdrop-blur-sm sm:items-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        initial={{ y: 60, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        className="glass w-full max-w-md rounded-t-3xl bg-popover/90 p-5 sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {!req ? (
          <p className="py-20 text-center text-sm text-muted-foreground">Generating unique address…</p>
        ) : status === "confirmed" ? (
          <SuccessState id={req.id} address={req.address} onDone={onPaid} />
        ) : (
          <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
            <motion.div variants={item} className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Amount due</p>
                <p className="text-3xl font-semibold tracking-tight" dir="ltr">{amount} <span className="text-primary">BDX</span></p>
              </div>
              <div className="flex items-center gap-2">
                {status === "expired" ? <span className="text-xs text-destructive">Expired</span> : <Countdown createdAt={req.createdAt} expiresAt={req.expiresAt} />}
                <button onClick={onClose} aria-label="Close" className="grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-secondary">✕</button>
              </div>
            </motion.div>

            <motion.div variants={item}>
              <QrPanel value={`beldex:${req.address}?tx_amount=${amount}`} scanning={status === "waiting"} />
            </motion.div>

            <motion.button variants={item} whileTap={{ scale: 0.98 }} onClick={copy} className="w-full rounded-xl border border-border bg-secondary/60 p-3 text-start hover:bg-secondary">
              <span className="flex justify-between text-xs text-muted-foreground">
                <span>{copied ? "Copied!" : "Unique address for this order · tap to copy"}</span>
                <span className="font-mono text-primary" dir="ltr">{shortAddress(req.address)}</span>
              </span>
              <span className="mt-1 block break-all font-mono text-[11px] leading-relaxed" dir="ltr">{req.address}</span>
            </motion.button>

            <motion.div variants={item} className="border-t border-border pt-4">
              <StatusTimeline status={status} confirmations={st?.confirmations ?? 0} required={required} />
            </motion.div>
            {/* TODO: Add "Pay with Beldex Extension Wallet" button once the extension
                provider is available. The wallet signs; this app never sees keys. */}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
