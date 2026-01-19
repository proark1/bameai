"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useStore } from "@/lib/state/store";
import { dailyQuests } from "@/lib/data/seed";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const statusStyles: Record<string, string> = {
  Idle: "bg-emerald-500/10 text-emerald-300",
  "In Mission": "bg-amber-500/10 text-amber-300",
  "Waiting on You": "bg-rose-500/10 text-rose-300"
};

export function MapGrid() {
  const agents = useStore((state) => state.agents);
  const resources = useStore((state) => state.resources);
  const upgradeBuilding = useStore((state) => state.upgradeBuilding);
  const canUpgrade = (resources.coins >= 50 && resources.focus >= 6);

  return (
    <div className="grid gap-6">
      <section className="rounded-3xl border border-white/10 bg-card p-6 shadow-lg">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold">Company Map</h2>
            <p className="text-sm text-muted">
              Welcome to your Company Map. Click a building to talk to an agent.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-background px-4 py-2 text-xs text-muted">
            Grid: 12x8 | Terrain: Neon Highlands
          </div>
        </div>
        <div className="mt-6 grid grid-cols-12 gap-4">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="col-span-12 rounded-2xl border border-white/10 bg-gradient-to-br from-[#1b2033] via-[#131a2b] to-[#0d1220] p-5 md:col-span-6 xl:col-span-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">
                    {agent.building}
                  </p>
                  <h3 className="text-lg font-semibold">{agent.name}</h3>
                  <p className="text-sm text-muted">{agent.role}</p>
                </div>
                <div className="text-right text-xs text-muted">
                  <p className="font-semibold text-foreground">Lv {agent.level}</p>
                  <p>Building {agent.buildingLevel}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Badge className={statusStyles[agent.status]}>{agent.status}</Badge>
                <Badge className="bg-white/5 text-muted">
                  Missions: {agent.missions}
                </Badge>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-muted">
                  Mood: <span className="text-foreground">{agent.mood}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!canUpgrade}
                    onClick={() => upgradeBuilding(agent.id)}
                  >
                    Upgrade (50c/6f)
                  </Button>
                  <Link href={`/agent/${agent.id}`}>
                    <Button size="sm">Enter</Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-card p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Daily Quests</h3>
          <span className="text-xs text-muted">Reset in 19h</span>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {dailyQuests.map((quest) => (
            <div
              key={quest.id}
              className="rounded-2xl border border-white/10 bg-background p-4"
            >
              <p className="text-sm font-semibold text-foreground">{quest.title}</p>
              <p className="text-xs text-muted">{quest.summary}</p>
              <Link
                href={`/agent/${quest.agentId}`}
                className="mt-3 inline-flex text-xs font-semibold text-primary"
              >
                Talk to agent →
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
