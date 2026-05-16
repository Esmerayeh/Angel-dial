"use client";

import { useRuntimeStore } from "@/store/useRuntimeStore";
import { useWorldStore } from "@/store/useWorldStore";
import { audioMoodEngine } from "@/systems/audioMoodEngine";

export default function PopupInterior() {
  const closeInsideView = useRuntimeStore((state) => state.closeInsideView);
  const addSecret = useWorldStore((state) => state.addSecret);
  const setSeraphLine = useWorldStore((state) => state.setSeraphLine);

  return (
    <div className="inside-view__scene inside-view__scene--popup">
      <div className="popup-room-stack">
        {["OK", "CANCEL", "HELP", "MAYBE", "LATER"].map((label, index) => (
          <button
            key={label}
            type="button"
            style={{ "--i": index } as React.CSSProperties}
            onClick={() => {
              audioMoodEngine.blip("portal");
              if (index === 3) {
                addSecret("floor-null-popup-hint");
                setSeraphLine("A lilac button showed the Quiet Floor for one frame, which counts as a map.");
              }
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <button type="button" className="inside-view__portal-object" onClick={closeInsideView}>
        FOLD WARNING BACK INTO A FLOWER
      </button>
    </div>
  );
}
