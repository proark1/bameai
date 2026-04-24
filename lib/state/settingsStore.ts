"use client";

import { create } from "zustand";

export type ThemeName = "sci-fi" | "modern-kingdom" | "aurora";
export type ToneName = "Strategic" | "Playful" | "Direct";

export type SettingsState = {
  companyName: string;
  theme: ThemeName;
  tone: ToneName;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  reducedMotion: boolean;
  onboardingComplete: boolean;
};

const STORAGE_KEY = "agent-kingdom-settings";

const defaultSettings: SettingsState = {
  companyName: "Nova Guild",
  theme: "sci-fi",
  tone: "Strategic",
  soundEnabled: true,
  hapticsEnabled: true,
  reducedMotion: false,
  onboardingComplete: false
};

type SettingsStore = SettingsState & {
  hydrated: boolean;
  hydrate: () => void;
  update: (patch: Partial<SettingsState>) => void;
  reset: () => void;
};

const persist = (state: SettingsState) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore quota errors
  }
};

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  ...defaultSettings,
  hydrated: false,
  hydrate: () => {
    if (typeof window === "undefined") return;
    if (get().hydrated) return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<SettingsState>;
        set({ ...defaultSettings, ...parsed, hydrated: true });
        applyTheme(parsed.theme ?? defaultSettings.theme);
        return;
      }
    } catch {
      // Ignore parse errors
    }
    set({ hydrated: true });
    applyTheme(defaultSettings.theme);
  },
  update: (patch) => {
    set((state) => {
      const next = { ...state, ...patch };
      const { hydrated, hydrate, update, reset, ...persisted } = next;
      persist(persisted);
      if (patch.theme) applyTheme(patch.theme);
      return next;
    });
  },
  reset: () => {
    set({ ...defaultSettings, hydrated: true });
    persist(defaultSettings);
    applyTheme(defaultSettings.theme);
  }
}));

function applyTheme(theme: ThemeName) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
}
