/**
 * Beldex adapter layer. The UI only talks to this interface, so swapping the
 * mock for a real implementation requires no UI changes.
 *
 * SECURITY: This app never handles, requests, or stores private keys.
 * Real signing must happen inside the Beldex Extension Wallet.
 */

export type PaymentStatus = "waiting" | "detected" | "confirmed" | "expired";

export interface PaymentRequest {
  id: string;
  amount: number; // BDX
  address: string; // public receiving (integrated/sub) address only
  createdAt: number;
  expiresAt: number;
}

export interface PaymentStatusResult {
  id: string;
  status: PaymentStatus;
  confirmations: number;
}

export interface NetworkInfo {
  network: "mainnet" | "testnet" | "mock";
  height: number;
  requiredConfirmations: number;
}

export interface BeldexAdapter {
  createPaymentRequest(amount: number): Promise<PaymentRequest>;
  getPaymentStatus(id: string): Promise<PaymentStatusResult>;
  getNetworkInfo(): Promise<NetworkInfo>;
}

const TTL_MS = 15 * 60 * 1000;
const B58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

function fakeAddress() {
  let s = "bx";
  for (let i = 0; i < 95; i++) s += B58[Math.floor(Math.random() * B58.length)];
  return s;
}

export class MockBeldexAdapter implements BeldexAdapter {
  private requests = new Map<string, PaymentRequest>();

  async createPaymentRequest(amount: number): Promise<PaymentRequest> {
    // TODO: Replace with Beldex Web3.js SDK call that derives a fresh
    // subaddress / integrated address from the merchant's view-only wallet.
    const now = Date.now();
    const req: PaymentRequest = {
      id: "pay_" + Math.random().toString(36).slice(2, 10),
      amount,
      address: fakeAddress(),
      createdAt: now,
      expiresAt: now + TTL_MS,
    };
    this.requests.set(req.id, req);
    return req;
  }

  async getPaymentStatus(id: string): Promise<PaymentStatusResult> {
    // TODO: Replace with Beldex Web3.js SDK polling of incoming transfers
    // (view-key scan) for this address, counting confirmations.
    const req = this.requests.get(id);
    if (!req) return { id, status: "expired", confirmations: 0 };
    const elapsed = Date.now() - req.createdAt;
    if (Date.now() > req.expiresAt) return { id, status: "expired", confirmations: 0 };
    if (elapsed > 12000) return { id, status: "confirmed", confirmations: 10 };
    if (elapsed > 5000)
      return { id, status: "detected", confirmations: Math.floor((elapsed - 5000) / 1000) };
    return { id, status: "waiting", confirmations: 0 };
  }

  async getNetworkInfo(): Promise<NetworkInfo> {
    // TODO: Fetch from Beldex Web3.js SDK / connected Extension Wallet.
    return { network: "mock", height: 3_412_000 + Math.floor(Date.now() / 120000) % 1000, requiredConfirmations: 10 };
  }
}

// TODO: Add ExtensionWalletAdapter that lets the customer pay via the
// Beldex Extension Wallet (window.beldex?) — signing stays in the wallet.
export const beldex: BeldexAdapter = new MockBeldexAdapter();
