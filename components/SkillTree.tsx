"use client";

import { useState } from "react";
import { Lock, Sparkle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SkillNode } from "@/lib/data/seed";

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
  const [unlocked, setUnlocked] = useState<string[]>([nodes[0]?.id ?? ""]);

  const canUnlock = (node: SkillNode) =>
    node.prerequisites.every((req) => unlocked.includes(req));

  return (
    <div className="rounded-3xl border border-white/10 bg-card p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-sm text-muted">{description}</p>
        </div>
        <div className="rounded-full border border-white/10 bg-background px-4 py-2 text-xs text-muted">
          Points: {availablePoints}
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {nodes.map((node, index) => {
          const isUnlocked = unlocked.includes(node.id);
          const isAvailable = canUnlock(node) && !isUnlocked && availablePoints > 0;
          return (
            <div
              key={node.id}
              className={cn(
                "rounded-2xl border p-4 text-sm",
                isUnlocked
                  ? skillColors[index % skillColors.length]
                  : "border-white/10 bg-background"
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
              <Button
                size="sm"
                variant="outline"
                className="mt-4"
                disabled={!isAvailable}
                onClick={() => setUnlocked((prev) => [...prev, node.id])}
              >
                Unlock ({node.costPoints} pt)
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
