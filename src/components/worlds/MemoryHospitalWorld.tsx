"use client";

import { useRef, useState } from "react";
import CircularOSWindow from "@/components/diegetic-ui/CircularOSWindow";
import OldWebButton from "@/components/diegetic-ui/OldWebButton";
import { useRuntimeStore } from "@/store/useRuntimeStore";
import { useWorldStore } from "@/store/useWorldStore";
import { dragRotaryInstrument, releaseRotaryInstrument } from "@/systems/instrumentInteractionSystem";

const patients = [
  "abandoned blog",
  "forgotten fandom",
  "sleeping profile",
  "unfinished website",
  "cancelled dream",
  "deleted playlist",
  "old friendship",
];

export default function MemoryHospitalWorld() {
  const chartRef = useRef<HTMLButtonElement>(null);
  const [patient, setPatient] = useState(0);
  const [draggingChart, setDraggingChart] = useState(false);
  const runtimeInstrument = useRuntimeStore((state) => state.instruments["hospital-chart"]);
  const startRitual = useRuntimeStore((state) => state.startRitual);
  const finishRitual = useRuntimeStore((state) => state.finishRitual);
  const updateInstrument = useRuntimeStore((state) => state.updateInstrument);
  const startTransition = useWorldStore((state) => state.startTransition);
  const setSeraphLine = useWorldStore((state) => state.setSeraphLine);

  function rotateChart(event: React.PointerEvent<HTMLButtonElement>) {
    if (!chartRef.current) return;
    const instrument = dragRotaryInstrument(
      "hospital-chart",
      { x: event.clientX, y: event.clientY },
      chartRef.current.getBoundingClientRect(),
      useRuntimeStore.getState().instruments["hospital-chart"],
    );
    updateInstrument("hospital-chart", instrument);
    setPatient(Math.floor((instrument.angle / 360) * patients.length) % patients.length);
  }

  return (
    <div className="world world--hospital">
      <button
        ref={chartRef}
        className="hospital-chart"
        type="button"
        style={{ "--patient": `${runtimeInstrument?.angle ?? patient * 38}deg`, "--hospital-force": runtimeInstrument?.intensity ?? 0 } as React.CSSProperties}
        onPointerDown={(event) => {
          setDraggingChart(true);
          startRitual("world-instrument");
          event.currentTarget.setPointerCapture(event.pointerId);
          rotateChart(event);
        }}
        onPointerMove={(event) => {
          if (draggingChart) rotateChart(event);
        }}
        onPointerUp={(event) => {
          setDraggingChart(false);
          event.currentTarget.releasePointerCapture(event.pointerId);
          const released = releaseRotaryInstrument("hospital-chart", useRuntimeStore.getState().instruments["hospital-chart"]);
          updateInstrument("hospital-chart", released);
          setPatient(Math.floor((released.angle / 360) * patients.length) % patients.length);
          finishRitual();
          setSeraphLine("This room is not sad. It is still loading.");
        }}
      >
        <span />
        <strong>{patients[patient]}</strong>
      </button>
      <div className="hospital-curtains" aria-hidden="true">
        {Array.from({ length: 9 }, (_, index) => (
          <span key={index} style={{ "--i": index } as React.CSSProperties} />
        ))}
      </div>
      <CircularOSWindow title="CRT HEART MONITOR">
        <p>STATUS: AWAY / BUSY / OFFLINE</p>
        <p>patient: {patients[patient]}</p>
        <p>pulse: 56 browser tabs per minute</p>
      </CircularOSWindow>
      <div className="world-actions">
        <OldWebButton onClick={() => startTransition("archive-ocean", "ghost-veil")}>SEND CHART TO MOON WATER</OldWebButton>
        <OldWebButton onClick={() => startTransition("angel-dial", "liquid-glass-warp")}>LET CURTAIN RELEASE</OldWebButton>
      </div>
    </div>
  );
}
