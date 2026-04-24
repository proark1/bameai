"use client";

type HapticPattern = "light" | "medium" | "success" | "error";

const patterns: Record<HapticPattern, number | number[]> = {
  light: 10,
  medium: 25,
  success: [15, 40, 15],
  error: [40, 30, 40]
};

const isHapticsEnabled = () => {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem("agent-kingdom-settings");
    if (!raw) return true;
    const parsed = JSON.parse(raw) as { hapticsEnabled?: boolean };
    return parsed.hapticsEnabled ?? true;
  } catch {
    return true;
  }
};

export function vibrate(pattern: HapticPattern = "light") {
  if (typeof window === "undefined") return;
  if (!isHapticsEnabled()) return;
  if (typeof navigator.vibrate !== "function") return;
  try {
    navigator.vibrate(patterns[pattern]);
  } catch {
    // Silently ignore
  }
}
