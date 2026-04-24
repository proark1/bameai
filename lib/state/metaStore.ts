"use client";

import { create } from "zustand";

export type Achievement = {
  id: string;
  title: string;
  description: string;
  unlockedAt: string | null;
  icon: "flame" | "trophy" | "star" | "shield" | "bolt";
};

export type MetaState = {
  streakDays: number;
  lastActiveDate: string | null;
  totalMissionsCompleted: number;
  totalXpEarned: number;
  achievements: Achievement[];
};

const STORAGE_KEY = "agent-kingdom-meta";

const todayKey = () => new Date().toISOString().slice(0, 10);

const dayDiff = (a: string, b: string) => {
  const da = new Date(a);
  const db = new Date(b);
  const daUTC = Date.UTC(da.getFullYear(), da.getMonth(), da.getDate());
  const dbUTC = Date.UTC(db.getFullYear(), db.getMonth(), db.getDate());
  return Math.floor((dbUTC - daUTC) / (1000 * 60 * 60 * 24));
};

const defaultAchievements: Achievement[] = [
  {
    id: "first-mission",
    title: "First Steps",
    description: "Complete your first mission.",
    unlockedAt: null,
    icon: "star"
  },
  {
    id: "streak-3",
    title: "On a Roll",
    description: "Maintain a 3-day streak.",
    unlockedAt: null,
    icon: "flame"
  },
  {
    id: "streak-7",
    title: "Week One",
    description: "Maintain a 7-day streak.",
    unlockedAt: null,
    icon: "flame"
  },
  {
    id: "five-missions",
    title: "Taking Ground",
    description: "Complete 5 missions total.",
    unlockedAt: null,
    icon: "trophy"
  },
  {
    id: "ten-missions",
    title: "Commander",
    description: "Complete 10 missions total.",
    unlockedAt: null,
    icon: "shield"
  },
  {
    id: "xp-500",
    title: "Power Surge",
    description: "Earn 500 XP across all agents.",
    unlockedAt: null,
    icon: "bolt"
  },
  {
    id: "xp-2000",
    title: "Kingdom Rising",
    description: "Earn 2,000 XP across all agents.",
    unlockedAt: null,
    icon: "bolt"
  }
];

const defaultMeta: MetaState = {
  streakDays: 1,
  lastActiveDate: null,
  totalMissionsCompleted: 0,
  totalXpEarned: 0,
  achievements: defaultAchievements
};

type MetaStore = MetaState & {
  hydrated: boolean;
  pendingUnlocks: Achievement[];
  hydrate: () => void;
  registerMissionComplete: (xpGained: number) => Achievement[];
  touchStreak: () => void;
  clearPendingUnlocks: () => void;
};

const persist = (state: MetaState) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore
  }
};

const checkUnlocks = (state: MetaState): { state: MetaState; unlocked: Achievement[] } => {
  const rules: Record<string, boolean> = {
    "first-mission": state.totalMissionsCompleted >= 1,
    "five-missions": state.totalMissionsCompleted >= 5,
    "ten-missions": state.totalMissionsCompleted >= 10,
    "streak-3": state.streakDays >= 3,
    "streak-7": state.streakDays >= 7,
    "xp-500": state.totalXpEarned >= 500,
    "xp-2000": state.totalXpEarned >= 2000
  };
  const now = new Date().toISOString();
  const newlyUnlocked: Achievement[] = [];
  const achievements = state.achievements.map((a) => {
    if (!a.unlockedAt && rules[a.id]) {
      const unlocked = { ...a, unlockedAt: now };
      newlyUnlocked.push(unlocked);
      return unlocked;
    }
    return a;
  });
  return { state: { ...state, achievements }, unlocked: newlyUnlocked };
};

export const useMetaStore = create<MetaStore>((set, get) => ({
  ...defaultMeta,
  hydrated: false,
  pendingUnlocks: [],
  hydrate: () => {
    if (typeof window === "undefined") return;
    if (get().hydrated) return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<MetaState>;
        set({
          ...defaultMeta,
          ...parsed,
          achievements: mergeAchievements(parsed.achievements),
          hydrated: true
        });
        return;
      }
    } catch {
      // Ignore
    }
    set({ hydrated: true });
  },
  registerMissionComplete: (xpGained) => {
    let unlockedBatch: Achievement[] = [];
    set((state) => {
      const next: MetaState = {
        streakDays: state.streakDays,
        lastActiveDate: state.lastActiveDate,
        totalMissionsCompleted: state.totalMissionsCompleted + 1,
        totalXpEarned: state.totalXpEarned + xpGained,
        achievements: state.achievements
      };
      const { state: checked, unlocked } = checkUnlocks(next);
      unlockedBatch = unlocked;
      persist(checked);
      return {
        ...state,
        ...checked,
        pendingUnlocks: [...state.pendingUnlocks, ...unlocked]
      };
    });
    return unlockedBatch;
  },
  touchStreak: () => {
    set((state) => {
      const today = todayKey();
      if (state.lastActiveDate === today) return state;
      let streakDays = state.streakDays;
      if (state.lastActiveDate) {
        const diff = dayDiff(state.lastActiveDate, today);
        if (diff === 1) streakDays += 1;
        else if (diff > 1) streakDays = 1;
      } else {
        streakDays = 1;
      }
      const next: MetaState = {
        ...state,
        streakDays,
        lastActiveDate: today
      };
      const { state: checked, unlocked } = checkUnlocks(next);
      persist(checked);
      return {
        ...state,
        ...checked,
        pendingUnlocks: [...state.pendingUnlocks, ...unlocked]
      };
    });
  },
  clearPendingUnlocks: () => set({ pendingUnlocks: [] })
}));

function mergeAchievements(stored?: Achievement[]): Achievement[] {
  if (!stored) return defaultAchievements;
  const map = new Map(stored.map((a) => [a.id, a]));
  return defaultAchievements.map((a) => map.get(a.id) ?? a);
}
