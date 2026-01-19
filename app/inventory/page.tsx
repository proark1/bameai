"use client";

import { useStore } from "@/lib/state/store";

export default function InventoryPage() {
  const resources = useStore((state) => state.resources);

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="text-3xl font-semibold">Inventory</h1>
        <p className="text-sm text-muted">
          Track resources earned from missions and upgrades.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(resources).map(([key, value]) => (
          <div
            key={key}
            className="rounded-3xl border border-white/10 bg-card p-6"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-muted">{key}</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">{value}</p>
            <p className="text-sm text-muted">Stored for upgrades and missions.</p>
          </div>
        ))}
      </div>
    </div>
  );
}
