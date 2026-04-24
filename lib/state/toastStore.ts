"use client";

import { create } from "zustand";

export type ToastTone = "success" | "error" | "info" | "reward";

export type Toast = {
  id: string;
  title: string;
  description?: string;
  tone: ToastTone;
  icon?: string;
  duration?: number;
};

type ToastStore = {
  toasts: Toast[];
  push: (toast: Omit<Toast, "id">) => string;
  dismiss: (id: string) => void;
};

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  push: (toast) => {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);
    set((state) => ({ toasts: [...state.toasts, { id, ...toast }] }));
    return id;
  },
  dismiss: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
}));

export function toast(input: Omit<Toast, "id">) {
  return useToastStore.getState().push(input);
}
