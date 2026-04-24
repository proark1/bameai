"use client";

type SoundName = "accept" | "complete" | "levelup" | "unlock" | "error" | "click";

let ctx: AudioContext | null = null;

const getCtx = () => {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try {
      ctx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return ctx;
};

type Tone = {
  freq: number;
  duration: number;
  type?: OscillatorType;
  gain?: number;
};

const patterns: Record<SoundName, Tone[]> = {
  accept: [
    { freq: 523.25, duration: 0.08, type: "sine" },
    { freq: 783.99, duration: 0.12, type: "sine" }
  ],
  complete: [
    { freq: 523.25, duration: 0.1, type: "triangle" },
    { freq: 659.25, duration: 0.1, type: "triangle" },
    { freq: 987.77, duration: 0.2, type: "triangle" }
  ],
  levelup: [
    { freq: 659.25, duration: 0.1, type: "square", gain: 0.12 },
    { freq: 783.99, duration: 0.1, type: "square", gain: 0.12 },
    { freq: 1046.5, duration: 0.12, type: "square", gain: 0.12 },
    { freq: 1318.51, duration: 0.25, type: "square", gain: 0.12 }
  ],
  unlock: [
    { freq: 392, duration: 0.1, type: "triangle" },
    { freq: 659.25, duration: 0.18, type: "triangle" }
  ],
  error: [
    { freq: 220, duration: 0.1, type: "sawtooth", gain: 0.1 },
    { freq: 164.81, duration: 0.2, type: "sawtooth", gain: 0.1 }
  ],
  click: [{ freq: 880, duration: 0.04, type: "sine", gain: 0.06 }]
};

const isSoundEnabled = () => {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem("agent-kingdom-settings");
    if (!raw) return true;
    const parsed = JSON.parse(raw) as { soundEnabled?: boolean };
    return parsed.soundEnabled ?? true;
  } catch {
    return true;
  }
};

export function playSound(name: SoundName) {
  if (!isSoundEnabled()) return;
  const audio = getCtx();
  if (!audio) return;
  if (audio.state === "suspended") {
    audio.resume().catch(() => {});
  }

  let t = audio.currentTime;
  for (const tone of patterns[name]) {
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = tone.type ?? "sine";
    osc.frequency.value = tone.freq;
    const peak = tone.gain ?? 0.08;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(peak, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + tone.duration);
    osc.connect(gain).connect(audio.destination);
    osc.start(t);
    osc.stop(t + tone.duration);
    t += tone.duration * 0.9;
  }
}
