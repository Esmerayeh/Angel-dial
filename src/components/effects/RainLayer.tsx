"use client";

import { useMemo } from "react";
import { useRuntimeStore } from "@/store/useRuntimeStore";
import { useWorldStore } from "@/store/useWorldStore";

export default function RainLayer() {
  const intensity = useWorldStore((state) => state.minuteIntensity);
  const weatherIntensity = useRuntimeStore((state) => state.weatherIntensity);
  const drops = useMemo(() => Array.from({ length: 90 }, (_, index) => index), []);

  return (
    <div
      className="rain-layer"
      style={{ "--rain-opacity": 0.14 + Math.max(intensity, weatherIntensity) * 0.45 } as React.CSSProperties}
      aria-hidden="true"
    >
      {drops.map((drop) => (
        <i
          key={drop}
          style={
            {
              "--x": `${(drop * 37) % 100}%`,
              "--delay": `${(drop % 17) * -0.19}s`,
              "--duration": `${0.68 + (drop % 9) * 0.08}s`,
              "--height": `${34 + (drop % 11) * 7}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
