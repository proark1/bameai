"use client";

import { useState } from "react";
import { useStore } from "@/lib/state/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const statusFilters = ["All", "Active", "Completed", "Archived"] as const;

export default function MissionsPage() {
  const missions = useStore((state) => state.missions);
  const completeMission = useStore((state) => state.completeMission);
  const updateMission = useStore((state) => state.updateMission);
  const [filter, setFilter] = useState<(typeof statusFilters)[number]>("All");

  const filtered = missions.filter((mission) =>
    filter === "All" ? true : mission.status === filter
  );

  return (
    <div className="grid gap-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Missions</h1>
          <p className="text-sm text-muted">
            Track active quests, mark progress, and archive wins.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((status) => (
            <Button
              key={status}
              size="sm"
              variant={filter === status ? "default" : "outline"}
              onClick={() => setFilter(status)}
            >
              {status}
            </Button>
          ))}
        </div>
      </header>

      <div className="grid gap-4">
        {filtered.map((mission) => (
          <div
            key={mission.id}
            className="rounded-3xl border border-white/10 bg-card p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted">
                  {mission.priority} Priority
                </p>
                <h3 className="text-xl font-semibold">{mission.title}</h3>
                <p className="text-sm text-muted">{mission.objective}</p>
              </div>
              <Badge className="bg-white/10 text-foreground">
                {mission.status}
              </Badge>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              {mission.steps.map((step) => (
                <li key={step.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={step.done}
                    onChange={() =>
                      updateMission(mission.id, {
                        steps: mission.steps.map((item) =>
                          item.id === step.id ? { ...item, done: !item.done } : item
                        )
                      })
                    }
                    className="h-4 w-4 rounded border-white/20 bg-background text-primary"
                  />
                  <span className={step.done ? "line-through opacity-70" : ""}>
                    {step.text}
                  </span>
                </li>
              ))}
            </ul>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
                <div>
                  Rewards: {mission.rewardXp} XP · {mission.rewardResources.coins} coins ·{" "}
                  {mission.rewardResources.intel} intel
                </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const title = window.prompt("Update mission title", mission.title);
                    if (title) {
                      updateMission(mission.id, { title });
                    }
                  }}
                >
                  Edit
                </Button>
                {mission.status !== "Completed" && (
                  <Button size="sm" onClick={() => completeMission(mission.id)}>
                    Mark Complete
                  </Button>
                )}
                {mission.status !== "Archived" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateMission(mission.id, { status: "Archived" })}
                  >
                    Archive
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
