export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  glyph: string;
}

export const products: Product[] = [
  { id: "vpn", name: "Private VPN · 1 yr", description: "No-log masternode routing", price: 120, glyph: "◈" },
  { id: "mail", name: "Encrypted Mail", description: "Zero-access inbox, 50 GB", price: 45, glyph: "✉" },
  { id: "key", name: "Hardware Key", description: "Offline seed storage", price: 300, glyph: "⬢" },
];
