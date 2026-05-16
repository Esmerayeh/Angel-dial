"use client";

import { useEffect } from "react";
import { useRuntimeStore } from "@/store/useRuntimeStore";
import { useRotWallStore } from "@/store/useRotWallStore";
import { useWorldStore } from "@/store/useWorldStore";
import { audioMoodEngine } from "@/systems/audioMoodEngine";
import { corruptRelicText } from "@/systems/rotWallSystem";
import { dragRotaryInstrument, releaseRotaryInstrument } from "@/systems/instrumentInteractionSystem";

export default function RotWallWorld() {
  const relics = useRotWallStore((state) => state.relics);
  const initializeRotWall = useRotWallStore((state) => state.initializeRotWall);
  const mutateRelics = useRotWallStore((state) => state.mutateRelics);
  const discoverRelic = useRotWallStore((state) => state.discoverRelic);
  const startRitual = useRuntimeStore((state) => state.startRitual);
  const finishRitual = useRuntimeStore((state) => state.finishRitual);
  const runtimeInstrument = useRuntimeStore((state) => state.instruments["rot-wall"]);
  const updateInstrument = useRuntimeStore((state) => state.updateInstrument);
  const setSeraphLine = useWorldStore((state) => state.setSeraphLine);
  const startTransition = useWorldStore((state) => state.startTransition);

  useEffect(() => {
    initializeRotWall();
    const interval = window.setInterval(mutateRelics, 2200);
    return () => window.clearInterval(interval);
  }, [initializeRotWall, mutateRelics]);

  return (
    <div className="world world--rot-wall">
      <button
        type="button"
        className="rot-wall-machine-skin"
        style={{ "--rot-wall-angle": `${runtimeInstrument?.angle ?? 0}deg` } as React.CSSProperties}
        onPointerDown={(event) => {
          startRitual("world-instrument");
          event.currentTarget.setPointerCapture(event.pointerId);
          updateInstrument("rot-wall", dragRotaryInstrument("rot-wall", { x: event.clientX, y: event.clientY }, event.currentTarget.getBoundingClientRect(), runtimeInstrument));
          audioMoodEngine.blip("portal");
        }}
        onPointerMove={(event) => {
          if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
          updateInstrument("rot-wall", dragRotaryInstrument("rot-wall", { x: event.clientX, y: event.clientY }, event.currentTarget.getBoundingClientRect(), useRuntimeStore.getState().instruments["rot-wall"]));
        }}
        onPointerUp={(event) => {
          event.currentTarget.releasePointerCapture(event.pointerId);
          const released = releaseRotaryInstrument("rot-wall", useRuntimeStore.getState().instruments["rot-wall"]);
          updateInstrument("rot-wall", released);
          finishRitual();
          if ((released.portalOutcome === "floor-null" && released.intensity > 0.55) || released.angle > 300) {
            setSeraphLine("A rare relic bloomed into a door, then tucked itself back into the wall.");
          }
        }}
      >
        <strong>RELIQUARY WALL</strong>
      </button>
      <div className="rot-wall-relic-layer">
        {relics.map((relic) => (
          <button
            key={relic.id}
            type="button"
            className={`rot-relic rot-relic--${relic.type}`}
            style={
              {
                "--x": `${relic.x}%`,
                "--y": `${relic.y}%`,
                "--decay": relic.decayLevel,
                "--seed": relic.mutationSeed % 360,
              } as React.CSSProperties
            }
            onClick={() => {
              discoverRelic(relic.id);
              audioMoodEngine.blip(relic.portalChance > 0.86 ? "portal" : "ghost");
              if (relic.portalChance > 0.9) {
                setSeraphLine("This relic has bloomed into a portal. The wall is pretending this is normal.");
                startTransition(relic.mood === "cursed" ? "floor-null" : "red-chatrooms", "spiral-descent");
              } else {
                setSeraphLine(`Relic discovered ${relic.discoveredCount + 1} time(s): ${relic.type.replace("-", " ")}.`);
              }
            }}
          >
            {corruptRelicText(relic.content, relic.decayLevel, relic.mutationSeed)}
          </button>
        ))}
      </div>
    </div>
  );
}
