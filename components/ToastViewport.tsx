"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Info, Sparkles } from "lucide-react";
import { useToastStore } from "@/lib/state/toastStore";
import { cn } from "@/lib/utils";

const toneStyles = {
  success: "border-emerald-400/40 bg-emerald-500/10 text-emerald-100",
  error: "border-rose-400/40 bg-rose-500/10 text-rose-100",
  info: "border-primary/40 bg-primary/10 text-foreground",
  reward: "border-amber-400/40 bg-amber-400/10 text-amber-100"
} as const;

const toneIcons = {
  success: CheckCircle2,
  error: AlertTriangle,
  info: Info,
  reward: Sparkles
} as const;

export function ToastViewport() {
  const toasts = useToastStore((state) => state.toasts);
  const dismiss = useToastStore((state) => state.dismiss);

  useEffect(() => {
    if (!toasts.length) return;
    const timers = toasts.map((t) =>
      setTimeout(() => dismiss(t.id), t.duration ?? 3500)
    );
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [toasts, dismiss]);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2 sm:bottom-6 sm:right-6"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = toneIcons[toast.tone];
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 40, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              onClick={() => dismiss(toast.id)}
              className={cn(
                "pointer-events-auto cursor-pointer rounded-2xl border px-4 py-3 shadow-xl backdrop-blur",
                toneStyles[toast.tone]
              )}
            >
              <div className="flex items-start gap-3">
                <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{toast.title}</p>
                  {toast.description && (
                    <p className="mt-0.5 text-xs opacity-90">{toast.description}</p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
