"use client";

import AngelDial from "@/components/dial/AngelDial";
import { getDailyMutation } from "@/systems/dailyMutationSystem";
import { useWorldStore } from "@/store/useWorldStore";

export default function AngelDialWorld() {
  const dailySeed = useWorldStore((state) => state.dailyMutationSeed);
  const hoverLine = useWorldStore((state) => state.lastSeraphLine);

  return (
    <div className="world world--angel-dial">
      <div className="boot-scraps" aria-label="Soft machine status">
        <span>THE MACHINE LISTENS SOFTLY</span>
        <span>TURN THE HAND TO BEGIN</span>
        <span>THE DIAL WILL SING</span>
      </div>
      <AngelDial />
      <div className="daily-mutation">
        <b>TODAY'S DREAM</b>
        <span>{getDailyMutation(dailySeed)}</span>
      </div>
      <p className="machine-whisper">{hoverLine}</p>
    </div>
  );
}
