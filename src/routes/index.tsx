import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";
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
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/40">
      <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-secondary text-xl text-primary">{p.glyph}</div>
      <div className="min-w-0 flex-1">
        <p className="font-medium">{p.name}</p>
        <p className="truncate text-xs text-muted-foreground">{p.description}</p>
        <p className="mt-1 text-sm" dir="ltr">{p.price} BDX</p>
      </div>
      <button onClick={onAdd} className="rounded-xl bg-secondary px-3 py-2 text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors">
        {qty > 0 ? `+ (${qty})` : "Add"}
      </button>
    </div>
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
      <div className="mt-6 space-y-3">
        {products.map((p) => (
          <ProductCard key={p.id} p={p} qty={cart[p.id] ?? 0} onAdd={() => setCart((c) => ({ ...c, [p.id]: (c[p.id] ?? 0) + 1 }))} />
        ))}
      </div>

      <section className="mt-8 rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Cart</h2>
          {items.length > 0 && <button onClick={() => setCart({})} className="text-xs text-muted-foreground hover:text-foreground">Clear</button>}
        </div>
        {items.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">Your cart is empty.</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {items.map((p) => (
              <li key={p.id} className="flex justify-between gap-2">
                <span>{p.name} × {cart[p.id]}</span>
                <span dir="ltr">{p.price * (cart[p.id] ?? 0)} BDX</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex justify-between border-t border-border pt-4 font-medium">
          <span>Total</span>
          <span dir="ltr">{total} BDX</span>
        </div>
        <button
          disabled={total === 0}
          onClick={() => setOpen(true)}
          className="mt-4 w-full rounded-xl bg-primary py-3.5 font-medium text-primary-foreground shadow-glow transition-all hover:brightness-110 disabled:opacity-40 disabled:shadow-none"
        >
          Pay with Beldex
        </button>
      </section>

      {open && <CheckoutModal amount={total} onClose={() => setOpen(false)} onPaid={() => { setOpen(false); setCart({}); }} />}
    </AppShell>
  );
}
