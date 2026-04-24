"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Coins, Flame } from "lucide-react";
import { useStore, xpNeeded } from "@/lib/state/store";
import { dailyQuests } from "@/lib/data/seed";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { XpBar } from "@/components/XpBar";
import { toast } from "@/lib/state/toastStore";
import { playSound } from "@/lib/fx/sound";
import { vibrate } from "@/lib/fx/haptics";

const statusStyles: Record<string, string> = {
  Idle: "bg-emerald-500/10 text-emerald-300",
  "In Mission": "bg-amber-500/10 text-amber-300",
  "Waiting on You": "bg-rose-500/10 text-rose-300"
};

const UPGRADE_COST_COINS = 50;
const UPGRADE_COST_FOCUS = 6;

export function MapGrid() {
  const agents = useStore((state) => state.agents);
  const resources = useStore((state) => state.resources);
  const upgradeBuilding = useStore((state) => state.upgradeBuilding);

  const missingReasons = (): string | null => {
    const missing: string[] = [];
    if (resources.coins < UPGRADE_COST_COINS) {
      missing.push(`${UPGRADE_COST_COINS - resources.coins} more coins`);
    }
    if (resources.focus < UPGRADE_COST_FOCUS) {
      missing.push(`${UPGRADE_COST_FOCUS - resources.focus} more focus`);
    }
    return missing.length ? `Need ${missing.join(" & ")}` : null;
  };

  const reason = missingReasons();
  const canUpgrade = !reason;

  const handleUpgrade = (agentId: string, agentName: string) => {
    const ok = upgradeBuilding(agentId);
    if (ok) {
      playSound("accept");
      vibrate("light");
      toast({
        tone: "success",
        title: `${agentName}'s building upgraded`,
        description: `-${UPGRADE_COST_COINS} coins · -${UPGRADE_COST_FOCUS} focus`
      });
    } else {
      playSound("error");
      vibrate("error");
      toast({
        tone: "error",
        title: "Not enough resources",
        description: missingReasons() ?? "Complete more missions to earn resources."
      });
    }
  };

  return (
    <div className="grid gap-6">
      <section className="rounded-3xl border border-white/10 bg-card p-5 shadow-lg sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Company Map</h2>
            <p className="text-sm text-muted">
              Welcome to your Company Map. Tap any district to talk to its agent.
            </p>
          </div>
          <div className="inline-flex w-fit items-center gap-3 rounded-2xl border border-white/10 bg-background px-4 py-2 text-xs text-muted">
            <span className="inline-flex items-center gap-1">
              <Coins className="h-3.5 w-3.5 text-amber-300" />
              {resources.coins}
            </span>
            <span className="inline-flex items-center gap-1">
              <Flame className="h-3.5 w-3.5 text-rose-300" />
              {resources.focus}
            </span>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {agents.map((agent, index) => {
            const required = xpNeeded(agent.level);
            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#1b2033] via-[#131a2b] to-[#0d1220] p-5 transition hover:-translate-y-0.5 hover:border-primary/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-xs uppercase tracking-[0.2em] text-muted">
                      {agent.building}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold">{agent.name}</h3>
                    <p className="truncate text-sm text-muted">{agent.role}</p>
                  </div>
                  <div className="text-right text-xs text-muted">
                    <p className="font-semibold text-foreground">Lv {agent.level}</p>
                    <p>Building {agent.buildingLevel}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <XpBar value={agent.xp} max={required} label="XP" />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Badge className={statusStyles[agent.status]}>{agent.status}</Badge>
                  <Badge className="bg-white/5 text-muted">
                    Missions: {agent.missions}
                  </Badge>
                  {agent.skillPoints > 0 && (
                    <Badge className="bg-primary/10 text-primary">
                      {agent.skillPoints} skill pt
                    </Badge>
                  )}
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-muted">
                    Mood: <span className="text-foreground">{agent.mood}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tooltip
                      content={
                        canUpgrade
                          ? `Costs ${UPGRADE_COST_COINS} coins + ${UPGRADE_COST_FOCUS} focus`
                          : reason
                      }
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={!canUpgrade}
                        onClick={() => handleUpgrade(agent.id, agent.name)}
                      >
                        Upgrade
                      </Button>
                    </Tooltip>
                    <Link href={`/agent/${agent.id}`}>
                      <Button size="sm" className="inline-flex items-center gap-1">
                        Enter <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-card p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Daily Quests</h3>
          <span className="text-xs text-muted">Reset in 19h</span>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dailyQuests.map((quest) => (
            <div
              key={quest.id}
              className="rounded-2xl border border-white/10 bg-background p-4"
            >
              <p className="text-sm font-semibold text-foreground">{quest.title}</p>
              <p className="mt-1 text-xs text-muted">{quest.summary}</p>
              <Link
                href={`/agent/${quest.agentId}`}
                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary"
              >
                Talk to agent <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
