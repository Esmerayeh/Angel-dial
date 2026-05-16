"use client";

import { useRef, useState } from "react";
import { useRitualStore } from "@/store/useRitualStore";
import { useRuntimeStore } from "@/store/useRuntimeStore";
import { useWorldStore } from "@/store/useWorldStore";
import { audioMoodEngine } from "@/systems/audioMoodEngine";
import { pullInstrument, releasePullInstrument } from "@/systems/instrumentInteractionSystem";
import { clamp } from "@/systems/physicsMath";

export default function GhostPull() {
  const startY = useRef(0);
  const [pulling, setPulling] = useState(false);
  const ghostPull = useRitualStore((state) => state.ghostPull);
  const setGhostPull = useRitualStore((state) => state.setGhostPull);
  const startRitual = useRuntimeStore((state) => state.startRitual);
  const finishRitual = useRuntimeStore((state) => state.finishRitual);
  const updateInstrument = useRuntimeStore((state) => state.updateInstrument);
  const startTransition = useWorldStore((state) => state.startTransition);
  const trackInteraction = useWorldStore((state) => state.trackInteraction);
  const addSecret = useWorldStore((state) => state.addSecret);

  return (
    <button
      type="button"
      className={`ghost-pull ${pulling ? "is-pulling" : ""}`}
      style={{ "--ghost-pull": `${ghostPull}px`, "--ghost-tension": Math.min(1, ghostPull / 290) } as React.CSSProperties}
      onPointerDown={(event) => {
        startY.current = event.clientY;
        setPulling(true);
        startRitual("ghost-pull");
        event.currentTarget.setPointerCapture(event.pointerId);
        audioMoodEngine.blip("ghost");
      }}
      onPointerMove={(event) => {
        if (!pulling) {
          return;
        }
        const pull = clamp(event.clientY - startY.current, 0, 290);
        setGhostPull(pull);
        updateInstrument("ghost-pull", pullInstrument("ghost-pull", pull, 290, useRuntimeStore.getState().instruments["ghost-pull"]));
      }}
      onPointerUp={(event) => {
        setPulling(false);
        event.currentTarget.releasePointerCapture(event.pointerId);
        updateInstrument("ghost-pull", releasePullInstrument("ghost-pull", useRuntimeStore.getState().instruments["ghost-pull"]));
        finishRitual();
        trackInteraction("pulls");

        if (ghostPull > 238) {
          addSecret("floor-null-glimpse");
          startTransition("floor-null", "ghost-veil");
        } else if (ghostPull > 125) {
          startTransition("memory-hospital", "ghost-veil");
        }

        window.setTimeout(() => setGhostPull(0), 240);
      }}
      aria-label="Pull the hanging ghost"
      title="PULL THE SILK GHOST"
    >
      <span className="ghost-pull__veil" />
      <span className="ghost-pull__face">VEIL</span>
    </button>
  );
}
