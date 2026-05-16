"use client";

import { useWorldStore } from "@/store/useWorldStore";
import { useRuntimeStore } from "@/store/useRuntimeStore";

export default function GlitchLayer() {
  const glitchLevel = useWorldStore((state) => state.glitchLevel);
  const glitchPressure = useRuntimeStore((state) => state.glitchPressure);

  return (
    <div
      className="glitch-layer"
      style={{ "--glitch-level": Math.max(glitchLevel, glitchPressure) } as React.CSSProperties}
      aria-hidden="true"
    >
      <span />
      <span />
      <span />
    </div>
  );
}
