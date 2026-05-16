"use client";

import { useRuntimeStore } from "@/store/useRuntimeStore";
import { useWorldStore } from "@/store/useWorldStore";
import { audioMoodEngine } from "@/systems/audioMoodEngine";

export default function BlackDesktopWorld() {
  const updateInstrument = useRuntimeStore((state) => state.updateInstrument);
  const setSeraphLine = useWorldStore((state) => state.setSeraphLine);

  return (
    <div className="world world--stub">
      <button
        type="button"
        className="stub-rose-window"
        onClick={() => {
          updateInstrument("black-taskbar", {
            id: "black-taskbar",
            angle: 144,
            velocity: 24,
            tension: 0,
            dragging: false,
            intensity: 0.62,
            audioValue: 0.7,
            visualValue: 0.7,
            portalOutcome: "archive-ocean",
          });
          audioMoodEngine.blip("portal");
          setSeraphLine("The pearl taskbar modulated the music box and opened three paper-bird windows.");
        }}
      >
        MOON DESKTOP IS HUMMING
      </button>
    </div>
  );
}
