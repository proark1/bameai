import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <section className="grid gap-6">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#1b2240] via-[#101627] to-[#090d17] p-10 shadow-lg">
        <div className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-muted">
            <Sparkles className="h-4 w-4" />
            Agent Kingdom
          </div>
          <h1 className="text-4xl font-semibold text-foreground">
            Your company, reimagined as a strategy game.
          </h1>
          <p className="max-w-2xl text-lg text-muted">
            Build districts for each AI agent, complete missions, and unlock skills to
            level up your organization. This MVP ships with mock data so you can
            explore instantly.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/map"
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30"
            >
              Enter the Company Map
            </Link>
            <Link
              href="/settings"
              className="rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-foreground"
            >
              Configure Settings
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
