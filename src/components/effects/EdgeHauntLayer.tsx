"use client";

import { useMemo } from "react";
import { useRuntimeStore } from "@/store/useRuntimeStore";

const labels = ["pearl", "moon", "bell", "wing", "moth", "flower", "glass", "dial"];

export default function EdgeHauntLayer() {
  const physics = useRuntimeStore((state) => state.physicsIntensity);
  const portal = useRuntimeStore((state) => state.portalPullStrength);
  const glitch = useRuntimeStore((state) => state.glitchPressure);
  const scraps = useMemo(
    () =>
      Array.from({ length: 42 }, (_, index) => ({
        id: `edge-${index}`,
        side: index % 4,
        label: labels[index % labels.length],
        delay: (index % 13) * -0.23,
        offset: (index * 17) % 96,
        size: 9 + (index % 6) * 3,
      })),
    [],
  );

  return (
    <div
      className="edge-haunt-layer"
      style={{ "--edge-physics": physics, "--edge-portal": portal, "--edge-glitch": glitch } as React.CSSProperties}
      aria-hidden="true"
    >
      {scraps.map((scrap) => (
        <span
          key={scrap.id}
          className={`edge-haunt edge-haunt--${scrap.side}`}
          style={
            {
              "--edge-offset": `${scrap.offset}%`,
              "--edge-delay": `${scrap.delay}s`,
              "--edge-size": `${scrap.size}px`,
            } as React.CSSProperties
          }
        >
          {scrap.label}
        </span>
      ))}
      <i className="edge-cable edge-cable--left" />
      <i className="edge-cable edge-cable--right" />
      <i className="edge-eye edge-eye--one" />
      <i className="edge-eye edge-eye--two" />
      <i className="edge-eye edge-eye--three" />
    </div>
  );
}
