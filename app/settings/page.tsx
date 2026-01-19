"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [companyName, setCompanyName] = useState("Nova Guild");
  const [theme, setTheme] = useState("Sci-Fi");
  const [tone, setTone] = useState("Strategic");

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="text-3xl font-semibold">Settings</h1>
        <p className="text-sm text-muted">
          Personalize your company style, theme, and AI tone.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-card p-6">
          <h2 className="text-xl font-semibold">Profile</h2>
          <div className="mt-4 space-y-4 text-sm">
            <label className="grid gap-2">
              Company name
              <input
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
                className="rounded-2xl border border-white/10 bg-background px-4 py-3 text-sm"
              />
            </label>
            <label className="grid gap-2">
              Theme
              <select
                value={theme}
                onChange={(event) => setTheme(event.target.value)}
                className="rounded-2xl border border-white/10 bg-background px-4 py-3 text-sm"
              >
                <option>Sci-Fi</option>
                <option>Modern Kingdom</option>
              </select>
            </label>
            <label className="grid gap-2">
              Preferred tone
              <select
                value={tone}
                onChange={(event) => setTone(event.target.value)}
                className="rounded-2xl border border-white/10 bg-background px-4 py-3 text-sm"
              >
                <option>Strategic</option>
                <option>Playful</option>
                <option>Direct</option>
              </select>
            </label>
            <Button>Save Settings</Button>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-card p-6">
          <h2 className="text-xl font-semibold">API Access</h2>
          <p className="mt-2 text-sm text-muted">
            Configure an optional API key for live AI responses. Leave blank for
            mock mode.
          </p>
          <div className="mt-4 space-y-4 text-sm">
            <label className="grid gap-2">
              OpenAI-compatible API key
              <input
                type="password"
                placeholder="sk-..."
                className="rounded-2xl border border-white/10 bg-background px-4 py-3 text-sm"
              />
            </label>
            <Button variant="outline">Reset Demo Data</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
