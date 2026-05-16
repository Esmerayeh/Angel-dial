import type { HauntedObject, MoodId, TransitionType, WorldId } from "@/data/worlds";

type PortalInterpretation = {
  destination: WorldId;
  transition: TransitionType;
  seraphLine: string;
};

const moodFallback: Record<MoodId, PortalInterpretation> = {
  haunted: {
    destination: "archive-ocean",
    transition: "spiral-descent",
    seraphLine: "The archive has accepted the haunted part.",
  },
  playful: {
    destination: "cyber-goth-mall",
    transition: "orrery-shift",
    seraphLine: "The mall has opened a toy door.",
  },
  tender: {
    destination: "memory-hospital",
    transition: "ghost-veil",
    seraphLine: "The curtain noticed the soft offering.",
  },
  cursed: {
    destination: "floor-null",
    transition: "spiral-descent",
    seraphLine: "The machine coughed up a forbidden floor.",
  },
  chaotic: {
    destination: "cyber-goth-mall",
    transition: "mechanical-swallow",
    seraphLine: "Chaos was fed. The arcade is awake.",
  },
  lonely: {
    destination: "archive-ocean",
    transition: "spiral-descent",
    seraphLine: "A bottle has made room for the lonely object.",
  },
  holy: {
    destination: "angel-server-cathedral",
    transition: "clock-bloom",
    seraphLine: "A server wing unfolded behind the halo.",
  },
  romantic: {
    destination: "forgotten-orrery",
    transition: "clock-bloom",
    seraphLine: "A dead planet briefly became a locket.",
  },
  glitchy: {
    destination: "forgotten-orrery",
    transition: "liquid-glass-warp",
    seraphLine: "The glass bent into a constellation.",
  },
  feral: {
    destination: "floor-null",
    transition: "mechanical-swallow",
    seraphLine: "The Big White Cursor heard the feral signal.",
  },
};

export function transitionForDestination(destination: WorldId): TransitionType {
  if (destination === "archive-ocean" || destination === "floor-null" || destination === "red-chatrooms") {
    return "spiral-descent";
  }
  if (destination === "memory-hospital") {
    return "ghost-veil";
  }
  if (destination === "cyber-goth-mall" || destination === "angel-server-cathedral") {
    return "orrery-shift";
  }
  return "clock-bloom";
}

export function interpretOffering(object: HauntedObject, mood: MoodId): PortalInterpretation {
  if (object.destination) {
    return {
      destination: object.destination,
      transition: transitionForDestination(object.destination),
      seraphLine:
        object.destination === "forgotten-orrery"
          ? "This object leads nowhere, which is still a place."
          : `The ${object.label ?? object.kind} has become a route.`,
    };
  }

  return moodFallback[mood];
}
