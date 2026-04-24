"use client";

import { useState } from "react";
import { CheckCircle2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/state/store";
import { toast } from "@/lib/state/toastStore";
import { playSound } from "@/lib/fx/sound";
import { vibrate } from "@/lib/fx/haptics";

type MissionProposal = {
  title: string;
  objective: string;
  steps: string[];
  eta?: string | null;
  rewards: {
    xp: number;
    coins: number;
    focus: number;
    intel: number;
    reputation: number;
  };
};

type MissionPanelProps = {
  agentId: string;
  proposal: MissionProposal | null;
};

export function MissionPanel({ agentId, proposal }: MissionPanelProps) {
  const addMission = useStore((state) => state.addMission);
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    if (!proposal) return;
    addMission({
      id: crypto.randomUUID(),
      agentId,
      title: proposal.title,
      objective: proposal.objective,
      steps: proposal.steps.map((step) => ({
        id: crypto.randomUUID(),
        text: step,
        done: false
      })),
      status: "Active",
      priority: "Medium",
      createdAt: new Date().toISOString(),
      rewardXp: proposal.rewards.xp,
      rewardResources: {
        coins: proposal.rewards.coins,
        focus: proposal.rewards.focus,
        intel: proposal.rewards.intel,
        reputation: proposal.rewards.reputation
      }
    });
    setAccepted(true);
    toast({
      tone: "success",
      title: "Mission accepted",
      description: proposal.title
    });
    playSound("accept");
    vibrate("medium");
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-card p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Mission</p>
          <h3 className="text-xl font-semibold">Mission Proposal</h3>
        </div>
        {accepted && (
          <div className="inline-flex items-center gap-2 text-xs text-emerald-300">
            <CheckCircle2 className="h-4 w-4" /> Accepted
          </div>
        )}
      </div>

      {proposal ? (
        <div className="mt-4 space-y-4 text-sm">
          <div>
            <p className="text-xs text-muted">Title</p>
            <p className="font-semibold text-foreground">{proposal.title}</p>
          </div>
          <div>
            <p className="text-xs text-muted">Objective</p>
            <p>{proposal.objective}</p>
          </div>
          <div>
            <p className="text-xs text-muted">Steps</p>
            <ul className="mt-2 space-y-2">
              {proposal.steps.map((step) => (
                <li key={step} className="flex items-start gap-2">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
          {proposal.eta && (
            <div>
              <p className="text-xs text-muted">ETA</p>
              <p>{proposal.eta}</p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-background p-4 text-xs sm:grid-cols-5">
            <RewardCell label="XP" value={proposal.rewards.xp} />
            <RewardCell label="Coins" value={proposal.rewards.coins} />
            <RewardCell label="Focus" value={proposal.rewards.focus} />
            <RewardCell label="Intel" value={proposal.rewards.intel} />
            <RewardCell label="Rep" value={proposal.rewards.reputation} />
          </div>
          <Button onClick={handleAccept} disabled={accepted} className="w-full">
            {accepted ? "Mission Accepted" : "Accept Mission"}
          </Button>
        </div>
      ) : (
        <div className="mt-4 flex flex-col items-center gap-2 rounded-2xl border border-dashed border-white/10 bg-background/50 p-6 text-center">
          <MessageSquare className="h-6 w-6 text-primary/70" />
          <p className="text-sm text-muted">
            No mission proposal yet. Ask the agent to craft one in the chat.
          </p>
        </div>
      )}
    </div>
  );
}

function RewardCell({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-[0.25em] text-muted">
        {label}
      </span>
      <span className="text-sm font-semibold text-foreground">+{value}</span>
    </div>
  );
}
