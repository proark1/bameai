"use client";

import { useState } from "react";
import { Lock, Sparkle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { SkillNode } from "@/lib/data/seed";
import { toast } from "@/lib/state/toastStore";
import { playSound } from "@/lib/fx/sound";
import { vibrate } from "@/lib/fx/haptics";

const skillColors = [
  "border-primary/60 bg-primary/10",
  "border-emerald-500/60 bg-emerald-500/10",
  "border-amber-400/60 bg-amber-400/10"
];

type SkillTreeProps = {
  title: string;
  description: string;
  nodes: SkillNode[];
  availablePoints: number;
};

export function SkillTree({
  title,
  description,
  nodes,
  availablePoints
}: SkillTreeProps) {
  const [unlocked, setUnlocked] = useState<string[]>(
    nodes[0] ? [nodes[0].id] : []
  );
  const [points, setPoints] = useState(availablePoints);

  const canUnlock = (node: SkillNode) =>
    node.prerequisites.every((req) => unlocked.includes(req));

  const missingPrereqs = (node: SkillNode) =>
    node.prerequisites.filter((req) => !unlocked.includes(req));

  const tryUnlock = (node: SkillNode) => {
    if (!canUnlock(node)) return;
    if (points < node.costPoints) {
      toast({
        tone: "error",
        title: "Not enough skill points",
        description: `Needs ${node.costPoints}, you have ${points}.`
      });
      playSound("error");
      vibrate("error");
      return;
    }
    setUnlocked((prev) => [...prev, node.id]);
    setPoints((prev) => prev - node.costPoints);
    toast({
      tone: "reward",
      title: `Unlocked: ${node.name}`,
      description: node.effects[0]
    });
    playSound("unlock");
    vibrate("success");
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-sm text-muted">{description}</p>
        </div>
        <div className="rounded-full border border-white/10 bg-background px-4 py-2 text-xs text-muted">
          Points: {points}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {nodes.map((node, index) => {
          const isUnlocked = unlocked.includes(node.id);
          const reqOk = canUnlock(node);
          const isAvailable = reqOk && !isUnlocked && points >= node.costPoints;
          const missing = missingPrereqs(node);
          const tooltipText = isUnlocked
            ? "Already unlocked"
            : !reqOk
              ? `Locked — needs ${missing.length} prerequisite${missing.length > 1 ? "s" : ""}`
              : points < node.costPoints
                ? `Needs ${node.costPoints - points} more skill point${
                    node.costPoints - points > 1 ? "s" : ""
                  }`
                : `Unlock for ${node.costPoints} point${node.costPoints > 1 ? "s" : ""}`;

          return (
            <div
              key={node.id}
              className={cn(
                "rounded-2xl border p-4 text-sm transition",
                isUnlocked
                  ? skillColors[index % skillColors.length]
                  : reqOk
                    ? "border-white/15 bg-background"
                    : "border-white/5 bg-background/60 opacity-70"
              )}
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold">{node.name}</p>
                {isUnlocked ? (
                  <Sparkle className="h-4 w-4 text-primary" />
                ) : (
                  <Lock className="h-4 w-4 text-muted" />
                )}
              </div>
              <p className="mt-2 text-xs text-muted">{node.description}</p>
              <ul className="mt-3 space-y-1 text-xs text-muted">
                {node.effects.map((effect) => (
                  <li key={effect}>• {effect}</li>
                ))}
              </ul>
              <Tooltip content={tooltipText}>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-4"
                  disabled={!isAvailable}
                  onClick={() => tryUnlock(node)}
                >
                  {isUnlocked
                    ? "Unlocked"
                    : `Unlock (${node.costPoints} pt)`}
                </Button>
              </Tooltip>
            </div>
          );
        })}
      </div>
    </div>
  );
}
