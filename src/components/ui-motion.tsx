import { motion, type HTMLMotionProps } from "motion/react";

/** Glass card with a subtle hover lift. */
export function GlassCard({ className = "", hover = false, ...props }: HTMLMotionProps<"div"> & { hover?: boolean }) {
  return (
    <motion.div
      whileHover={hover ? { y: -2 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`glass rounded-2xl ${className}`}
      {...props}
    />
  );
}

const variants = {
  primary: "bg-primary text-primary-foreground shadow-glow",
  ghost: "bg-secondary text-secondary-foreground hover:bg-accent",
} as const;

export function MotionButton({ variant = "primary", className = "", ...props }: HTMLMotionProps<"button"> & { variant?: keyof typeof variants }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`rounded-xl font-medium transition-colors disabled:pointer-events-none disabled:opacity-40 disabled:shadow-none ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
