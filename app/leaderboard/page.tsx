"use client";

import { Bolt, Flame, Shield, Star, Trophy } from "lucide-react";
import { useMetaStore } from "@/lib/state/metaStore";
import { useStore, xpNeeded } from "@/lib/state/store";
import { XpBar } from "@/components/XpBar";

const achievementIcons = {
  flame: Flame,
  trophy: Trophy,
  star: Star,
  shield: Shield,
  bolt: Bolt
} as const;

export default function LeaderboardPage() {
  const agents = useStore((state) => state.agents);
  const missions = useStore((state) => state.missions);
  const streak = useMetaStore((state) => state.streakDays);
  const totalMissions = useMetaStore((state) => state.totalMissionsCompleted);
  const totalXp = useMetaStore((state) => state.totalXpEarned);
  const achievements = useMetaStore((state) => state.achievements);

  const ranked = [...agents].sort((a, b) => {
    if (b.level !== a.level) return b.level - a.level;
    return b.xp - a.xp;
  });

  const completedByAgent = (agentId: string) =>
    missions.filter((m) => m.agentId === agentId && m.status === "Completed")
      .length;

  const unlockedCount = achievements.filter((a) => a.unlockedAt).length;

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="text-3xl font-semibold">Leaderboard</h1>
        <p className="text-sm text-muted">
          Track your agents, streak, and achievements across the kingdom.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={<Flame className="h-4 w-4" />}
          label="Streak"
          value={`${streak} day${streak === 1 ? "" : "s"}`}
        />
        <SummaryCard
          icon={<Trophy className="h-4 w-4" />}
          label="Missions complete"
          value={`${totalMissions}`}
        />
        <SummaryCard
          icon={<Bolt className="h-4 w-4" />}
          label="Total XP"
          value={`${totalXp}`}
        />
      </div>

      <section className="rounded-3xl border border-white/10 bg-card p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Agent Rankings</h2>
          <span className="text-xs text-muted">Sorted by level · XP</span>
        </div>
        <ol className="mt-4 divide-y divide-white/5">
          {ranked.map((agent, index) => (
            <li
              key={agent.id}
              className="flex flex-wrap items-center gap-4 py-3 first:pt-0 last:pb-0"
            >
              <span
                className={
                  index === 0
                    ? "flex h-9 w-9 items-center justify-center rounded-full bg-amber-400/20 text-sm font-bold text-amber-200"
                    : index < 3
                      ? "flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary"
                      : "flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-sm font-semibold text-muted"
                }
              >
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {agent.name}
                </p>
                <p className="truncate text-xs text-muted">{agent.role}</p>
              </div>
              <div className="hidden w-48 sm:block">
                <XpBar value={agent.xp} max={xpNeeded(agent.level)} />
              </div>
              <div className="text-right text-xs text-muted">
                <p className="text-sm font-semibold text-foreground">
                  Lv {agent.level}
                </p>
                <p>{completedByAgent(agent.id)} completed</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-3xl border border-white/10 bg-card p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Achievements</h2>
          <span className="text-xs text-muted">
            {unlockedCount} / {achievements.length} unlocked
          </span>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((achievement) => {
            const Icon = achievementIcons[achievement.icon];
            const unlocked = !!achievement.unlockedAt;
            return (
              <div
                key={achievement.id}
                className={
                  unlocked
                    ? "flex items-start gap-3 rounded-2xl border border-primary/40 bg-primary/10 p-4"
                    : "flex items-start gap-3 rounded-2xl border border-white/10 bg-background p-4 opacity-75"
                }
              >
                <div
                  className={
                    unlocked
                      ? "flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary"
                      : "flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-muted"
                  }
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    {achievement.title}
                  </p>
                  <p className="text-xs text-muted">{achievement.description}</p>
                  {unlocked && achievement.unlockedAt && (
                    <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-primary">
                      Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-card p-5">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted">
        <span className="text-primary">{icon}</span>
        {label}
      </div>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  );
}
