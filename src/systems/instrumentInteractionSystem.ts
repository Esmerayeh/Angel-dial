import { createInstrumentRuntime, instruments, type InstrumentId, type InstrumentRuntime } from "@/data/instruments";
import { clockRooms, type WorldId } from "@/data/worlds";
import { angleFromPointer, clamp, mapRange, normalizeAngle, shortestAngleDelta, snapAngle, type Point } from "./physicsMath";

export function getInstrumentRuntime(existing: InstrumentRuntime | undefined, id: InstrumentId) {
  return existing ?? createInstrumentRuntime(id);
}

export function dragRotaryInstrument(id: InstrumentId, point: Point, rect: DOMRect, previous?: InstrumentRuntime): InstrumentRuntime {
  const base = getInstrumentRuntime(previous, id);
  const angle = angleFromPointer(point, rect);
  const velocity = shortestAngleDelta(base.angle, angle);
  const intensity = clamp(Math.abs(velocity) / 42);
  const definition = instruments[id];
  const outcomeIndex = Math.floor(mapRange(normalizeAngle(angle), 0, 360, 0, definition.portalOutcomes.length));

  return {
    ...base,
    angle,
    velocity,
    dragging: true,
    intensity,
    audioValue: clamp(intensity * 0.72 + normalizeAngle(angle) / 360 * 0.28),
    visualValue: clamp(intensity * 0.6 + 0.22),
    portalOutcome: definition.portalOutcomes[outcomeIndex] ?? definition.portalOutcomes[0],
  };
}

export function releaseRotaryInstrument(id: InstrumentId, previous?: InstrumentRuntime): InstrumentRuntime {
  const base = getInstrumentRuntime(previous, id);
  const definition = instruments[id];
  const snapped = snapAngle(base.angle, definition.snapAngles);
  const intensity = clamp(Math.abs(base.velocity) / 30);

  return {
    ...base,
    angle: snapped,
    velocity: base.velocity * definition.friction,
    dragging: false,
    intensity,
    audioValue: clamp(base.audioValue + intensity * 0.25),
    visualValue: clamp(base.visualValue + intensity * 0.35),
  };
}

export function pullInstrument(id: InstrumentId, pullDistance: number, maxDistance: number, previous?: InstrumentRuntime): InstrumentRuntime {
  const base = getInstrumentRuntime(previous, id);
  const tension = clamp(pullDistance / maxDistance);

  return {
    ...base,
    velocity: tension - base.tension,
    tension,
    dragging: true,
    intensity: tension,
    audioValue: tension,
    visualValue: tension,
  };
}

export function releasePullInstrument(id: InstrumentId, previous?: InstrumentRuntime): InstrumentRuntime {
  const base = getInstrumentRuntime(previous, id);
  return {
    ...base,
    velocity: base.tension * -0.48,
    tension: 0,
    dragging: false,
    intensity: base.tension,
    audioValue: base.tension,
    visualValue: base.tension,
  };
}

export function worldFromClockInstrument(instrument: InstrumentRuntime): WorldId {
  const angle = normalizeAngle(instrument.angle);
  const roomIndex = Math.round(angle / 30) % clockRooms.length;
  return clockRooms[roomIndex]?.id ?? "gif-conservatory";
}

export function transitionHintForInstrument(id: InstrumentId, outcome?: WorldId) {
  if (id === "archive-whirlpool" || outcome === "archive-ocean" || outcome === "red-chatrooms" || outcome === "floor-null") {
    return "spiral-descent" as const;
  }
  if (id === "elevator-chain") {
    return "elevator-climb" as const;
  }
  if (id === "dead-radio") {
    return "spiral-descent" as const;
  }
  if (outcome === "memory-hospital") {
    return "ghost-veil" as const;
  }
  return "clock-bloom" as const;
}
