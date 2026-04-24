"use client";

import { useMemo, useState } from "react";
import { ScrollText } from "lucide-react";
import { useStore } from "@/lib/state/store";
import { useMetaStore } from "@/lib/state/metaStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm";
import { EmptyState } from "@/components/EmptyState";
import { toast } from "@/lib/state/toastStore";
import { playSound } from "@/lib/fx/sound";
import { vibrate } from "@/lib/fx/haptics";

const statusFilters = ["All", "Active", "Completed", "Archived"] as const;

export default function MissionsPage() {
  const missions = useStore((state) => state.missions);
  const completeMission = useStore((state) => state.completeMission);
  const updateMission = useStore((state) => state.updateMission);
  const registerMissionComplete = useMetaStore(
    (state) => state.registerMissionComplete
  );
  const [filter, setFilter] = useState<(typeof statusFilters)[number]>("All");
  const [editTarget, setEditTarget] = useState<{
    id: string;
    title: string;
    objective: string;
  } | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editObjective, setEditObjective] = useState("");

  const filtered = useMemo(
    () =>
      missions.filter((mission) =>
        filter === "All" ? true : mission.status === filter
      ),
    [missions, filter]
  );

  const activeCount = missions.filter((m) => m.status === "Active").length;
  const completedCount = missions.filter((m) => m.status === "Completed").length;

  const openEdit = (mission: {
    id: string;
    title: string;
    objective: string;
  }) => {
    setEditTarget(mission);
    setEditTitle(mission.title);
    setEditObjective(mission.objective);
  };

  const submitEdit = () => {
    if (!editTarget) return;
    updateMission(editTarget.id, {
      title: editTitle.trim() || editTarget.title,
      objective: editObjective.trim() || editTarget.objective
    });
    toast({ tone: "success", title: "Mission updated" });
    playSound("click");
    setEditTarget(null);
  };

  const handleComplete = (missionId: string) => {
    const event = completeMission(missionId);
    if (!event) return;
    registerMissionComplete(event.rewardXp);
    vibrate("success");
  };

  const progressFor = (steps: { done: boolean }[]) => {
    if (!steps.length) return 0;
    return Math.round(
      (steps.filter((s) => s.done).length / steps.length) * 100
    );
  };

  return (
    <div className="grid gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Missions</h1>
          <p className="text-sm text-muted">
            {activeCount} active · {completedCount} completed
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

      {filtered.length === 0 ? (
        <EmptyState
          icon={ScrollText}
          title={
            filter === "All"
              ? "No missions yet"
              : `No ${filter.toLowerCase()} missions`
          }
          description={
            filter === "All"
              ? "Talk to an agent on the map and accept your first mission."
              : "Switch filters or start a new mission from an agent."
          }
          actionLabel="Go to map"
          actionHref="/map"
        />
      ) : (
        <div className="grid gap-4">
          {filtered.map((mission) => {
            const pct = progressFor(mission.steps);
            return (
              <div
                key={mission.id}
                className="rounded-3xl border border-white/10 bg-card p-5 transition hover:border-primary/30 sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
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

                {mission.status !== "Completed" && mission.steps.length > 0 && (
                  <div className="mt-4">
                    <div className="mb-1 flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-muted">
                      <span>Progress</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-secondary transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )}

                <ul className="mt-4 space-y-2 text-sm text-muted">
                  {mission.steps.map((step) => (
                    <li key={step.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={step.done}
                        onChange={() => {
                          updateMission(mission.id, {
                            steps: mission.steps.map((item) =>
                              item.id === step.id
                                ? { ...item, done: !item.done }
                                : item
                            )
                          });
                          playSound("click");
                          vibrate("light");
                        }}
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
                      onClick={() =>
                        openEdit({
                          id: mission.id,
                          title: mission.title,
                          objective: mission.objective
                        })
                      }
                    >
                      Edit
                    </Button>
                    {mission.status !== "Completed" && (
                      <Button size="sm" onClick={() => handleComplete(mission.id)}>
                        Mark Complete
                      </Button>
                    )}
                    {mission.status !== "Archived" && mission.status !== "Completed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setArchiveTarget({ id: mission.id, title: mission.title })
                        }
                      >
                        Archive
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Edit mission"
        description="Tighten the title or objective. Changes save immediately."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setEditTarget(null)}>
              Cancel
            </Button>
            <Button size="sm" onClick={submitEdit}>
              Save
            </Button>
          </>
        }
      >
        <div className="grid gap-3 text-sm">
          <label className="grid gap-1">
            <span className="text-xs uppercase tracking-[0.25em] text-muted">
              Title
            </span>
            <input
              value={editTitle}
              onChange={(event) => setEditTitle(event.target.value)}
              className="rounded-2xl border border-white/10 bg-background px-4 py-3 text-sm outline-none focus:border-primary/60"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-xs uppercase tracking-[0.25em] text-muted">
              Objective
            </span>
            <textarea
              value={editObjective}
              onChange={(event) => setEditObjective(event.target.value)}
              rows={3}
              className="resize-none rounded-2xl border border-white/10 bg-background px-4 py-3 text-sm outline-none focus:border-primary/60"
            />
          </label>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!archiveTarget}
        title={`Archive "${archiveTarget?.title ?? ""}"?`}
        description="Archived missions stop counting toward your active queue. You can still find them under the Archived filter."
        confirmLabel="Archive"
        destructive
        onConfirm={() => {
          if (!archiveTarget) return;
          updateMission(archiveTarget.id, { status: "Archived" });
          toast({ tone: "info", title: "Mission archived" });
        }}
        onClose={() => setArchiveTarget(null)}
      />
    </div>
  );
}
