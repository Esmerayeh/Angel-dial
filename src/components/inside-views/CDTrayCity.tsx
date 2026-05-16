"use client";

import { useRuntimeStore } from "@/store/useRuntimeStore";
import { useWorldStore } from "@/store/useWorldStore";
import { audioMoodEngine } from "@/systems/audioMoodEngine";

export default function CDTrayCity() {
  const closeInsideView = useRuntimeStore((state) => state.closeInsideView);
  const startTransition = useWorldStore((state) => state.startTransition);
  const setSeraphLine = useWorldStore((state) => state.setSeraphLine);

  return (
    <div className="inside-view__scene inside-view__scene--cd">
      <div className="cd-city-disc" aria-hidden="true">
        {Array.from({ length: 16 }, (_, index) => (
          <span key={index} style={{ "--i": index } as React.CSSProperties} />
        ))}
      </div>
      <button
        type="button"
        className="inside-view__portal-object"
        onClick={() => {
          audioMoodEngine.blip("portal");
          closeInsideView();
          setSeraphLine("The CD alley opened a moon-thread door. Water came through first.");
          startTransition("archive-ocean", "spiral-descent");
        }}
      >
        MOON-THREAD DOOR INSIDE THE CD ALLEY
      </button>
      <p>tiny apartment lights blink in time with pearl music</p>
    </div>
  );
}
