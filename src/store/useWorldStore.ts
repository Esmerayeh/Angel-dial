"use client";

import { create } from "zustand";
import type { EraId, HauntedObject, MoodId, TransitionType, WorldId } from "@/data/worlds";
import { interpretOffering } from "@/systems/portalSystem";
import { getDailyMutationSeed } from "@/systems/dailyMutationSystem";

type InteractionStats = {
  clicks: number;
  rotations: number;
  pulls: number;
  offerings: number;
  wrongClicks: number;
  smallestObjectClicks: number;
  lingeredWorld: WorldId;
  visitedWorlds: WorldId[];
};

type WorldStore = {
  currentWorld: WorldId;
  previousWorld: WorldId;
  currentEra: EraId;
  currentMood: MoodId;
  clockRotation: number;
  minuteIntensity: number;
  glitchLevel: number;
  audioIntensity: number;
  isTransitioning: boolean;
  activeTransitionType: TransitionType;
  discoveredSecrets: string[];
  artifactInventory: string[];
  visitorAlias: string;
  creaturePopulation: number;
  portalObjects: HauntedObject[];
  unlockedWorlds: WorldId[];
  seraphMood: MoodId;
  timeOfVisit: string;
  floorNullUnlocked: boolean;
  dailyMutationSeed: number;
  lastSeraphLine: string;
  interactionStats: InteractionStats;
  initializeVisitor: () => void;
  startTransition: (world: WorldId, transition: TransitionType) => void;
  finishTransition: () => void;
  returnToDial: () => void;
  setClockRotation: (rotation: number) => void;
  setMinuteIntensity: (intensity: number) => void;
  setMood: (mood: MoodId) => void;
  setEra: (era: EraId) => void;
  addSecret: (secret: string) => void;
  addArtifact: (artifact: string) => void;
  trackInteraction: (type: keyof Omit<InteractionStats, "lingeredWorld" | "visitedWorlds">) => void;
  offerObject: (object: HauntedObject) => void;
  unlockWorld: (world: WorldId) => void;
  setSeraphLine: (line: string) => void;
  resetAlias: () => void;
};

const aliasPrefixes = [
  "VISITOR",
  "GHOST_CURSOR",
  "LOST_USER",
  "ANGELNODE",
  "STRAY_SIGNAL",
  "OFFLINE_SAINT",
];

function generateAlias() {
  const prefix = aliasPrefixes[Math.floor(Math.random() * aliasPrefixes.length)];
  const suffix = Math.random().toString(16).slice(2, 6).toUpperCase();
  return `${prefix}_${suffix}`;
}

function getStoredAlias() {
  if (typeof window === "undefined") {
    return "VISITOR_0000";
  }

  const existing = window.localStorage.getItem("angel-dial-visitor-alias");
  if (existing) {
    return existing;
  }

  const alias = generateAlias();
  window.localStorage.setItem("angel-dial-visitor-alias", alias);
  return alias;
}

export const useWorldStore = create<WorldStore>((set, get) => ({
  currentWorld: "angel-dial",
  previousWorld: "angel-dial",
  currentEra: "future-cathedral-os",
  currentMood: "haunted",
  clockRotation: 0,
  minuteIntensity: 0.22,
  glitchLevel: 0.06,
  audioIntensity: 0.28,
  isTransitioning: false,
  activeTransitionType: "liquid-glass-warp",
  discoveredSecrets: [],
  artifactInventory: [],
  visitorAlias: "VISITOR_0000",
  creaturePopulation: 34,
  portalObjects: [],
  unlockedWorlds: ["angel-dial", "cyber-goth-mall", "archive-ocean", "angel-server-cathedral", "rot-wall"],
  seraphMood: "haunted",
  timeOfVisit: new Date().toISOString(),
  floorNullUnlocked: false,
  dailyMutationSeed: getDailyMutationSeed(),
  lastSeraphLine: "The machine is listening softly.",
  interactionStats: {
    clicks: 0,
    rotations: 0,
    pulls: 0,
    offerings: 0,
    wrongClicks: 0,
    smallestObjectClicks: 0,
    lingeredWorld: "angel-dial",
    visitedWorlds: ["angel-dial"],
  },
  initializeVisitor: () =>
    set({
      visitorAlias: getStoredAlias(),
      timeOfVisit: new Date().toISOString(),
      dailyMutationSeed: getDailyMutationSeed(),
    }),
  startTransition: (world, transition) =>
    set((state) => ({
      previousWorld: state.currentWorld,
      currentWorld: world,
      isTransitioning: true,
      activeTransitionType: transition,
      interactionStats: {
        ...state.interactionStats,
        visitedWorlds: Array.from(new Set([...state.interactionStats.visitedWorlds, world])),
        lingeredWorld: world,
      },
    })),
  finishTransition: () => set({ isTransitioning: false }),
  returnToDial: () =>
    set((state) => ({
      previousWorld: state.currentWorld,
      currentWorld: "angel-dial",
      isTransitioning: true,
      activeTransitionType: "liquid-glass-warp",
    })),
  setClockRotation: (clockRotation) => set({ clockRotation }),
  setMinuteIntensity: (minuteIntensity) =>
    set({
      minuteIntensity,
      glitchLevel: Math.min(0.92, 0.12 + minuteIntensity * 0.72),
      audioIntensity: Math.min(1, 0.22 + minuteIntensity * 0.68),
    }),
  setMood: (currentMood) => set({ currentMood, seraphMood: currentMood }),
  setEra: (currentEra) => set({ currentEra }),
  addSecret: (secret) =>
    set((state) => ({
      discoveredSecrets: state.discoveredSecrets.includes(secret)
        ? state.discoveredSecrets
        : [...state.discoveredSecrets, secret],
      floorNullUnlocked: state.floorNullUnlocked || secret === "floor-null-glimpse",
    })),
  addArtifact: (artifact) =>
    set((state) => ({
      artifactInventory: [...state.artifactInventory, artifact],
    })),
  trackInteraction: (type) =>
    set((state) => ({
      interactionStats: {
        ...state.interactionStats,
        [type]: Number(state.interactionStats[type]) + 1,
      },
    })),
  offerObject: (object) => {
    const result = interpretOffering(object, get().currentMood);
    set((state) => ({
      portalObjects: [...state.portalObjects, object],
      artifactInventory: [...state.artifactInventory, object.label ?? object.id],
      previousWorld: state.currentWorld,
      currentWorld: result.destination,
      isTransitioning: true,
      activeTransitionType: result.transition,
      lastSeraphLine: result.seraphLine,
      unlockedWorlds: Array.from(new Set([...state.unlockedWorlds, result.destination])),
      interactionStats: {
        ...state.interactionStats,
        offerings: state.interactionStats.offerings + 1,
        visitedWorlds: Array.from(new Set([...state.interactionStats.visitedWorlds, result.destination])),
      },
    }));
  },
  unlockWorld: (world) =>
    set((state) => ({
      unlockedWorlds: Array.from(new Set([...state.unlockedWorlds, world])),
    })),
  setSeraphLine: (lastSeraphLine) => set({ lastSeraphLine }),
  resetAlias: () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("angel-dial-visitor-alias");
    }
    set({
      visitorAlias: getStoredAlias(),
      floorNullUnlocked: true,
      lastSeraphLine: "You asked to drift. The rain accepted this softly.",
    });
  },
}));
