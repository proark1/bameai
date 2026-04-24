"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { useStore, xpNeeded } from "@/lib/state/store";
import { RPGChat } from "@/components/RPGChat";
import { MissionPanel } from "@/components/MissionPanel";
import { XpBar } from "@/components/XpBar";
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
        <p className="mt-1 text-sm text-muted">
          Return to the map to select an agent.
        </p>
        <Link
          href="/map"
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary"
        >
          <ArrowLeft className="h-3 w-3" /> Back to map
        </Link>
      </div>
    );
  }

  const requiredXp = xpNeeded(agent.level);

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <div className="grid gap-6">
        <div className="rounded-3xl border border-white/10 bg-card p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <Link
              href="/map"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary"
            >
              <ArrowLeft className="h-3 w-3" /> Map
            </Link>
            <Badge className="bg-white/10 text-foreground">Lv {agent.level}</Badge>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted">
                {agent.building}
              </p>
              <h1 className="text-3xl font-semibold">{agent.name}</h1>
              <p className="text-sm text-muted">{agent.role}</p>
            </div>
          </div>
          <div className="mt-4">
            <XpBar value={agent.xp} max={requiredXp} label="Progress to next level" />
          </div>
          <div className="mt-4 grid gap-3 text-sm text-muted sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-background p-4">
              <p className="text-xs uppercase tracking-[0.3em]">Status</p>
              <p className="text-lg font-semibold text-foreground">{agent.status}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-background p-4">
              <p className="text-xs uppercase tracking-[0.3em]">Missions</p>
              <p className="text-lg font-semibold text-foreground">
                {agent.missions} active
              </p>
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
        <div className="rounded-3xl border border-white/10 bg-card p-5 text-sm text-muted sm:p-6">
          <h3 className="text-lg font-semibold text-foreground">Agent Memory</h3>
          <p className="mt-2">{agent.summary}</p>
          <p className="mt-4 text-xs">
            Summary persists per agent. Update via mission completions.
          </p>
        </div>
      </div>
    </div>
  );
}
