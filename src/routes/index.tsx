import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AppShell } from "@/components/AppShell";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import { GlassCard, MotionButton } from "@/components/ui-motion";
import { products, type Product } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BelPay Checkout — Private Beldex payments demo" },
      { name: "description", content: "Demo store showing a private BDX checkout widget for the Beldex blockchain." },
      { property: "og:title", content: "BelPay Checkout — Private Beldex payments demo" },
      { property: "og:description", content: "Demo store showing a private BDX checkout widget for the Beldex blockchain." },
    ],
  }),
  component: Store,
});

function ProductCard({ p, qty, onAdd }: { p: Product; qty: number; onAdd: () => void }) {
  return (
    <GlassCard hover className="flex items-center gap-3 p-3.5">
      <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/15 text-lg text-primary">{p.glyph}</div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{p.name}</p>
        <p className="truncate text-xs text-muted-foreground">{p.description}</p>
        <p className="mt-0.5 text-sm font-medium text-primary" dir="ltr">{p.price} BDX</p>
      </div>
      <MotionButton variant="ghost" onClick={onAdd} className="px-3 py-2 text-sm">
        {qty > 0 ? `+ ${qty}` : "Add"}
      </MotionButton>
    </GlassCard>
  );
}

function Store() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [open, setOpen] = useState(false);
  const items = products.filter((p) => cart[p.id]);
  const total = items.reduce((s, p) => s + p.price * (cart[p.id] ?? 0), 0);

  return (
    <AppShell>
      <h1 className="text-2xl font-semibold tracking-tight">Private goods</h1>
      <p className="mt-1 text-sm text-muted-foreground">Pay anonymously in BDX. No account needed.</p>
      <div className="mt-5 space-y-2.5">
        {products.map((p) => (
          <ProductCard key={p.id} p={p} qty={cart[p.id] ?? 0} onAdd={() => setCart((c) => ({ ...c, [p.id]: (c[p.id] ?? 0) + 1 }))} />
        ))}
      </div>

      <GlassCard className="mt-6 p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Cart</h2>
          {items.length > 0 && <button onClick={() => setCart({})} className="text-xs text-muted-foreground hover:text-foreground">Clear</button>}
        </div>
        {items.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">Your cart is empty.</p>
        ) : (
          <ul className="mt-2 space-y-1.5 text-sm">
            <AnimatePresence initial={false}>
              {items.map((p) => (
                <motion.li key={p.id} layout initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex justify-between gap-2">
                  <span>{p.name} × {cart[p.id]}</span>
                  <span dir="ltr">{p.price * (cart[p.id] ?? 0)} BDX</span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
        <div className="mt-3 flex justify-between border-t border-border pt-3 font-semibold">
          <span>Total</span>
          <motion.span key={total} initial={{ scale: 1.15 }} animate={{ scale: 1 }} dir="ltr">{total} BDX</motion.span>
        </div>
        <MotionButton disabled={total === 0} onClick={() => setOpen(true)} className="mt-4 w-full py-3.5">
          Pay with Beldex
        </MotionButton>
      </GlassCard>

      <AnimatePresence>
        {open && <CheckoutModal amount={total} onClose={() => setOpen(false)} onPaid={() => { setOpen(false); setCart({}); }} />}
      </AnimatePresence>
    </AppShell>
  );
}
