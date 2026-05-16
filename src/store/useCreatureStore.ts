"use client";

import { create } from "zustand";
import type { CreatureSeed } from "@/data/creatures";
import { generateCreatures } from "@/systems/creatureGenerator";

type CreatureStore = {
  creatures: CreatureSeed[];
  bigCursorVisible: boolean;
  regenerate: (seed: number, count?: number) => void;
  summonBigCursor: () => void;
  hideBigCursor: () => void;
};

export const useCreatureStore = create<CreatureStore>((set) => ({
  creatures: generateCreatures(19, 26),
  bigCursorVisible: false,
  regenerate: (seed, count = 26) => set({ creatures: generateCreatures(seed, count) }),
  summonBigCursor: () => set({ bigCursorVisible: true }),
  hideBigCursor: () => set({ bigCursorVisible: false }),
}));
