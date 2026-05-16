"use client";

import { useEffect, useRef } from "react";
import { useRuntimeStore, type RuntimePointer } from "@/store/useRuntimeStore";
import { useRitualStore } from "@/store/useRitualStore";
import { useWorldStore } from "@/store/useWorldStore";
import { audioMoodEngine } from "@/systems/audioMoodEngine";
import { stepGameLoop, type GameLoopState } from "@/systems/gameLoop";
import { normalizeAngle } from "@/systems/physicsMath";

function readLoopState(pointer: RuntimePointer): GameLoopState {
  const runtime = useRuntimeStore.getState();
  return {
    elapsedTime: runtime.elapsedTime,
    deltaTime: runtime.deltaTime,
    pointer,
    activeRitual: runtime.activeRitual,
    currentWorld: runtime.currentWorld,
    currentMood: runtime.currentMood,
    transitionProgress: runtime.transitionProgress,
    audioIntensity: runtime.audioIntensity,
    physicsIntensity: runtime.physicsIntensity,
    weatherIntensity: runtime.weatherIntensity,
    creatureActivity: runtime.creatureActivity,
    portalPullStrength: runtime.portalPullStrength,
    glitchPressure: runtime.glitchPressure,
    particleSpiral: runtime.particleSpiral,
    clockHandInertia: runtime.clockHandInertia,
    sceneMood: runtime.sceneMood,
    camera: runtime.camera,
    instruments: runtime.instruments,
  };
}

export default function RuntimeController() {
  const previousNow = useRef(0);

  useEffect(() => {
    const setPointer = useRuntimeStore.getState().setPointer;

    function move(event: PointerEvent) {
      setPointer(event.clientX, event.clientY);
    }

    window.addEventListener("pointermove", move, { passive: true });
    setPointer(window.innerWidth / 2, window.innerHeight / 2);

    return () => window.removeEventListener("pointermove", move);
  }, []);

  useEffect(() => {
    let frame = 0;
    previousNow.current = performance.now();

    const tick = (now: number) => {
      const runtime = useRuntimeStore.getState();
      const world = useWorldStore.getState();
      const ritual = useRitualStore.getState();
      const patch = stepGameLoop(readLoopState(runtime.pointer), {
        now,
        previousNow: previousNow.current,
        world: {
          currentWorld: world.currentWorld,
          currentMood: world.currentMood,
          isTransitioning: world.isTransitioning,
          clockRotation: world.clockRotation,
          minuteIntensity: world.minuteIntensity,
          audioIntensity: world.audioIntensity,
          glitchLevel: world.glitchLevel,
        },
        ritual: {
          ghostPull: ritual.ghostPull,
          radioFrequency: ritual.radioFrequency,
          haloPulse: ritual.haloPulse,
          elevatorDepth: ritual.elevatorDepth,
          draggedObjectActive: Boolean(ritual.draggedObject),
        },
      });

      useRuntimeStore.getState().commitFrame(patch);
      audioMoodEngine.updateRuntime({
        world: patch.currentWorld,
        mood: patch.currentMood,
        audioIntensity: patch.audioIntensity,
        portalPull: patch.portalPullStrength,
        ghostTension: Math.min(1, ritual.ghostPull / 290),
        radioFrequency: ritual.radioFrequency,
        elevatorHeight: Math.min(1, ritual.elevatorDepth / 13),
        transitionProgress: patch.transitionProgress,
        glitchPressure: patch.glitchPressure,
        pitchBend: (runtime.instruments["angel-dial-clock"]?.audioValue ?? 0) + (runtime.instruments["black-taskbar"]?.audioValue ?? 0) * 0.4,
        filterSweep:
          (runtime.instruments["archive-whirlpool"]?.audioValue ?? 0) +
          (runtime.instruments["hospital-chart"]?.audioValue ?? 0) * 0.6,
        rotWallDecay: runtime.instruments["rot-wall"]?.audioValue ?? 0,
      });

      const root = document.documentElement;
      const ghostTension = runtime.instruments["ghost-pull"]?.tension ?? Math.min(1, ritual.ghostPull / 290);
      const elevatorTension = runtime.instruments["elevator-chain"]?.tension ?? Math.min(1, ritual.elevatorDepth / 13);
      const radioHeat = Math.max(0, (ritual.radioFrequency - 82) / 18, (36 - ritual.radioFrequency) / 4);
      root.style.setProperty("--runtime-audio", String(patch.audioIntensity));
      root.style.setProperty("--runtime-physics", String(patch.physicsIntensity));
      root.style.setProperty("--runtime-weather", String(patch.weatherIntensity));
      root.style.setProperty("--runtime-portal", String(patch.portalPullStrength));
      root.style.setProperty("--runtime-glitch", String(patch.glitchPressure));
      root.style.setProperty("--runtime-spiral", String(patch.particleSpiral));
      root.style.setProperty("--runtime-ghost", String(ghostTension));
      root.style.setProperty("--runtime-elevator", String(elevatorTension));
      root.style.setProperty("--runtime-radio", String(Math.min(1, radioHeat)));
      root.style.setProperty("--runtime-camera-x", `${patch.camera.x}px`);
      root.style.setProperty("--runtime-camera-y", `${patch.camera.y}px`);
      root.style.setProperty("--runtime-camera-scale", String(patch.camera.scale));
      root.style.setProperty("--runtime-camera-rotation", `${patch.camera.rotation}deg`);
      const clock = useRuntimeStore.getState().instruments["angel-dial-clock"];
      const clockAngle = normalizeAngle(clock?.angle ?? world.clockRotation);
      const clockPressure = Math.min(1, Math.max(clock?.intensity ?? 0, Math.abs(clock?.velocity ?? 0) / 36));
      root.style.setProperty("--clock-angle", `${clockAngle}deg`);
      root.style.setProperty("--clock-pressure", String(clockPressure));
      root.style.setProperty("--selected-room-index", String(Math.round(clockAngle / 30) % 12));
      root.style.setProperty("--transition-progress", String(patch.transitionProgress));
      root.style.setProperty("--dream-intensity", String(Math.min(1, 0.28 + patch.audioIntensity * 0.5 + patch.particleSpiral * 0.35)));
      root.style.setProperty("--mist-drift", String(Math.min(1, patch.weatherIntensity + ghostTension * 0.22)));
      root.style.setProperty("--water-ripple", String(Math.min(1, ritual.haloPulse + patch.portalPullStrength + patch.transitionProgress * 0.25)));

      previousNow.current = now;
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return null;
}
