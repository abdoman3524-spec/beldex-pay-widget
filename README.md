# BelPay Checkout

Demo of a private payment checkout widget for the Beldex (BDX) blockchain.

> Demo mode: all data is simulated. No private keys are ever handled or stored.

## Pages
- `/` — demo store, cart, "Pay with Beldex" checkout modal
- `/dashboard` — merchant payments table and total

## Architecture
- `src/lib/beldexAdapter.ts` — `BeldexAdapter` interface + `MockBeldexAdapter`.
  TODOs mark where the Beldex Web3.js SDK and Extension Wallet plug in.

## TODO
- Real adapter, configuration, deployment notes.
