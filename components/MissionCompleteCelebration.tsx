"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Coins, Flame, Gem, Sparkles, Star, Trophy } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useStore } from "@/lib/state/store";
import { Button } from "@/components/ui/button";
import { playSound } from "@/lib/fx/sound";
import { vibrate } from "@/lib/fx/haptics";

const confettiColors = ["#7c8cff", "#19c37d", "#fbbf24", "#f472b6", "#4fd1c5"];

export function MissionCompleteCelebration() {
  const event = useStore((state) => state.lastCompletion);
  const clear = useStore((state) => state.clearLastCompletion);
  const agents = useStore((state) => state.agents);

  const agentName = useMemo(
    () => (event ? agents.find((a) => a.id === event.agentId)?.name ?? "Agent" : ""),
    [event, agents]
  );

  useEffect(() => {
    if (!event) return;
    playSound(event.leveledUp ? "levelup" : "complete");
    vibrate(event.leveledUp ? "success" : "medium");
    const timer = setTimeout(() => clear(), event.leveledUp ? 4200 : 3200);
    return () => clearTimeout(timer);
  }, [event, clear]);

  const confettiPieces = useMemo(
    () =>
      Array.from({ length: 28 }).map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 360,
        y: -Math.random() * 240 - 40,
        rotate: Math.random() * 540,
        color: confettiColors[i % confettiColors.length],
        delay: Math.random() * 0.2
      })),
    [event?.id]
  );

  return (
    <AnimatePresence>
      {event && (
        <motion.div
          key={event.id}
          className="pointer-events-none fixed inset-0 z-[60] flex items-end justify-center px-4 pb-24 sm:items-center sm:pb-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="relative">
              {confettiPieces.map((piece) => (
                <motion.span
                  key={piece.id}
                  initial={{ opacity: 1, y: 0, x: 0, rotate: 0 }}
                  animate={{
                    opacity: 0,
                    y: piece.y,
                    x: piece.x,
                    rotate: piece.rotate
                  }}
                  transition={{ duration: 1.6, delay: piece.delay, ease: "easeOut" }}
                  className="absolute left-1/2 top-1/2 h-2 w-2 rounded-sm"
                  style={{ backgroundColor: piece.color }}
                />
              ))}
            </div>

            <motion.div
              role="status"
              aria-live="polite"
              initial={{ scale: 0.7, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="pointer-events-auto relative mx-auto w-full max-w-md rounded-3xl border border-primary/30 bg-card/95 p-6 text-center shadow-2xl"
            >
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary">
                {event.leveledUp ? (
                  <Trophy className="h-8 w-8" />
                ) : (
                  <Sparkles className="h-8 w-8" />
                )}
              </div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted">
                {event.leveledUp ? "Level Up!" : "Mission Complete"}
              </p>
              <h3 className="mt-1 text-xl font-semibold text-foreground">
                {event.missionTitle}
              </h3>
              <p className="mt-1 text-sm text-muted">
                {event.leveledUp
                  ? `${agentName} reached Level ${event.newLevel}. +1 skill point.`
                  : `${agentName} earned rewards for the kingdom.`}
              </p>

              <div className="mt-5 grid grid-cols-3 gap-2 text-xs">
                <Reward icon={<Star className="h-4 w-4" />} label="XP" value={event.rewardXp} />
                <Reward
                  icon={<Coins className="h-4 w-4" />}
                  label="Coins"
                  value={event.rewardResources.coins}
                />
                <Reward
                  icon={<Flame className="h-4 w-4" />}
                  label="Focus"
                  value={event.rewardResources.focus}
                />
                <Reward
                  icon={<Gem className="h-4 w-4" />}
                  label="Intel"
                  value={event.rewardResources.intel}
                />
                <Reward
                  icon={<Sparkles className="h-4 w-4" />}
                  label="Rep"
                  value={event.rewardResources.reputation}
                />
              </div>

              <Button className="mt-5 w-full" onClick={clear}>
                Continue
              </Button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Reward({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl border border-white/10 bg-background px-2 py-3 text-foreground">
      <div className="text-primary">{icon}</div>
      <p className="text-[10px] uppercase tracking-[0.25em] text-muted">{label}</p>
      <p className="text-sm font-semibold">+{value}</p>
    </div>
  );
}
