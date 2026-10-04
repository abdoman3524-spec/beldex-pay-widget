import type { PaymentStatus } from "@/lib/beldexAdapter";

const styles: Record<PaymentStatus, string> = {
  waiting: "bg-secondary text-muted-foreground",
  detected: "bg-warning/15 text-warning",
  confirmed: "bg-primary/15 text-primary",
  expired: "bg-destructive/15 text-destructive",
};

export function StatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${styles[status]}`}>
      {status}
    </span>
  );
}
