"use client";

import ClockHand from "./ClockHand";
import DeadRadio from "./DeadRadio";
import ElevatorChain from "./ElevatorChain";
import GhostPull from "./GhostPull";
import HaloPortal from "./HaloPortal";
import OrbitRing from "./OrbitRing";
import RitualObject from "./RitualObject";
import { portalOfferings } from "@/data/objects";
import { clockRooms, type WorldId } from "@/data/worlds";
import { useWorldStore } from "@/store/useWorldStore";

const eraItems = [
  { id: "era-1999", label: "Pearl Web" },
  { id: "era-2003", label: "Dream Mall" },
  { id: "era-2007", label: "Soft Page" },
  { id: "era-2012", label: "Cloud Blog" },
  { id: "era-future", label: "Sky OS" },
  { id: "era-unknown", label: "Mist" },
];

const placeItems: Array<{ id: string; label: string; sublabel: string; world: WorldId; roomIndex: number }> = clockRooms.map((room) => ({
  id: room.id,
  label: room.name,
  sublabel: room.subtitle,
  world: room.id,
  roomIndex: room.index,
}));

const moodItems = [
  { id: "haunted", label: "Haunted" },
  { id: "playful", label: "Playful" },
  { id: "tender", label: "Tender" },
  { id: "cursed", label: "Strange" },
  { id: "holy", label: "Holy" },
  { id: "glitchy", label: "Shimmer" },
];

export default function AngelDial() {
  const startTransition = useWorldStore((state) => state.startTransition);

  function chooseWorld(world: WorldId) {
    const transition =
      world === "archive-ocean"
        ? "spiral-descent"
        : world === "memory-hospital" || world === "gif-conservatory"
          ? "ghost-veil"
          : "clock-bloom";
    startTransition(world, transition);
  }

  return (
    <section className="angel-dial" aria-label="Angel Dial central ritual machine">
      <GhostPull />
      <ElevatorChain />
      <DeadRadio />
      <div className="angel-dial__machine">
        <span className="angel-dial__breath" />
        <OrbitRing type="era" radius={276} items={eraItems} />
        <OrbitRing type="place" radius={338} items={placeItems} />
        <OrbitRing type="mood" radius={162} items={moodItems} />
        <HaloPortal />
        <ClockHand onWorldGesture={chooseWorld} />
        <div className="angel-dial__numerals" aria-hidden="true">
          {Array.from({ length: 12 }, (_, index) => (
            <span key={index} style={{ "--i": index } as React.CSSProperties}>
              {index === 0 ? "XII" : index}
            </span>
          ))}
        </div>
      </div>
      <div className="ritual-object-cloud" aria-label="Drag relics into the halo mouth">
        {portalOfferings.map((object, index) => (
          <RitualObject key={object.id} object={object} index={index} />
        ))}
      </div>
    </section>
  );
}
