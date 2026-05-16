import type { HauntedObject, WorldId } from "@/data/worlds";
import type { InsideViewId } from "@/store/useRuntimeStore";

export type InsideViewDefinition = {
  id: InsideViewId;
  title: string;
  sourceKinds: HauntedObject["kind"][];
  portalDestination?: WorldId;
  returnLine: string;
};

export const insideViewDefinitions: Record<InsideViewId, InsideViewDefinition> = {
  "cd-tray-city": {
    id: "cd-tray-city",
    title: "TINY CD TRAY CITY",
    sourceKinds: ["cd"],
    portalDestination: "archive-ocean",
    returnLine: "The CD tray closed with a tiny city still glowing inside.",
  },
  "popup-interior": {
    id: "popup-interior",
    title: "POP-UP INTERIOR",
    sourceKinds: ["popup"],
    portalDestination: "malware-chapel",
    returnLine: "The pop-up folded itself into a warning with furniture.",
  },
  "ghost-interior": {
    id: "ghost-interior",
    title: "GHOST VEIL INTERIOR",
    sourceKinds: ["ghost"],
    portalDestination: "memory-hospital",
    returnLine: "The ghost let go, but the silk remembered the tension.",
  },
  "clockwork-interior": {
    id: "clockwork-interior",
    title: "CLOCKWORK INTERIOR",
    sourceKinds: ["clock", "relic"],
    portalDestination: "forgotten-orrery",
    returnLine: "A tiny worker gave you a paper moon key and hid inside a gear.",
  },
  "bottle-message-world": {
    id: "bottle-message-world",
    title: "BOTTLE MESSAGE ROOM",
    sourceKinds: ["bottle"],
    portalDestination: "rot-wall",
    returnLine: "The bottle cork became a pearl charm and drifted to the Reliquary Wall.",
  },
};

const kindFallbacks: Partial<Record<HauntedObject["kind"], InsideViewId>> = {
  cd: "cd-tray-city",
  popup: "popup-interior",
  ghost: "ghost-interior",
  clock: "clockwork-interior",
  relic: "clockwork-interior",
  bottle: "bottle-message-world",
};

export function resolveInsideView(object: HauntedObject): InsideViewId | undefined {
  return object.insideViewId ?? kindFallbacks[object.kind];
}

export function getInsideViewDefinition(id: InsideViewId) {
  return insideViewDefinitions[id];
}

export function destinationFromInsideView(id: InsideViewId) {
  return insideViewDefinitions[id].portalDestination;
}
