"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { Sparkles } from "lucide-react";
import { useStore } from "@/lib/state/store";
import { playSound } from "@/lib/fx/sound";
import { vibrate } from "@/lib/fx/haptics";

export function LevelUpToast() {
  const toast = useStore((state) => state.levelUpToast);
  const clear = useStore((state) => state.clearLevelUpToast);

  useEffect(() => {
    if (!toast) return;
    playSound("levelup");
    vibrate("success");
    const timer = setTimeout(() => clear(), 3000);
    return () => clearTimeout(timer);
  }, [toast, clear]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="fixed bottom-6 left-1/2 z-[55] -translate-x-1/2 rounded-2xl border border-primary/40 bg-primary/20 px-5 py-4 text-sm text-foreground shadow-lg backdrop-blur"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-2xl border border-primary/40 animate-bloom"
          />
          <div className="relative flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted">
                Level Up
              </p>
              <p className="text-sm font-semibold">Agent reached Level {toast.level}!</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
