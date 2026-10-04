import { useSyncExternalStore } from "react";
import type { PaymentStatus } from "./beldexAdapter";

export interface PaymentRecord {
  id: string;
  amount: number;
  status: PaymentStatus;
  time: number;
}

const KEY = "belpay.payments";
const listeners = new Set<() => void>();
let cache: PaymentRecord[] | null = null;
const EMPTY: PaymentRecord[] = [];

function read(): PaymentRecord[] {
  if (cache) return cache;
  try {
    cache = JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    cache = [];
  }
  return cache!;
}

export function upsertPayment(p: PaymentRecord) {
  const list = read().filter((x) => x.id !== p.id);
  cache = [p, ...list];
  localStorage.setItem(KEY, JSON.stringify(cache));
  listeners.forEach((l) => l());
}

export function usePayments() {
  return useSyncExternalStore(
    (l) => (listeners.add(l), () => listeners.delete(l)),
    read,
    () => EMPTY,
  );
}
