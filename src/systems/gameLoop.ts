"use client";

import type { InstrumentRuntime } from "@/data/instruments";
import type { MoodId, WorldId } from "@/data/worlds";
import type { RitualId, TransitionPhase, RuntimePointer, CameraRuntime } from "@/store/useRuntimeStore";
import { clamp, lerp, springTo } from "./physicsMath";

export type GameLoopState = {
  elapsedTime: number;
  deltaTime: number;
  pointer: RuntimePointer;
  activeRitual?: RitualId;
  currentWorld: WorldId;
  currentMood: MoodId;
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
  instruments: Partial<Record<string, InstrumentRuntime>>;
};

export type GameLoopInputs = {
  now: number;
  previousNow: number;
  world: {
    currentWorld: WorldId;
    currentMood: MoodId;
    isTransitioning: boolean;
    clockRotation: number;
    minuteIntensity: number;
    audioIntensity: number;
    glitchLevel: number;
  };
  ritual: {
    ghostPull: number;
    radioFrequency: number;
    haloPulse: number;
    elevatorDepth: number;
    draggedObjectActive: boolean;
  };
};

function phaseFromProgress(progress: number, transitioning: boolean): TransitionPhase {
  if (!transitioning) return "idle";
  if (progress < 0.22) return "anticipation";
  if (progress < 0.48) return "transformation";
  if (progress < 0.78) return "travel";
  return "arrival";
}

function strongestInstrument(instruments: Partial<Record<string, InstrumentRuntime>>) {
  return Object.values(instruments).reduce(
    (strongest, instrument) => (!strongest || (instrument?.intensity ?? 0) > (strongest?.intensity ?? 0) ? instrument : strongest),
    undefined as InstrumentRuntime | undefined,
  );
}

export function stepGameLoop(previous: GameLoopState, inputs: GameLoopInputs) {
  const rawDelta = (inputs.now - inputs.previousNow) / 1000;
  const deltaTime = clamp(Number.isFinite(rawDelta) ? rawDelta : 1 / 60, 1 / 120, 1 / 24);
  const strongest = strongestInstrument(previous.instruments);
  const pointerMotion = clamp(previous.pointer.speed / 42);
  const instrumentMotion = clamp((Math.abs(strongest?.velocity ?? 0) / 38) + (strongest?.intensity ?? 0) * 0.7);
  const ghostTension = clamp(inputs.ritual.ghostPull / 290);
  const radioStatic = clamp((inputs.ritual.radioFrequency - 33) / 68);
  const portalTarget = clamp(
    inputs.world.minuteIntensity * 0.32 +
      ghostTension * 0.42 +
      (inputs.ritual.draggedObjectActive ? 0.38 : 0) +
      (strongest?.id === "halo-portal" ? strongest.intensity : 0) * 0.46,
  );
  const portalSpring = springTo(previous.portalPullStrength, portalTarget, previous.clockHandInertia, 0.09, 0.82, deltaTime);
  const transitionTarget = inputs.world.isTransitioning ? 1 : 0;
  const transitionSpring = springTo(previous.transitionProgress, transitionTarget, 0, inputs.world.isTransitioning ? 0.045 : 0.12, 0.86, deltaTime);
  const transitionProgress = inputs.world.isTransitioning ? clamp(previous.transitionProgress + deltaTime / 2.35) : clamp(transitionSpring.value);
  const phase = phaseFromProgress(transitionProgress, inputs.world.isTransitioning);
  const audioIntensity = clamp(
    0.15 +
      inputs.world.audioIntensity * 0.46 +
      portalTarget * 0.28 +
      pointerMotion * 0.16 +
      instrumentMotion * 0.26 +
      (inputs.world.isTransitioning ? 0.22 : 0),
  );
  const physicsIntensity = clamp(0.12 + pointerMotion * 0.35 + instrumentMotion * 0.38 + ghostTension * 0.26 + portalTarget * 0.18);
  const weatherIntensity = clamp(0.16 + inputs.world.minuteIntensity * 0.42 + (inputs.world.currentWorld === "archive-ocean" ? 0.28 : 0) + radioStatic * 0.16);
  const creatureActivity = clamp(0.24 + pointerMotion * 0.18 + instrumentMotion * 0.36 + (inputs.world.isTransitioning ? -0.12 : 0.08));
  const glitchPressure = clamp(inputs.world.glitchLevel * 0.52 + radioStatic * 0.28 + instrumentMotion * 0.24 + (phase === "travel" ? 0.28 : 0));
  const particleSpiral = clamp(portalTarget * 0.54 + instrumentMotion * 0.32 + (phase === "transformation" ? 0.34 : 0.12));
  const sceneMood = clamp(0.28 + audioIntensity * 0.38 + glitchPressure * 0.24 + weatherIntensity * 0.1);
  const camera: CameraRuntime = {
    x: lerp(previous.camera.x, (previous.pointer.x - window.innerWidth / 2) * 0.006 * physicsIntensity, 0.08),
    y: lerp(previous.camera.y, (previous.pointer.y - window.innerHeight / 2) * 0.005 * physicsIntensity, 0.08),
    scale: lerp(previous.camera.scale, 1 + portalTarget * 0.035 + (phase === "travel" ? 0.08 : 0), 0.09),
    rotation: lerp(previous.camera.rotation, instrumentMotion * 2.2 + (phase === "transformation" ? 4 : 0), 0.07),
  };

  return {
    elapsedTime: previous.elapsedTime + deltaTime,
    deltaTime,
    currentWorld: inputs.world.currentWorld,
    currentMood: inputs.world.currentMood,
    transitionPhase: phase,
    transitionProgress,
    audioIntensity,
    physicsIntensity,
    weatherIntensity,
    creatureActivity,
    portalPullStrength: portalSpring.value,
    glitchPressure,
    particleSpiral,
    clockHandInertia: portalSpring.velocity,
    sceneMood,
    camera,
  };
}
