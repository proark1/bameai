"use client";

import { useEffect } from "react";
import { useSettingsStore } from "@/lib/state/settingsStore";
import { useMetaStore } from "@/lib/state/metaStore";
import { useToastStore } from "@/lib/state/toastStore";
import { playSound } from "@/lib/fx/sound";
import { vibrate } from "@/lib/fx/haptics";

export function Providers({ children }: { children: React.ReactNode }) {
  const hydrateSettings = useSettingsStore((state) => state.hydrate);
  const hydrateMeta = useMetaStore((state) => state.hydrate);
  const touchStreak = useMetaStore((state) => state.touchStreak);
  const reducedMotion = useSettingsStore((state) => state.reducedMotion);

  useEffect(() => {
    hydrateSettings();
    hydrateMeta();
    touchStreak();
  }, [hydrateSettings, hydrateMeta, touchStreak]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute(
      "data-reduced-motion",
      reducedMotion ? "true" : "false"
    );
  }, [reducedMotion]);

  // Watch for newly unlocked achievements and surface them as toasts.
  useEffect(() => {
    const unsub = useMetaStore.subscribe((state, prev) => {
      if (state.pendingUnlocks.length <= prev.pendingUnlocks.length) return;
      const newOnes = state.pendingUnlocks.slice(prev.pendingUnlocks.length);
      newOnes.forEach((achievement) => {
        useToastStore.getState().push({
          tone: "reward",
          title: `Achievement unlocked — ${achievement.title}`,
          description: achievement.description
        });
      });
      if (newOnes.length) {
        playSound("unlock");
        vibrate("success");
      }
      useMetaStore.getState().clearPendingUnlocks();
    });
    return () => unsub();
  }, []);

  return <>{children}</>;
}
