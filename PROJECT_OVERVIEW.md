# BelPay Checkout — Project Overview

Mobile-first demo of a private BDX checkout widget. Frontend only: no backend, no login,
no private keys. All data is simulated (banner on every page).

## Pages
- `/` Store — 3 products, animated cart, "Pay with Beldex" opens the checkout modal.
- `/dashboard` Merchant — animated stats (received / pending / paid), recharts bar chart,
  payments table (id, short address, amount, status, time), Integration snippet,
  Webhook simulator, Privacy card.

## Checkout modal
Spring open/close, staggered reveal, QR with scanning line while waiting, circular
countdown ring (teal → amber → red), animated status timeline, success ring + checkmark draw.
Each order gets a unique address from `createPaymentRequest`.

## Architecture
- `src/lib/beldexAdapter.ts` — `BeldexAdapter` interface (unchanged) + `MockBeldexAdapter`.
  TODOs mark Beldex Web3.js SDK and Extension Wallet integration points.
- `src/lib/paymentsStore.ts` — localStorage-backed payment list (browser only).
- `src/lib/theme.ts` — dark/light toggle (dark default, persisted).
- `src/components/` — small typed components: `checkout/*`, `dashboard/*`, `ui-motion.tsx`.

## Motion & accessibility
Framer Motion (`motion/react`) wrapped in `MotionConfig reducedMotion="user"` so
`prefers-reduced-motion` is respected. RTL-friendly logical spacing (`ms-`, `start-`, `text-start`).

## Design
Deep navy/teal gradient background, glass cards (`glass` utility), Manrope + JetBrains Mono.
