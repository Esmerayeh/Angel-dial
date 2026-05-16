"use client";

import OldWebButton from "@/components/diegetic-ui/OldWebButton";
import { useWorldStore } from "@/store/useWorldStore";

export default function FloorNullWorld() {
  const startTransition = useWorldStore((state) => state.startTransition);
  const resetAlias = useWorldStore((state) => state.resetAlias);

  return (
    <div className="world world--floor-null">
      <div className="null-cathedral">
        <span className="null-moon" />
        <span className="null-cursor" />
        {Array.from({ length: 11 }, (_, index) => (
          <i key={index} style={{ "--i": index } as React.CSSProperties}>
            silent message
          </i>
        ))}
      </div>
      <div className="floor-null-copy">
        <b>QUIET FLOOR</b>
        <span>WHITE MIST</span>
        <p>The floor is not missing. It has become very soft.</p>
      </div>
      <div className="world-actions">
        <OldWebButton onClick={resetAlias}>let the alias drift</OldWebButton>
        <OldWebButton onClick={() => startTransition("angel-dial", "liquid-glass-warp")}>RETURN THROUGH MIST</OldWebButton>
      </div>
    </div>
  );
}
