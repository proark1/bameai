"use client";

import { Coins, Flame, Gem, Layers, Sparkles } from "lucide-react";
import { useStore } from "@/lib/state/store";
import { EmptyState } from "@/components/EmptyState";

const icons = {
  coins: Coins,
  focus: Flame,
  intel: Gem,
  reputation: Sparkles
} as const;

const tints: Record<string, string> = {
  coins: "text-amber-300 bg-amber-400/10",
  focus: "text-rose-300 bg-rose-400/10",
  intel: "text-sky-300 bg-sky-400/10",
  reputation: "text-emerald-300 bg-emerald-400/10"
};

export default function InventoryPage() {
  const resources = useStore((state) => state.resources);
  const entries = Object.entries(resources);
  const total = entries.reduce((sum, [, value]) => sum + value, 0);

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="text-3xl font-semibold">Inventory</h1>
        <p className="text-sm text-muted">
          Track resources earned from missions and upgrades.
        </p>
      </header>

      {total === 0 ? (
        <EmptyState
          icon={Layers}
          title="Your vaults are empty"
          description="Complete a mission to earn coins, focus, intel, and reputation."
          actionLabel="Browse missions"
          actionHref="/missions"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {entries.map(([key, value]) => {
            const Icon = icons[key as keyof typeof icons] ?? Layers;
            return (
              <div
                key={key}
                className="group rounded-3xl border border-white/10 bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary/40"
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                    tints[key] ?? "bg-white/5 text-muted"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <p className="mt-4 text-xs uppercase tracking-[0.3em] text-muted">
                  {key}
                </p>
                <p className="mt-1 text-3xl font-semibold text-foreground">
                  {value}
                </p>
                <p className="text-xs text-muted">Used for upgrades and skills.</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
