"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { Sparkles } from "lucide-react";
import { useStore } from "@/lib/state/store";

export function LevelUpToast() {
  const toast = useStore((state) => state.levelUpToast);
  const clear = useStore((state) => state.clearLevelUpToast);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => clear(), 3000);
    return () => clearTimeout(timer);
  }, [toast, clear]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 right-6 z-50 rounded-2xl border border-primary/40 bg-primary/20 px-5 py-4 text-sm text-white shadow-lg"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5" />
            Agent level up! Level {toast.level}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
