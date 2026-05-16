"use client";

import { useRuntimeStore } from "@/store/useRuntimeStore";
import { useRotWallStore } from "@/store/useRotWallStore";
import { useWorldStore } from "@/store/useWorldStore";

export default function BottleMessageWorld() {
  const closeInsideView = useRuntimeStore((state) => state.closeInsideView);
  const addArtifactRelic = useRotWallStore((state) => state.addArtifactRelic);
  const startTransition = useWorldStore((state) => state.startTransition);
  const alias = useWorldStore((state) => state.visitorAlias);
  const mood = useWorldStore((state) => state.currentMood);
  const setSeraphLine = useWorldStore((state) => state.setSeraphLine);

  return (
    <div className="inside-view__scene inside-view__scene--bottle">
      <div className="bottle-forum-posts">
        <p>unknown_angel: the moon water kept the letter</p>
        <p>stray_signal: drifting softly</p>
        <p>offline_saint: the cork is a door</p>
      </div>
      <button
        type="button"
        className="inside-view__portal-object"
        onClick={() => {
          addArtifactRelic(
            {
              id: `bottle-${Date.now()}`,
              text: "MOON LETTER STILL FLOATING",
              place: "moon bottle",
              alias,
              createdAt: new Date().toISOString(),
            },
            mood,
          );
          closeInsideView();
          setSeraphLine("The bottle message became a relic with moon water under it.");
          startTransition("rot-wall", "clock-bloom");
        }}
      >
        PLACE MOON LETTER ON RELIQUARY WALL
      </button>
    </div>
  );
}
