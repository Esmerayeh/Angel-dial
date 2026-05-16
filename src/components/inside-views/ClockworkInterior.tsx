"use client";

import { useRuntimeStore } from "@/store/useRuntimeStore";
import { useWorldStore } from "@/store/useWorldStore";
import { audioMoodEngine } from "@/systems/audioMoodEngine";

export default function ClockworkInterior() {
  const closeInsideView = useRuntimeStore((state) => state.closeInsideView);
  const startTransition = useWorldStore((state) => state.startTransition);
  const setSeraphLine = useWorldStore((state) => state.setSeraphLine);
  const unlockWorld = useWorldStore((state) => state.unlockWorld);

  return (
    <div className="inside-view__scene inside-view__scene--clockwork">
      <div className="clockwork-workers" aria-hidden="true">
        {Array.from({ length: 18 }, (_, index) => (
          <span key={index} style={{ "--i": index } as React.CSSProperties} />
        ))}
      </div>
      <button
        type="button"
        className="inside-view__portal-object"
        onClick={() => {
          audioMoodEngine.blip("portal");
          unlockWorld("forgotten-orrery");
          closeInsideView();
          setSeraphLine("A tiny worker handed you a paper moon key and rang a bell.");
          startTransition("forgotten-orrery", "clock-bloom");
        }}
      >
        TAKE PAPER MOON KEY FROM TINY WORKER
      </button>
    </div>
  );
}
