"use client";

import { useRef, useState } from "react";
import { useRitualStore } from "@/store/useRitualStore";
import { useRuntimeStore } from "@/store/useRuntimeStore";
import { useWorldStore } from "@/store/useWorldStore";
import { audioMoodEngine } from "@/systems/audioMoodEngine";
import { pullInstrument, releasePullInstrument } from "@/systems/instrumentInteractionSystem";
import { clamp, mapRange } from "@/systems/physicsMath";

export default function ElevatorChain() {
  const startY = useRef(0);
  const [pulling, setPulling] = useState(false);
  const depth = useRitualStore((state) => state.elevatorDepth);
  const setElevatorDepth = useRitualStore((state) => state.setElevatorDepth);
  const runtimeInstrument = useRuntimeStore((state) => state.instruments["elevator-chain"]);
  const startRitual = useRuntimeStore((state) => state.startRitual);
  const finishRitual = useRuntimeStore((state) => state.finishRitual);
  const updateInstrument = useRuntimeStore((state) => state.updateInstrument);
  const startTransition = useWorldStore((state) => state.startTransition);

  return (
    <div className={`elevator-rig ${pulling ? "is-traveling" : ""}`} style={{ "--chain-pull": runtimeInstrument?.tension ?? 0 } as React.CSSProperties}>
      <div className="elevator-floor-windows" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <i key={index} style={{ "--i": index } as React.CSSProperties} />
        ))}
      </div>
      <button
        type="button"
        className={`elevator-chain ${pulling ? "is-pulling" : ""}`}
        onPointerDown={(event) => {
          setPulling(true);
          startY.current = event.clientY;
          startRitual("elevator-climb");
          event.currentTarget.setPointerCapture(event.pointerId);
          audioMoodEngine.blip("chain");
        }}
        onPointerMove={(event) => {
          if (!pulling) return;
          const pull = clamp(event.clientY - startY.current, 0, 260);
          const tension = pull / 260;
          const next = mapRange(tension, 0, 1, depth, Math.floor(depth) + 13);
          setElevatorDepth(next);
          updateInstrument("elevator-chain", pullInstrument("elevator-chain", pull, 260, useRuntimeStore.getState().instruments["elevator-chain"]));
        }}
        onPointerUp={(event) => {
          setPulling(false);
          event.currentTarget.releasePointerCapture(event.pointerId);
          const released = releasePullInstrument("elevator-chain", useRuntimeStore.getState().instruments["elevator-chain"]);
          updateInstrument("elevator-chain", released);
          finishRitual();
          audioMoodEngine.blip("chain");
          if (released.intensity > 0.72) {
            startTransition("angel-server-cathedral", "elevator-climb");
          }
        }}
        title="Pull the pearl chain"
        aria-label="Pull elevator chain"
      >
        {Array.from({ length: 13 }, (_, index) => (
          <span key={index} className={index < Math.floor(depth) % 13 ? "is-lit" : ""} />
        ))}
        <em>DRIFT</em>
      </button>
    </div>
  );
}
