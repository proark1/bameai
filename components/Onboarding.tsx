"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Castle, MessageSquare, ScrollText, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/lib/state/settingsStore";

const steps = [
  {
    icon: Castle,
    title: "Welcome to Agent Kingdom",
    body: "Your company is a realm. Each AI agent runs a district — keep them busy and your kingdom grows."
  },
  {
    icon: MessageSquare,
    title: "Talk to your agents",
    body: "From the Company Map, enter any district to chat. Ask for a mission when you want work done."
  },
  {
    icon: ScrollText,
    title: "Accept & track missions",
    body: "Missions have steps, XP, and rewards. Complete them to earn coins, focus, intel, and reputation."
  },
  {
    icon: Trophy,
    title: "Level up and unlock skills",
    body: "Every completed mission grows agents. Spend skill points on the Skills tab to unlock powerful perks."
  }
];

export function Onboarding() {
  const hydrated = useSettingsStore((state) => state.hydrated);
  const onboardingComplete = useSettingsStore((state) => state.onboardingComplete);
  const update = useSettingsStore((state) => state.update);
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    setOpen(!onboardingComplete);
  }, [hydrated, onboardingComplete]);

  if (!open) return null;

  const step = steps[index];
  const isLast = index === steps.length - 1;

  const finish = () => {
    update({ onboardingComplete: true });
    setOpen(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[55] flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
          className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-primary/30 bg-card p-6 shadow-2xl"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/20 text-primary">
              <step.icon className="h-5 w-5" />
            </div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted">
              Tour {index + 1} / {steps.length}
            </p>
          </div>
          <h3 className="mt-4 text-2xl font-semibold text-foreground">{step.title}</h3>
          <p className="mt-2 text-sm text-muted">{step.body}</p>

          <div className="mt-6 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={finish}
              className="text-xs text-muted underline-offset-4 hover:text-foreground hover:underline"
            >
              Skip tour
            </button>
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                {steps.map((_, i) => (
                  <span
                    key={i}
                    className={
                      i === index
                        ? "h-1.5 w-5 rounded-full bg-primary"
                        : "h-1.5 w-1.5 rounded-full bg-white/20"
                    }
                  />
                ))}
              </div>
              <Button
                size="sm"
                onClick={() => {
                  if (isLast) finish();
                  else setIndex((i) => i + 1);
                }}
              >
                {isLast ? "Enter kingdom" : (
                  <span className="inline-flex items-center gap-1">
                    Next <ArrowRight className="h-3 w-3" />
                  </span>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
