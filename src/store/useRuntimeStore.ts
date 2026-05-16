"use client";

import { create } from "zustand";
import type { InstrumentId, InstrumentRuntime } from "@/data/instruments";
import type { MoodId, WorldId } from "@/data/worlds";

export type RitualId =
  | "clock-rotation"
  | "ghost-pull"
  | "portal-feed"
  | "object-drag"
  | "radio-tune"
  | "elevator-climb"
  | "world-instrument"
  | "artifact-leave";

export type TransitionPhase = "idle" | "anticipation" | "transformation" | "travel" | "arrival";

export type InsideViewId =
  | "cd-tray-city"
  | "popup-interior"
  | "ghost-interior"
  | "clockwork-interior"
  | "bottle-message-world";

export type RuntimePointer = {
  x: number;
  y: number;
  previousX: number;
  previousY: number;
  velocityX: number;
  velocityY: number;
  speed: number;
  lastMoveAt: number;
};

export type CameraRuntime = {
  x: number;
  y: number;
  scale: number;
  rotation: number;
};

export type RuntimeObjectState = {
  id: string;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  wobble: number;
  portalForce: number;
  dragging: boolean;
  decayState: number;
  insideViewId?: InsideViewId;
};

type RuntimeStore = {
  elapsedTime: number;
  deltaTime: number;
  pointer: RuntimePointer;
  activeRitual?: RitualId;
  currentWorld: WorldId;
  currentMood: MoodId;
  currentZone: string;
  transitionPhase: TransitionPhase;
  transitionProgress: number;
  audioIntensity: number;
  physicsIntensity: number;
  weatherIntensity: number;
  creatureActivity: number;
  portalPullStrength: number;
  glitchPressure: number;
  particleSpiral: number;
  clockHandInertia: number;
  sceneMood: number;
  camera: CameraRuntime;
  instruments: Partial<Record<InstrumentId, InstrumentRuntime>>;
  objects: Record<string, RuntimeObjectState>;
  activeInsideView?: InsideViewId;
  insideViewSource?: string;
  setPointer: (x: number, y: number) => void;
  startRitual: (ritual: RitualId) => void;
  finishRitual: () => void;
  setCurrentZone: (zone: string) => void;
  commitFrame: (patch: Partial<Omit<RuntimeStore, "setPointer" | "startRitual" | "finishRitual" | "setCurrentZone" | "commitFrame" | "updateInstrument" | "setObjectState" | "openInsideView" | "closeInsideView">>) => void;
  updateInstrument: (id: InstrumentId, patch: Partial<InstrumentRuntime> | InstrumentRuntime) => void;
  setObjectState: (id: string, patch: Partial<RuntimeObjectState>) => void;
  openInsideView: (insideViewId: InsideViewId, source?: string) => void;
  closeInsideView: () => void;
};

const initialPointer: RuntimePointer = {
  x: 0,
  y: 0,
  previousX: 0,
  previousY: 0,
  velocityX: 0,
  velocityY: 0,
  speed: 0,
  lastMoveAt: 0,
};

export const useRuntimeStore = create<RuntimeStore>((set, get) => ({
  elapsedTime: 0,
  deltaTime: 0,
  pointer: initialPointer,
  activeRitual: undefined,
  currentWorld: "angel-dial",
  currentMood: "haunted",
  currentZone: "dial-shell",
  transitionPhase: "idle",
  transitionProgress: 0,
  audioIntensity: 0.22,
  physicsIntensity: 0.18,
  weatherIntensity: 0.24,
  creatureActivity: 0.32,
  portalPullStrength: 0.12,
  glitchPressure: 0.16,
  particleSpiral: 0.22,
  clockHandInertia: 0,
  sceneMood: 0.4,
  camera: { x: 0, y: 0, scale: 1, rotation: 0 },
  instruments: {},
  objects: {},
  activeInsideView: undefined,
  insideViewSource: undefined,
  setPointer: (x, y) =>
    set((state) => {
      const now = typeof performance === "undefined" ? Date.now() : performance.now();
      const dt = Math.max(16, now - state.pointer.lastMoveAt);
      const velocityX = ((x - state.pointer.x) / dt) * 16;
      const velocityY = ((y - state.pointer.y) / dt) * 16;
      return {
        pointer: {
          x,
          y,
          previousX: state.pointer.x,
          previousY: state.pointer.y,
          velocityX,
          velocityY,
          speed: Math.hypot(velocityX, velocityY),
          lastMoveAt: now,
        },
      };
    }),
  startRitual: (activeRitual) => set({ activeRitual }),
  finishRitual: () => set({ activeRitual: undefined }),
  setCurrentZone: (currentZone) => set({ currentZone }),
  commitFrame: (patch) => set(patch),
  updateInstrument: (id, patch) =>
    set((state) => ({
      instruments: {
        ...state.instruments,
        [id]: {
          id,
          angle: 0,
          velocity: 0,
          tension: 0,
          dragging: false,
          intensity: 0,
          audioValue: 0,
          visualValue: 0,
          ...state.instruments[id],
          ...patch,
        },
      },
    })),
  setObjectState: (id, patch) =>
    set((state) => ({
      objects: {
        ...state.objects,
        [id]: {
          ...{
            id,
            x: 0,
            y: 0,
            velocityX: 0,
            velocityY: 0,
            wobble: 0,
            portalForce: 0,
            dragging: false,
            decayState: 0,
          },
          ...state.objects[id],
          ...patch,
        },
      },
    })),
  openInsideView: (activeInsideView, insideViewSource) => {
    get().startRitual("object-drag");
    set({ activeInsideView, insideViewSource, transitionPhase: "travel", transitionProgress: 0.52 });
  },
  closeInsideView: () => {
    set({ activeInsideView: undefined, insideViewSource: undefined, transitionPhase: "arrival", transitionProgress: 0.88 });
    window.setTimeout(() => get().finishRitual(), 180);
  },
}));
