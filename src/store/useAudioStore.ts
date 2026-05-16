"use client";

import { create } from "zustand";
import type { WorldId } from "@/data/worlds";

type AudioStore = {
  muted: boolean;
  audioEnabled: boolean;
  activeWorld: WorldId;
  intensity: number;
  setMuted: (muted: boolean) => void;
  toggleMuted: () => void;
  enableAudio: () => void;
  setActiveWorld: (world: WorldId) => void;
  setIntensity: (intensity: number) => void;
};

export const useAudioStore = create<AudioStore>((set, get) => ({
  muted: false,
  audioEnabled: false,
  activeWorld: "angel-dial",
  intensity: 0.2,
  setMuted: (muted) => set({ muted }),
  toggleMuted: () => set({ muted: !get().muted }),
  enableAudio: () => set({ audioEnabled: true }),
  setActiveWorld: (activeWorld) => set({ activeWorld }),
  setIntensity: (intensity) => set({ intensity }),
}));
