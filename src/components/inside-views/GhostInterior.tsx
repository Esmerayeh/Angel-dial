"use client";

import { useRuntimeStore } from "@/store/useRuntimeStore";
import { useWorldStore } from "@/store/useWorldStore";

export default function GhostInterior() {
  const closeInsideView = useRuntimeStore((state) => state.closeInsideView);
  const startTransition = useWorldStore((state) => state.startTransition);

  return (
    <div className="inside-view__scene inside-view__scene--ghost">
      <div className="ghost-curtain-map" aria-hidden="true">
        {Array.from({ length: 10 }, (_, index) => (
          <span key={index} style={{ "--i": index } as React.CSSProperties} />
        ))}
      </div>
      <button
        type="button"
        className="inside-view__portal-object"
        onClick={() => {
          closeInsideView();
          startTransition("memory-hospital", "ghost-veil");
        }}
      >
        OPEN THE QUIET WARD THROUGH THE VEIL
      </button>
    </div>
  );
}
