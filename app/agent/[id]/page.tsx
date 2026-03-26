"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useStore, xpNeeded } from "@/lib/state/store";
import { RPGChat } from "@/components/RPGChat";
import { MissionPanel } from "@/components/MissionPanel";
import { Badge } from "@/components/ui/badge";

export default function AgentPage() {
  const params = useParams();
  const agentId = params?.id as string;
  const agents = useStore((state) => state.agents);
  const agent = useMemo(
    () => agents.find((item) => item.id === agentId),
    [agents, agentId]
  );
  const [proposal, setProposal] = useState<
    Parameters<typeof MissionPanel>[0]["proposal"]
  >(null);

  if (!agent) {
    return (
      <div className="rounded-3xl border border-white/10 bg-card p-6">
        <h1 className="text-2xl font-semibold">Agent not found</h1>
        <p className="text-sm text-muted">Return to the map to select an agent.</p>
      </div>
    );
  }

  const requiredXp = xpNeeded(agent.level);

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <div className="grid gap-6">
        <div className="rounded-3xl border border-white/10 bg-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted">
                {agent.building}
              </p>
              <h1 className="text-3xl font-semibold">{agent.name}</h1>
              <p className="text-sm text-muted">{agent.role}</p>
            </div>
            <Badge className="bg-white/10 text-foreground">Lv {agent.level}</Badge>
          </div>
          <div className="mt-4 grid gap-3 text-sm text-muted md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-background p-4">
              <p className="text-xs uppercase tracking-[0.3em]">XP</p>
              <p className="text-lg font-semibold text-foreground">
                {agent.xp} / {requiredXp}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-background p-4">
              <p className="text-xs uppercase tracking-[0.3em]">Status</p>
              <p className="text-lg font-semibold text-foreground">{agent.status}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-background p-4">
              <p className="text-xs uppercase tracking-[0.3em]">Summary</p>
              <p className="text-sm text-muted">{agent.summary}</p>
            </div>
          </div>
        </div>

        <RPGChat
          agentName={agent.name}
          agentMood={agent.mood}
          onMissionProposal={setProposal}
        />
      </div>

      <div className="grid gap-6">
        <MissionPanel agentId={agent.id} proposal={proposal} />
        <div className="rounded-3xl border border-white/10 bg-card p-6 text-sm text-muted">
          <h3 className="text-lg font-semibold text-foreground">Agent Memory</h3>
          <p className="mt-2">{agent.summary}</p>
          <p className="mt-4 text-xs text-muted">
            Summary persists per agent. Update via mission completions.
          </p>
        </div>
      </div>
    </div>
  );
}
