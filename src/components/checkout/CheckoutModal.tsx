import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { beldex, type PaymentRequest, type PaymentStatusResult } from "@/lib/beldexAdapter";
import { upsertPayment } from "@/lib/paymentsStore";
import { Countdown } from "./Countdown";
import { StatusTimeline } from "./StatusTimeline";

export function CheckoutModal({ amount, onClose, onPaid }: { amount: number; onClose: () => void; onPaid: () => void }) {
  const [req, setReq] = useState<PaymentRequest | null>(null);
  const [st, setSt] = useState<PaymentStatusResult | null>(null);
  const [required, setRequired] = useState(10);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    beldex.getNetworkInfo().then((n) => setRequired(n.requiredConfirmations));
    beldex.createPaymentRequest(amount).then((r) => {
      setReq(r);
      upsertPayment({ id: r.id, amount, status: "waiting", time: r.createdAt });
    });
  }, [amount]);

  useEffect(() => {
    if (!req) return;
    const t = setInterval(async () => {
      const s = await beldex.getPaymentStatus(req.id);
      setSt((prev) => {
        if (prev?.status !== s.status) upsertPayment({ id: req.id, amount, status: s.status, time: req.createdAt });
        return s;
      });
      if (s.status === "confirmed" || s.status === "expired") clearInterval(t);
    }, 1000);
    return () => clearInterval(t);
  }, [req, amount]);

  const status = st?.status ?? "waiting";
  const uri = req ? `beldex:${req.address}?tx_amount=${amount}` : "";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 backdrop-blur-sm animate-in fade-in sm:items-center" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md rounded-t-3xl border border-border bg-card p-6 shadow-2xl animate-in slide-in-from-bottom-8 duration-300 sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Amount due</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight" dir="ltr">{amount} <span className="text-primary">BDX</span></p>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-full p-2 text-muted-foreground hover:bg-secondary">✕</button>
        </div>

        {!req ? (
          <p className="py-16 text-center text-sm text-muted-foreground">Generating private address…</p>
        ) : status === "confirmed" ? (
          <div className="py-8 text-center animate-in zoom-in-95">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-primary text-2xl text-primary-foreground">✓</div>
            <p className="mt-4 font-medium">Payment confirmed</p>
            <p className="text-xs text-muted-foreground font-mono" dir="ltr">{req.id}</p>
            <button onClick={onPaid} className="mt-6 w-full rounded-xl bg-primary py-3 font-medium text-primary-foreground">Done</button>
          </div>
        ) : (
          <>
            <div className="mt-5 flex justify-center rounded-2xl bg-qr p-4">
              <QRCodeSVG value={uri} size={176} bgColor="transparent" fgColor="currentColor" className="text-qr-foreground" />
            </div>
            <button
              onClick={() => { navigator.clipboard?.writeText(req.address); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
              className="mt-4 w-full rounded-xl border border-border bg-secondary/50 p-3 text-start transition-colors hover:bg-secondary"
            >
              <span className="block text-xs text-muted-foreground">{copied ? "Copied!" : "Payment address · tap to copy"}</span>
              <span className="block break-all font-mono text-xs" dir="ltr">{req.address}</span>
            </button>
            <div className="mt-5 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{status === "expired" ? "Expired" : "Expires in"}</span>
              <Countdown expiresAt={req.expiresAt} />
            </div>
            <div className="mt-5 border-t border-border pt-5">
              <StatusTimeline status={status} confirmations={st?.confirmations ?? 0} required={required} />
            </div>
            {/* TODO: Add "Pay with Beldex Extension Wallet" button once the extension
                provider is available. The wallet signs; this app never sees keys. */}
          </>
        )}
      </div>
    </div>
  );
}
