"use client";

import Link from "next/link";
import { Bolt, Flame, Shield, Sparkles, Star, Trophy } from "lucide-react";
import { useMetaStore } from "@/lib/state/metaStore";
import { useStore } from "@/lib/state/store";

const achievementIcons = {
  flame: Flame,
  trophy: Trophy,
  star: Star,
  shield: Shield,
  bolt: Bolt
} as const;

export default function HomePage() {
  const streak = useMetaStore((state) => state.streakDays);
  const totalMissions = useMetaStore((state) => state.totalMissionsCompleted);
  const totalXp = useMetaStore((state) => state.totalXpEarned);
  const achievements = useMetaStore((state) => state.achievements);
  const agents = useStore((state) => state.agents);

  const unlocked = achievements.filter((a) => a.unlockedAt);
  const locked = achievements.filter((a) => !a.unlockedAt);
  const kingdomLevel = agents.reduce((sum, a) => sum + a.level, 0);

  return (
    <section className="grid gap-6">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#1b2240] via-[#101627] to-[#090d17] p-8 shadow-lg sm:p-10">
        <div className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-muted">
            <Sparkles className="h-4 w-4" />
            Agent Kingdom
          </div>
          <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
            Your company, reimagined as a strategy game.
          </h1>
          <p className="max-w-2xl text-base text-muted sm:text-lg">
            Build districts for each AI agent, complete missions, and unlock skills
            to level up your organization.
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Link
              href="/map"
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:bg-primary/90"
            >
              Enter the Company Map
            </Link>
            <Link
              href="/leaderboard"
              className="rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary/50"
            >
              View Progress
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Flame className="h-4 w-4" />}
          label="Day streak"
          value={`${streak}`}
          hint="Come back daily"
        />
        <StatCard
          icon={<Trophy className="h-4 w-4" />}
          label="Missions complete"
          value={`${totalMissions}`}
          hint="All-time"
        />
        <StatCard
          icon={<Bolt className="h-4 w-4" />}
          label="XP earned"
          value={`${totalXp}`}
          hint="Across agents"
        />
        <StatCard
          icon={<Star className="h-4 w-4" />}
          label="Kingdom level"
          value={`${kingdomLevel}`}
          hint="Sum of agent levels"
        />
      </div>

      <div className="rounded-3xl border border-white/10 bg-card p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Recent Achievements</h2>
            <p className="text-sm text-muted">
              {unlocked.length} of {achievements.length} unlocked
            </p>
          </div>
          <Link
            href="/leaderboard"
            className="text-xs font-semibold text-primary hover:underline"
          >
            See all →
          </Link>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[...unlocked.slice(-3), ...locked.slice(0, 3)]
            .slice(0, 6)
            .map((achievement) => {
              const Icon = achievementIcons[achievement.icon];
              const done = !!achievement.unlockedAt;
              return (
                <div
                  key={achievement.id}
                  className={
                    done
                      ? "flex items-center gap-3 rounded-2xl border border-primary/40 bg-primary/10 p-3"
                      : "flex items-center gap-3 rounded-2xl border border-white/10 bg-background p-3 opacity-70"
                  }
                >
                  <div
                    className={
                      done
                        ? "flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 text-primary"
                        : "flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-muted"
                    }
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {achievement.title}
                    </p>
                    <p className="truncate text-xs text-muted">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}

function StatCard({
  icon,
  label,
  value,
  hint
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-card p-5">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted">
        <span className="text-primary">{icon}</span>
        {label}
      </div>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}
