"use client";

import { SkillTree } from "@/components/SkillTree";
import { useStore } from "@/lib/state/store";

export default function SkillsPage() {
  const agents = useStore((state) => state.agents);
  const skills = useStore((state) => state.skills);

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="text-3xl font-semibold">Skill Trees</h1>
        <p className="text-sm text-muted">
          Spend skill points to unlock passive bonuses and agent perks.
        </p>
      </header>

      <div className="grid gap-6">
        {agents.map((agent) => (
          <SkillTree
            key={agent.id}
            title={`${agent.name} · ${agent.role}`}
            description={`Building Level ${agent.buildingLevel} · ${agent.skillPoints} points available`}
            nodes={skills[agent.id] ?? []}
            availablePoints={agent.skillPoints}
          />
        ))}
      </div>
    </div>
  );
}
