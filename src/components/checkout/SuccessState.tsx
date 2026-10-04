import { motion } from "motion/react";
import { MotionButton } from "@/components/ui-motion";
import { shortAddress } from "@/lib/paymentsStore";

export function SuccessState({ id, address, onDone }: { id: string; address: string; onDone: () => void }) {
  return (
    <div className="py-6 text-center">
      <div className="relative mx-auto grid size-20 place-items-center">
        {[0, 0.3].map((d) => (
          <motion.span
            key={d}
            className="absolute inset-0 rounded-full border-2 border-primary"
            initial={{ scale: 0.6, opacity: 0.8 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 1.4, delay: d, ease: "easeOut" }}
          />
        ))}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="grid size-20 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow"
        >
          <svg viewBox="0 0 24 24" className="size-9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <motion.path d="M5 12l5 5 9-10" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.25 }} />
          </svg>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <p className="mt-5 font-semibold">Payment confirmed</p>
        <p className="mt-1 font-mono text-xs text-muted-foreground" dir="ltr">{id} · {shortAddress(address)}</p>
        <MotionButton onClick={onDone} className="mt-6 w-full py-3">Done</MotionButton>
      </motion.div>
    </div>
  );
}
