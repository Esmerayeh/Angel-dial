import type { MoodId, WorldId } from "./worlds";

export type InstrumentId =
  | "angel-dial-clock"
  | "mall-fountain"
  | "archive-whirlpool"
  | "halo-engine"
  | "forgotten-orrery"
  | "hospital-chart"
  | "popup-rosary"
  | "black-taskbar"
  | "dead-radio"
  | "elevator-chain"
  | "ghost-pull"
  | "halo-portal"
  | "rot-wall";

export type InstrumentDefinition = {
  id: InstrumentId;
  world: WorldId;
  label: string;
  ritual: "rotate" | "pull" | "tune" | "feed" | "climb" | "align";
  friction: number;
  spring: number;
  snapAngles: number[];
  audioParameter: "pitch" | "filter" | "bass" | "static" | "drone" | "bitcrush";
  moodAffinity: MoodId[];
  visualEffect: "spiral" | "rain" | "glitch" | "bloom" | "veil" | "decay";
  portalOutcomes: WorldId[];
};

export type InstrumentRuntime = {
  id: InstrumentId;
  angle: number;
  velocity: number;
  tension: number;
  dragging: boolean;
  intensity: number;
  audioValue: number;
  visualValue: number;
  portalOutcome?: WorldId;
};

export const instruments: Record<InstrumentId, InstrumentDefinition> = {
  "angel-dial-clock": {
    id: "angel-dial-clock",
    world: "angel-dial",
    label: "Celestial clock hand",
    ritual: "rotate",
    friction: 0.9,
    spring: 0.18,
    snapAngles: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
    audioParameter: "pitch",
    moodAffinity: ["holy", "tender", "playful"],
    visualEffect: "spiral",
    portalOutcomes: [
      "gif-conservatory",
      "cyber-goth-mall",
      "archive-ocean",
      "angel-server-cathedral",
      "forgotten-orrery",
      "memory-hospital",
      "red-chatrooms",
      "rot-wall",
      "login-chapel",
      "malware-chapel",
      "black-desktop",
      "floor-null",
    ],
  },
  "mall-fountain": {
    id: "mall-fountain",
    world: "cyber-goth-mall",
    label: "Pearl fountain turntable",
    ritual: "rotate",
    friction: 0.86,
    spring: 0.12,
    snapAngles: [0, 60, 120, 180, 240, 300],
    audioParameter: "bass",
    moodAffinity: ["playful", "chaotic", "romantic"],
    visualEffect: "bloom",
    portalOutcomes: ["archive-ocean", "rot-wall"],
  },
  "archive-whirlpool": {
    id: "archive-whirlpool",
    world: "archive-ocean",
    label: "Archive whirlpool",
    ritual: "rotate",
    friction: 0.82,
    spring: 0.08,
    snapAngles: [0, 90, 180, 270],
    audioParameter: "filter",
    moodAffinity: ["lonely", "haunted", "tender"],
    visualEffect: "spiral",
    portalOutcomes: ["angel-server-cathedral", "rot-wall", "floor-null"],
  },
  "halo-engine": {
    id: "halo-engine",
    world: "angel-server-cathedral",
    label: "Halo engine",
    ritual: "align",
    friction: 0.88,
    spring: 0.16,
    snapAngles: [0, 72, 144, 216, 288],
    audioParameter: "drone",
    moodAffinity: ["holy", "haunted", "glitchy"],
    visualEffect: "bloom",
    portalOutcomes: ["forgotten-orrery", "rot-wall"],
  },
  "forgotten-orrery": {
    id: "forgotten-orrery",
    world: "forgotten-orrery",
    label: "Relic planet orrery",
    ritual: "align",
    friction: 0.84,
    spring: 0.11,
    snapAngles: [0, 47, 94, 141, 188, 235, 282, 329],
    audioParameter: "filter",
    moodAffinity: ["romantic", "glitchy", "cursed"],
    visualEffect: "spiral",
    portalOutcomes: ["cyber-goth-mall", "floor-null", "rot-wall"],
  },
  "hospital-chart": {
    id: "hospital-chart",
    world: "memory-hospital",
    label: "Rotating patient chart",
    ritual: "rotate",
    friction: 0.9,
    spring: 0.19,
    snapAngles: [0, 52, 104, 156, 208, 260, 312],
    audioParameter: "filter",
    moodAffinity: ["tender", "lonely", "haunted"],
    visualEffect: "veil",
    portalOutcomes: ["archive-ocean", "angel-dial"],
  },
  "popup-rosary": {
    id: "popup-rosary",
    world: "malware-chapel",
    label: "Soft popup rosary",
    ritual: "align",
    friction: 0.78,
    spring: 0.1,
    snapAngles: [0, 45, 90, 135, 180, 225, 270, 315],
    audioParameter: "static",
    moodAffinity: ["chaotic", "cursed", "feral"],
    visualEffect: "glitch",
    portalOutcomes: ["floor-null", "red-chatrooms"],
  },
  "black-taskbar": {
    id: "black-taskbar",
    world: "black-desktop",
    label: "Circular taskbar",
    ritual: "rotate",
    friction: 0.86,
    spring: 0.12,
    snapAngles: [0, 72, 144, 216, 288],
    audioParameter: "pitch",
    moodAffinity: ["glitchy", "lonely", "playful"],
    visualEffect: "glitch",
    portalOutcomes: ["archive-ocean", "malware-chapel"],
  },
  "dead-radio": {
    id: "dead-radio",
    world: "angel-dial",
    label: "Glass radio",
    ritual: "tune",
    friction: 0.8,
    spring: 0.09,
    snapAngles: [0, 66, 133, 199, 266, 333],
    audioParameter: "static",
    moodAffinity: ["cursed", "glitchy", "lonely"],
    visualEffect: "glitch",
    portalOutcomes: ["red-chatrooms", "floor-null"],
  },
  "elevator-chain": {
    id: "elevator-chain",
    world: "angel-dial",
    label: "Breathing elevator chain",
    ritual: "climb",
    friction: 0.72,
    spring: 0.2,
    snapAngles: [0],
    audioParameter: "bass",
    moodAffinity: ["haunted", "holy", "cursed"],
    visualEffect: "veil",
    portalOutcomes: ["angel-server-cathedral", "memory-hospital"],
  },
  "ghost-pull": {
    id: "ghost-pull",
    world: "angel-dial",
    label: "Hanging ghost veil",
    ritual: "pull",
    friction: 0.74,
    spring: 0.24,
    snapAngles: [0],
    audioParameter: "filter",
    moodAffinity: ["tender", "lonely", "haunted"],
    visualEffect: "veil",
    portalOutcomes: ["memory-hospital", "floor-null"],
  },
  "halo-portal": {
    id: "halo-portal",
    world: "angel-dial",
    label: "Halo mouth",
    ritual: "feed",
    friction: 0.92,
    spring: 0.22,
    snapAngles: [0],
    audioParameter: "bass",
    moodAffinity: ["haunted", "holy", "feral"],
    visualEffect: "bloom",
    portalOutcomes: ["archive-ocean", "forgotten-orrery", "rot-wall"],
  },
  "rot-wall": {
    id: "rot-wall",
    world: "rot-wall",
    label: "Reliquary Wall skin",
    ritual: "align",
    friction: 0.9,
    spring: 0.12,
    snapAngles: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
    audioParameter: "bitcrush",
    moodAffinity: ["glitchy", "tender", "cursed"],
    visualEffect: "decay",
    portalOutcomes: ["red-chatrooms", "floor-null", "archive-ocean"],
  },
};

export function createInstrumentRuntime(id: InstrumentId): InstrumentRuntime {
  return {
    id,
    angle: 0,
    velocity: 0,
    tension: 0,
    dragging: false,
    intensity: 0,
    audioValue: 0,
    visualValue: 0,
    portalOutcome: instruments[id].portalOutcomes[0],
  };
}
