"use client";

import { useRef, useState } from "react";
import CursedPopup from "@/components/diegetic-ui/CursedPopup";
import OldWebButton from "@/components/diegetic-ui/OldWebButton";
import { portalOfferings } from "@/data/objects";
import { pickSeraphLine } from "@/data/seraphLines";
import { useRuntimeStore } from "@/store/useRuntimeStore";
import { useWorldStore } from "@/store/useWorldStore";
import { audioMoodEngine } from "@/systems/audioMoodEngine";
import { dragRotaryInstrument, releaseRotaryInstrument } from "@/systems/instrumentInteractionSystem";

export default function AngelServerWorld() {
  const engineRef = useRef<HTMLButtonElement>(null);
  const [engineRotation, setEngineRotation] = useState(0);
  const [draggingEngine, setDraggingEngine] = useState(false);
  const [consoleOpen, setConsoleOpen] = useState(false);
  const runtimeInstrument = useRuntimeStore((state) => state.instruments["halo-engine"]);
  const startRitual = useRuntimeStore((state) => state.startRitual);
  const finishRitual = useRuntimeStore((state) => state.finishRitual);
  const updateInstrument = useRuntimeStore((state) => state.updateInstrument);
  const openInsideView = useRuntimeStore((state) => state.openInsideView);
  const stats = useWorldStore((state) => state.interactionStats);
  const line = useWorldStore((state) => state.lastSeraphLine);
  const setSeraphLine = useWorldStore((state) => state.setSeraphLine);
  const startTransition = useWorldStore((state) => state.startTransition);
  const unlockWorld = useWorldStore((state) => state.unlockWorld);

  function rotateEngine(event: React.PointerEvent<HTMLButtonElement>) {
    if (!engineRef.current) return;
    const instrument = dragRotaryInstrument(
      "halo-engine",
      { x: event.clientX, y: event.clientY },
      engineRef.current.getBoundingClientRect(),
      useRuntimeStore.getState().instruments["halo-engine"],
    );
    updateInstrument("halo-engine", instrument);
    setEngineRotation(instrument.angle);
    setSeraphLine(pickSeraphLine("angel-server-cathedral", stats.clicks + Math.floor(instrument.angle)));
    if (instrument.angle > 150) {
      unlockWorld("forgotten-orrery");
    }
  }

  return (
    <div className="world world--server">
      <button
        ref={engineRef}
        type="button"
        className={`halo-engine ${draggingEngine ? "is-dragging" : ""}`}
        style={{ "--engine-rotation": `${runtimeInstrument?.angle ?? engineRotation}deg`, "--engine-force": runtimeInstrument?.intensity ?? 0 } as React.CSSProperties}
        onPointerDown={(event) => {
          setDraggingEngine(true);
          startRitual("world-instrument");
          event.currentTarget.setPointerCapture(event.pointerId);
          rotateEngine(event);
          audioMoodEngine.blip("portal");
        }}
        onPointerMove={(event) => {
          if (draggingEngine) rotateEngine(event);
        }}
        onPointerUp={(event) => {
          setDraggingEngine(false);
          event.currentTarget.releasePointerCapture(event.pointerId);
          const released = releaseRotaryInstrument("halo-engine", useRuntimeStore.getState().instruments["halo-engine"]);
          updateInstrument("halo-engine", released);
          setEngineRotation(released.angle);
          finishRitual();
          if (released.angle >= 216 && released.angle <= 288) {
            unlockWorld("forgotten-orrery");
            setSeraphLine("The Halo Engine aligned. SERAPH-404 opened the Forgotten Orrery like a cloud bell.");
          }
        }}
      >
        <span />
        <span />
        <span />
        <strong>HALO ENGINE</strong>
      </button>
      <div className="server-pews" aria-hidden="true">
        {Array.from({ length: 18 }, (_, index) => (
          <span key={index} style={{ "--i": index } as React.CSSProperties} />
        ))}
      </div>
      <CursedPopup title="SERAPH-404" tone="blue" onClick={() => setConsoleOpen(true)}>
        <p>{line}</p>
        <code>visited:{stats.visitedWorlds.length} offerings:{stats.offerings} pulls:{stats.pulls}</code>
      </CursedPopup>
      <div className="cable-organ">
        {["thought", "sound", "image", "memory", "secret", "question", "moon thread"].map((slot, index) => (
          <button
            key={slot}
            type="button"
            onClick={() => {
              setSeraphLine(`The ${slot} slot chimed. SERAPH-404 filed your gesture under ${index === 4 ? "hidden" : "temporary"}.`);
              audioMoodEngine.blip("portal");
            }}
          >
            {slot}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="cable-ladder"
        onClick={() => startTransition("rot-wall", "elevator-climb")}
      >
        CLIMB TO RELIQUARY WALL
      </button>
      <div className="world-actions">
        <OldWebButton onClick={() => startTransition("forgotten-orrery", "clock-bloom")}>ALIGN PAPER MOONS</OldWebButton>
        <OldWebButton onClick={() => openInsideView("clockwork-interior", "HALO ENGINE GEAR")}>OPEN ENGINE GEAR</OldWebButton>
        <OldWebButton onClick={() => startTransition("angel-dial", "liquid-glass-warp")}>RETURN THROUGH HALO</OldWebButton>
      </div>
      {consoleOpen ? (
        <div className="micro-world micro-world--server">
          <CursedPopup title="HALO CONSOLE" tone="violet" onClick={() => setConsoleOpen(false)}>
            <p>Drop a relic into the console. The machine will sing as if it was always a ritual.</p>
            <div className="halo-console-slots">
              {portalOfferings.slice(0, 4).map((object) => (
                <button
                  key={object.id}
                  type="button"
                  onClick={() => {
                    setSeraphLine(`You offered ${object.label}. We stored it near a warm server pew.`);
                    setConsoleOpen(false);
                  }}
                >
                  {object.label}
                </button>
              ))}
            </div>
          </CursedPopup>
        </div>
      ) : null}
    </div>
  );
}
