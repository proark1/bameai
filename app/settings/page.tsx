"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm";
import { useSettingsStore, type ThemeName, type ToneName } from "@/lib/state/settingsStore";
import { useMetaStore } from "@/lib/state/metaStore";
import { toast } from "@/lib/state/toastStore";
import { playSound } from "@/lib/fx/sound";

const themes: { value: ThemeName; label: string }[] = [
  { value: "sci-fi", label: "Sci-Fi (default)" },
  { value: "modern-kingdom", label: "Modern Kingdom" },
  { value: "aurora", label: "Aurora" }
];

const tones: ToneName[] = ["Strategic", "Playful", "Direct"];

export default function SettingsPage() {
  const settings = useSettingsStore();
  const reset = useSettingsStore((state) => state.reset);
  const update = useSettingsStore((state) => state.update);
  const metaHydrated = useMetaStore((state) => state.hydrated);
  const [apiKey, setApiKey] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const onSave = () => {
    toast({
      tone: "success",
      title: "Settings saved",
      description: "Your preferences are stored on this device."
    });
    playSound("accept");
  };

  const handleResetSettings = () => {
    reset();
    toast({ tone: "info", title: "Settings reset to defaults" });
  };

  const handleResetDemo = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("agent-kingdom-meta");
      window.location.reload();
    }
  };

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="text-3xl font-semibold">Settings</h1>
        <p className="text-sm text-muted">
          Personalize your kingdom style, theme, and feedback. Saved to this device.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-card p-5 sm:p-6">
          <h2 className="text-xl font-semibold">Profile</h2>
          <div className="mt-4 space-y-4 text-sm">
            <label className="grid gap-2">
              <span className="text-xs uppercase tracking-[0.25em] text-muted">
                Company name
              </span>
              <input
                value={settings.companyName}
                onChange={(event) => update({ companyName: event.target.value })}
                className="rounded-2xl border border-white/10 bg-background px-4 py-3 text-sm outline-none focus:border-primary/60"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-xs uppercase tracking-[0.25em] text-muted">
                Theme
              </span>
              <select
                value={settings.theme}
                onChange={(event) =>
                  update({ theme: event.target.value as ThemeName })
                }
                className="rounded-2xl border border-white/10 bg-background px-4 py-3 text-sm outline-none focus:border-primary/60"
              >
                {themes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2">
              <span className="text-xs uppercase tracking-[0.25em] text-muted">
                Preferred tone
              </span>
              <select
                value={settings.tone}
                onChange={(event) =>
                  update({ tone: event.target.value as ToneName })
                }
                className="rounded-2xl border border-white/10 bg-background px-4 py-3 text-sm outline-none focus:border-primary/60"
              >
                {tones.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex items-center justify-between gap-3 pt-2">
              <Button onClick={onSave}>Save Settings</Button>
              <Button variant="outline" size="sm" onClick={handleResetSettings}>
                Reset preferences
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-card p-5 sm:p-6">
          <h2 className="text-xl font-semibold">Feedback & Accessibility</h2>
          <div className="mt-4 space-y-3 text-sm">
            <ToggleRow
              label="Sound effects"
              description="Plays chimes on accept, complete, and level-up."
              checked={settings.soundEnabled}
              onChange={(checked) => update({ soundEnabled: checked })}
            />
            <ToggleRow
              label="Haptics (mobile)"
              description="Short buzzes on key actions when supported."
              checked={settings.hapticsEnabled}
              onChange={(checked) => update({ hapticsEnabled: checked })}
            />
            <ToggleRow
              label="Reduced motion"
              description="Dial back animations and transitions."
              checked={settings.reducedMotion}
              onChange={(checked) => update({ reducedMotion: checked })}
            />
            <ToggleRow
              label="Replay onboarding"
              description="Show the intro tour on next reload."
              checked={!settings.onboardingComplete}
              onChange={(checked) => update({ onboardingComplete: !checked })}
            />
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-card p-5 sm:p-6 md:col-span-2">
          <h2 className="text-xl font-semibold">API Access</h2>
          <p className="mt-2 text-sm text-muted">
            Configure an optional API key for live AI responses. Leave blank for mock
            mode.
          </p>
          <div className="mt-4 grid gap-4 text-sm md:grid-cols-[1fr_auto] md:items-end">
            <label className="grid gap-2">
              <span className="text-xs uppercase tracking-[0.25em] text-muted">
                OpenAI-compatible API key
              </span>
              <input
                type="password"
                placeholder="sk-..."
                value={apiKey}
                onChange={(event) => setApiKey(event.target.value)}
                className="rounded-2xl border border-white/10 bg-background px-4 py-3 text-sm outline-none focus:border-primary/60"
              />
            </label>
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(true)}
              disabled={!metaHydrated}
            >
              Reset Demo Data
            </Button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Reset all demo progress?"
        description="This wipes your streak, mission history, and unlocked achievements from this device. Your preferences are kept."
        confirmLabel="Reset progress"
        destructive
        onConfirm={handleResetDemo}
        onClose={() => setConfirmOpen(false)}
      />
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-2xl border border-white/10 bg-background px-4 py-3 transition hover:border-primary/40">
      <div>
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-xs text-muted">{description}</p>
      </div>
      <span
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === " " || event.key === "Enter") {
            event.preventDefault();
            onChange(!checked);
          }
        }}
        onClick={() => onChange(!checked)}
        className={
          checked
            ? "relative inline-flex h-6 w-11 items-center rounded-full bg-primary transition"
            : "relative inline-flex h-6 w-11 items-center rounded-full bg-white/10 transition"
        }
      >
        <span
          className={
            checked
              ? "inline-block h-5 w-5 translate-x-5 rounded-full bg-white transition"
              : "inline-block h-5 w-5 translate-x-1 rounded-full bg-white transition"
          }
        />
      </span>
    </label>
  );
}
