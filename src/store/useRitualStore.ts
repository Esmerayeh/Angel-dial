"use client";

import { create } from "zustand";
import type { HauntedObject } from "@/data/worlds";

type RitualStore = {
  draggedObject?: HauntedObject;
  ghostPull: number;
  radioFrequency: number;
  haloPulse: number;
  elevatorDepth: number;
  hoverLine: string;
  lastOffering?: HauntedObject;
  setDraggedObject: (object?: HauntedObject) => void;
  setGhostPull: (value: number) => void;
  setRadioFrequency: (value: number) => void;
  pulseHalo: () => void;
  setElevatorDepth: (value: number) => void;
  setHoverLine: (line: string) => void;
  setLastOffering: (object?: HauntedObject) => void;
};

export const useRitualStore = create<RitualStore>((set, get) => ({
  draggedObject: undefined,
  ghostPull: 0,
  radioFrequency: 44.4,
  haloPulse: 0,
  elevatorDepth: 0,
  hoverLine: "THIS DOOR IS THINKING",
  lastOffering: undefined,
  setDraggedObject: (draggedObject) => set({ draggedObject }),
  setGhostPull: (ghostPull) => set({ ghostPull }),
  setRadioFrequency: (radioFrequency) => set({ radioFrequency }),
  pulseHalo: () => set({ haloPulse: get().haloPulse + 1 }),
  setElevatorDepth: (elevatorDepth) => set({ elevatorDepth }),
  setHoverLine: (hoverLine) => set({ hoverLine }),
  setLastOffering: (lastOffering) => set({ lastOffering }),
}));
