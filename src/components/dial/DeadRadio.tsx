"use client";

import { useRef, useState } from "react";
import { useRitualStore } from "@/store/useRitualStore";
import { useRuntimeStore } from "@/store/useRuntimeStore";
import { useWorldStore } from "@/store/useWorldStore";
import { audioMoodEngine } from "@/systems/audioMoodEngine";
import { dragRotaryInstrument, releaseRotaryInstrument } from "@/systems/instrumentInteractionSystem";
import { mapRange, normalizeAngle } from "@/systems/physicsMath";

export default function DeadRadio() {
  const dialRef = useRef<HTMLButtonElement>(null);
  const [dragging, setDragging] = useState(false);
  const frequency = useRitualStore((state) => state.radioFrequency);
  const setRadioFrequency = useRitualStore((state) => state.setRadioFrequency);
  const runtimeInstrument = useRuntimeStore((state) => state.instruments["dead-radio"]);
  const startRitual = useRuntimeStore((state) => state.startRitual);
  const finishRitual = useRuntimeStore((state) => state.finishRitual);
  const updateInstrument = useRuntimeStore((state) => state.updateInstrument);
  const startTransition = useWorldStore((state) => state.startTransition);
  const setSeraphLine = useWorldStore((state) => state.setSeraphLine);
  const hotSignal = frequency > 86 || frequency < 37;

  function tune(event: React.PointerEvent<HTMLButtonElement>) {
    if (!dialRef.current) return;
    const instrument = dragRotaryInstrument(
      "dead-radio",
      { x: event.clientX, y: event.clientY },
      dialRef.current.getBoundingClientRect(),
      useRuntimeStore.getState().instruments["dead-radio"],
    );
    updateInstrument("dead-radio", instrument);
    setRadioFrequency(mapRange(normalizeAngle(instrument.angle), 0, 360, 33.3, 99.9));
  }

  return (
    <div className={`dead-radio ${hotSignal ? "has-signal" : ""}`} aria-label="Dead radio frequency dial">
      <button
        ref={dialRef}
        type="button"
        className={`dead-radio__dial ${dragging ? "is-dragging" : ""}`}
        onPointerDown={(event) => {
          setDragging(true);
          startRitual("radio-tune");
          event.currentTarget.setPointerCapture(event.pointerId);
          tune(event);
          audioMoodEngine.blip("portal");
        }}
        onPointerMove={(event) => {
          if (dragging) tune(event);
        }}
        onPointerUp={(event) => {
          setDragging(false);
          event.currentTarget.releasePointerCapture(event.pointerId);
          const released = releaseRotaryInstrument("dead-radio", useRuntimeStore.getState().instruments["dead-radio"]);
          const tuned = mapRange(normalizeAngle(released.angle), 0, 360, 33.3, 99.9);
          updateInstrument("dead-radio", released);
          setRadioFrequency(tuned);
          finishRitual();

          if (tuned > 91) {
            startTransition("red-chatrooms", "spiral-descent");
          } else if (tuned < 36) {
            setSeraphLine("The radio tuned below numbers. The Quiet Floor answered with mist.");
          } else if (tuned > 82) {
            startTransition("archive-ocean", "spiral-descent");
          } else {
            setSeraphLine("A whisper frequency shimmered, then hid in the glass.");
          }
        }}
        style={{ "--radio-rotation": `${runtimeInstrument?.angle ?? frequency * 2.8}deg`, "--radio-force": runtimeInstrument?.intensity ?? 0 } as React.CSSProperties}
        title="Tune the glass radio"
      >
        <span />
      </button>
      <code>{frequency.toFixed(1)} DREAM FM</code>
      <div className="radio-signal-ghosts" aria-hidden="true">
        {["moon signal", "quiet floor?", "soft whisper"].map((line, index) => (
          <span key={line} style={{ "--i": index } as React.CSSProperties}>
            {frequency < 37 && index === 1 ? "quiet floor?" : line}
          </span>
        ))}
      </div>
    </div>
  );
}
