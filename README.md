# BelPay Checkout

A private payment checkout widget for the Beldex (BDX) network.
**Status: Prototype (Milestone 1a). All data is simulated.**

## What it is
A drop-in "Pay with Beldex" checkout for merchants: payment modal,
live status timeline, and a merchant dashboard. The goal is a
non-custodial, privacy-first payment layer that developers can
integrate in a few lines.

## Current status
| Component | Status |
|---|---|
| Store demo + checkout modal | Done (simulated data) |
| Merchant dashboard | Done (simulated data) |
| Adapter interface (`BeldexAdapter`) | Done |
| Live testnet reads (Beldex Web3.js SDK) | Milestone 1b |
| Extension Wallet payments | Milestone 2 |
| Mainnet + plugin/examples | Milestone 3 |

## Architecture
The UI never talks to the blockchain directly. All network access goes
through `src/lib/beldexAdapter.ts`:
- `createPaymentRequest(amount)`
- `getPaymentStatus(id)`
- `getNetworkInfo()`

`MockBeldexAdapter` is used today; a real adapter built on the Beldex
Web3.js SDK will replace it without UI changes.

## Privacy and security principles
- Non-custodial: the app never handles or stores private keys.
- No accounts, no analytics, no tracking.
- Frontend only at this stage; no backend.

## Run locally
npm install
npm run dev

## License
MIT
