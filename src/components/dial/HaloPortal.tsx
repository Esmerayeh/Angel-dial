"use client";

import PortalShader from "@/components/effects/PortalShader";
import { useRitualStore } from "@/store/useRitualStore";
import { useRuntimeStore } from "@/store/useRuntimeStore";
import { useWorldStore } from "@/store/useWorldStore";
import { audioMoodEngine } from "@/systems/audioMoodEngine";

export default function HaloPortal() {
  const draggedObject = useRitualStore((state) => state.draggedObject);
  const setDraggedObject = useRitualStore((state) => state.setDraggedObject);
  const pulseHalo = useRitualStore((state) => state.pulseHalo);
  const haloPulse = useRitualStore((state) => state.haloPulse);
  const offerObject = useWorldStore((state) => state.offerObject);
  const setSeraphLine = useWorldStore((state) => state.setSeraphLine);
  const startRitual = useRuntimeStore((state) => state.startRitual);
  const finishRitual = useRuntimeStore((state) => state.finishRitual);
  const portalPullStrength = useRuntimeStore((state) => state.portalPullStrength);
  const updateInstrument = useRuntimeStore((state) => state.updateInstrument);

  function feed() {
    startRitual("portal-feed");
    pulseHalo();
    updateInstrument("halo-portal", {
      id: "halo-portal",
      angle: 0,
      velocity: 0,
      tension: 0,
      dragging: false,
      intensity: Math.min(1, portalPullStrength + 0.45),
      audioValue: Math.min(1, portalPullStrength + 0.5),
      visualValue: 1,
    });
    if (draggedObject) {
      offerObject(draggedObject);
      setDraggedObject(undefined);
      audioMoodEngine.blip("portal");
    } else {
      setSeraphLine("The halo mouth opened, found nothing, and looked embarrassed.");
      audioMoodEngine.blip("error");
    }
    window.setTimeout(finishRitual, 220);
  }

  return (
    <button
      type="button"
      className="halo-portal"
      onDragOver={(event) => {
        event.preventDefault();
        startRitual("portal-feed");
      }}
      onDrop={(event) => {
        event.preventDefault();
        feed();
      }}
      onClick={feed}
      style={{ "--pulse": haloPulse } as React.CSSProperties}
      aria-label="Halo mouth portal. Drag relics into it."
      title="FEED THE MACHINE"
    >
      <PortalShader />
      <span className="halo-portal__mouth" />
      <strong>FEED THE MACHINE</strong>
    </button>
  );
}
