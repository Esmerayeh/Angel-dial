"use client";

import { create } from "zustand";
import type { MoodId } from "@/data/worlds";
import type { AnonymousArtifact } from "./useArtifactStore";
import {
  createRotWallRelicFromArtifact,
  createSeededRotWall,
  decayRelic,
  readLocalRotWallRelics,
  writeLocalRotWallRelics,
} from "@/systems/rotWallSystem";

export type RotWallRelic = {
  id: string;
  x: number;
  y: number;
  type: "sticker" | "dead-link" | "note" | "cursed-button" | "fake-ad" | "pixel-sigil" | "web-badge";
  content: string;
  createdAt: string;
  decayLevel: number;
  mutationSeed: number;
  portalChance: number;
  mood: MoodId;
  discoveredCount: number;
};

type RotWallStore = {
  relics: RotWallRelic[];
  initialized: boolean;
  initializeRotWall: () => void;
  addArtifactRelic: (artifact: AnonymousArtifact, mood: MoodId) => void;
  discoverRelic: (id: string) => void;
  mutateRelics: () => void;
};

export const useRotWallStore = create<RotWallStore>((set, get) => ({
  relics: [],
  initialized: false,
  initializeRotWall: () => {
    if (get().initialized) return;
    set({ relics: [...createSeededRotWall(), ...readLocalRotWallRelics()], initialized: true });
  },
  addArtifactRelic: (artifact, mood) =>
    set((state) => {
      const relic = createRotWallRelicFromArtifact(artifact, mood, state.relics.length);
      const next = [...state.relics, relic];
      writeLocalRotWallRelics(next);
      return { relics: next };
    }),
  discoverRelic: (id) =>
    set((state) => {
      const next = state.relics.map((relic) =>
        relic.id === id
          ? {
              ...relic,
              discoveredCount: relic.discoveredCount + 1,
              decayLevel: Math.min(1, relic.decayLevel + 0.04),
            }
          : relic,
      );
      writeLocalRotWallRelics(next);
      return { relics: next };
    }),
  mutateRelics: () =>
    set((state) => {
      const next = state.relics.map((relic) => decayRelic(relic));
      writeLocalRotWallRelics(next);
      return { relics: next };
    }),
}));
