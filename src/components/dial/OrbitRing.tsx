"use client";

import { eras, moods, type EraId, type MoodId, type WorldId } from "@/data/worlds";
import { useRuntimeStore } from "@/store/useRuntimeStore";
import { useWorldStore } from "@/store/useWorldStore";
import { audioMoodEngine } from "@/systems/audioMoodEngine";
import { worldFromClockInstrument } from "@/systems/instrumentInteractionSystem";

type OrbitRingProps = {
  type: "era" | "place" | "mood";
  radius: number;
  items: Array<{ id: string; label: string; sublabel?: string; world?: WorldId; roomIndex?: number }>;
};

export default function OrbitRing({ type, radius, items }: OrbitRingProps) {
  const setEra = useWorldStore((state) => state.setEra);
  const setMood = useWorldStore((state) => state.setMood);
  const currentWorld = useWorldStore((state) => state.currentWorld);
  const setSeraphLine = useWorldStore((state) => state.setSeraphLine);
  const trackInteraction = useWorldStore((state) => state.trackInteraction);
  const clockInstrument = useRuntimeStore((state) => state.instruments["angel-dial-clock"]);
  const selectedWorld = clockInstrument && (clockInstrument.dragging || clockInstrument.intensity > 0.05) ? worldFromClockInstrument(clockInstrument) : currentWorld;

  function disturb(item: { id: string; label: string; world?: WorldId }, index: number) {
    trackInteraction("rotations");
    audioMoodEngine.blip("portal");

    if (type === "era") {
      setEra(eras[index % eras.length] as EraId);
      return;
    }

    if (type === "mood") {
      setMood(moods[index % moods.length] as MoodId);
      return;
    }

    if (item.world) {
      setSeraphLine(`${item.label} is listening. Turn the hand toward it.`);
    }
  }

  return (
    <div className={`orbit-ring orbit-ring--${type}`} style={{ "--radius": `${radius}px` } as React.CSSProperties}>
      {items.map((item, index) => (
        <button
          key={item.id}
          className={`orbit-ring__charm ${type === "place" && item.world === selectedWorld ? "is-preselected" : ""}`}
          type="button"
          onClick={() => disturb(item, index)}
          style={{ "--i": index, "--count": items.length } as React.CSSProperties}
          title={item.label}
        >
          <span>{item.label}</span>
          {item.sublabel ? <small>{item.sublabel}</small> : null}
        </button>
      ))}
    </div>
  );
}
