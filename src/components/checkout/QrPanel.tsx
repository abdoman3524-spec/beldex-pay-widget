import { motion } from "motion/react";
import { QRCodeSVG } from "qrcode.react";

export function QrPanel({ value, scanning }: { value: string; scanning: boolean }) {
  return (
    <div className="relative mx-auto w-fit overflow-hidden rounded-2xl bg-qr p-3">
      <QRCodeSVG value={value} size={160} bgColor="transparent" fgColor="currentColor" className="text-qr-foreground" />
      {scanning && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-primary/40 to-transparent"
          initial={{ top: "-20%" }}
          animate={{ top: ["-20%", "100%"] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </div>
  );
}
