"use client";

import { useRef, useState } from "react";
import OldWebButton from "@/components/diegetic-ui/OldWebButton";
import { useCreatureStore } from "@/store/useCreatureStore";
import { useRuntimeStore } from "@/store/useRuntimeStore";
import { useWorldStore } from "@/store/useWorldStore";
import { audioMoodEngine } from "@/systems/audioMoodEngine";
import { dragRotaryInstrument, releaseRotaryInstrument } from "@/systems/instrumentInteractionSystem";

const constellations = [
  ["GLASS CD", "GHOST CURSOR", "ARCADE RECEIPT"],
  ["MOON THREAD", "CANDLE", "WHISPER BUBBLE"],
  ["DOLL HEAD", "BROWSER PETAL", "PASSWORD PEARL"],
  ["FLOPPY BIRD", "MOON", "PEARL LINK"],
];

export default function ForgottenOrreryWorld() {
  const orreryRef = useRef<HTMLButtonElement>(null);
  const [alignment, setAlignment] = useState(0);
  const [draggingOrrery, setDraggingOrrery] = useState(false);
  const runtimeInstrument = useRuntimeStore((state) => state.instruments["forgotten-orrery"]);
  const startRitual = useRuntimeStore((state) => state.startRitual);
  const finishRitual = useRuntimeStore((state) => state.finishRitual);
  const updateInstrument = useRuntimeStore((state) => state.updateInstrument);
  const openInsideView = useRuntimeStore((state) => state.openInsideView);
  const startTransition = useWorldStore((state) => state.startTransition);
  const setSeraphLine = useWorldStore((state) => state.setSeraphLine);
  const addSecret = useWorldStore((state) => state.addSecret);
  const summonBigCursor = useCreatureStore((state) => state.summonBigCursor);
  const constellation = constellations[alignment % constellations.length];

  function alignOrrery(event: React.PointerEvent<HTMLButtonElement>) {
    if (!orreryRef.current) return;
    const instrument = dragRotaryInstrument(
      "forgotten-orrery",
      { x: event.clientX, y: event.clientY },
      orreryRef.current.getBoundingClientRect(),
      useRuntimeStore.getState().instruments["forgotten-orrery"],
    );
    updateInstrument("forgotten-orrery", instrument);
    setAlignment(Math.floor(instrument.angle / 47));
  }

  return (
    <div className="world world--orrery">
      <button
        ref={orreryRef}
        type="button"
        className={`forgotten-orrery ${draggingOrrery ? "is-dragging" : ""}`}
        style={{ "--alignment": `${runtimeInstrument?.angle ?? alignment * 47}deg`, "--orrery-force": runtimeInstrument?.intensity ?? 0 } as React.CSSProperties}
        onPointerDown={(event) => {
          setDraggingOrrery(true);
          startRitual("world-instrument");
          event.currentTarget.setPointerCapture(event.pointerId);
          alignOrrery(event);
          audioMoodEngine.blip("portal");
        }}
        onPointerMove={(event) => {
          if (draggingOrrery) alignOrrery(event);
        }}
        onPointerUp={(event) => {
          setDraggingOrrery(false);
          event.currentTarget.releasePointerCapture(event.pointerId);
          const released = releaseRotaryInstrument("forgotten-orrery", useRuntimeStore.getState().instruments["forgotten-orrery"]);
          updateInstrument("forgotten-orrery", released);
          setAlignment(Math.floor(released.angle / 47));
          finishRitual();
          setSeraphLine("You aligned small moons into a living sentence.");
        }}
      >
        {constellations.flat().map((label, index) => (
          <span key={`${label}-${index}`} style={{ "--i": index } as React.CSSProperties}>
            {label}
          </span>
        ))}
        <strong>FORGOTTEN ORRERY</strong>
      </button>
      <div className="constellation-readout">
        <b>ACTIVE CONSTELLATION</b>
        {constellation.map((part) => (
          <span key={part}>{part}</span>
        ))}
      </div>
      <div className="orrery-worldlets">
        <button type="button" onClick={() => openInsideView("cd-tray-city", "GLASS CD + GHOST CURSOR + ARCADE RECEIPT")}>
          tiny music-box store inside a CD tray
        </button>
        <button type="button" onClick={() => setSeraphLine("The tiny website shrine lit one candle and one smiling avatar.")}>
          tiny website shrine
        </button>
        <button type="button" onClick={() => setSeraphLine("A login dollhouse opened a rose window and asked for a dream word.")}>
          password dollhouse
        </button>
        <button
          type="button"
          onClick={() => {
            addSecret("floor-null-glimpse");
            summonBigCursor();
            setSeraphLine("The white cursor moon is far away, which is close for a myth.");
          }}
        >
          floating train station
        </button>
      </div>
      <div className="world-actions">
        <OldWebButton onClick={() => startTransition("rot-wall", "clock-bloom")}>OPEN RELIQUARY WALL</OldWebButton>
        <OldWebButton onClick={() => startTransition("angel-dial", "liquid-glass-warp")}>FALL BACK INTO DIAL</OldWebButton>
      </div>
    </div>
  );
}
