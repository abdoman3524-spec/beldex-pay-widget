import { useEffect, useState } from "react";
import { motion } from "motion/react";

const R = 22;
const C = 2 * Math.PI * R;

export function Countdown({ createdAt, expiresAt }: { createdAt: number; expiresAt: number }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const left = Math.max(0, expiresAt - now);
  const frac = left / (expiresAt - createdAt);
  const color = frac > 0.5 ? "var(--primary)" : frac > 0.2 ? "var(--warning)" : "var(--destructive)";
  const m = String(Math.floor(left / 60000)).padStart(2, "0");
  const s = String(Math.floor((left % 60000) / 1000)).padStart(2, "0");
  return (
    <div className="relative grid size-14 place-items-center">
      <svg viewBox="0 0 50 50" className="absolute inset-0 -rotate-90">
        <circle cx="25" cy="25" r={R} fill="none" stroke="var(--border)" strokeWidth="3" />
        <motion.circle
          cx="25" cy="25" r={R} fill="none" strokeWidth="3" strokeLinecap="round"
          strokeDasharray={C}
          animate={{ strokeDashoffset: C * (1 - frac), stroke: color }}
          transition={{ duration: 1, ease: "linear" }}
        />
      </svg>
      <span className="font-mono text-[11px] tabular-nums" dir="ltr">{m}:{s}</span>
    </div>
  );
}
