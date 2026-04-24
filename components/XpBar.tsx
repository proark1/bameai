"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type XpBarProps = {
  value: number;
  max: number;
  label?: string;
  className?: string;
};

export function XpBar({ value, max, label, className }: XpBarProps) {
  const safeMax = Math.max(1, max);
  const pct = Math.max(0, Math.min(100, (value / safeMax) * 100));

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <div className="mb-1 flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-muted">
          <span>{label}</span>
          <span>
            {value} / {safeMax}
          </span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        className="relative h-2 w-full overflow-hidden rounded-full bg-white/10"
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 22 }}
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary via-accent to-secondary shadow-[0_0_12px_rgba(124,140,255,0.6)]"
        />
      </div>
    </div>
  );
}
