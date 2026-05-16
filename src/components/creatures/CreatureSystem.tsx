"use client";

import CursorCherub from "./CursorCherub";
import PopupImp from "./PopupImp";
import HaloFish from "./HaloFish";
import LoadingMoth from "./LoadingMoth";
import CRTMonk from "./CRTMonk";
import FloppyBird from "./FloppyBird";
import CableSpider from "./CableSpider";
import GhostVeil from "./GhostVeil";
import PixelPet from "./PixelPet";
import BigWhiteCursor from "./BigWhiteCursor";
import { useCreatureStore } from "@/store/useCreatureStore";
import { useRuntimeStore } from "@/store/useRuntimeStore";
import { useWorldStore } from "@/store/useWorldStore";
import { audioMoodEngine } from "@/systems/audioMoodEngine";

export default function CreatureSystem() {
  const creatures = useCreatureStore((state) => state.creatures);
  const activity = useRuntimeStore((state) => state.creatureActivity);
  const setSeraphLine = useWorldStore((state) => state.setSeraphLine);
  const trackInteraction = useWorldStore((state) => state.trackInteraction);

  function notice(line: string) {
    trackInteraction("smallestObjectClicks");
    setSeraphLine(line);
    audioMoodEngine.blip("ghost");
  }

  return (
    <div className="creature-system" style={{ "--creature-activity": activity } as React.CSSProperties} aria-label="Strange floating internet spirits">
      {creatures.map((creature) => {
        if (creature.kind === "cursor-cherub") return <CursorCherub key={creature.id} creature={creature} onNotice={notice} />;
        if (creature.kind === "popup-imp") return <PopupImp key={creature.id} creature={creature} onNotice={notice} />;
        if (creature.kind === "halo-fish") return <HaloFish key={creature.id} creature={creature} onNotice={notice} />;
        if (creature.kind === "loading-moth") return <LoadingMoth key={creature.id} creature={creature} onNotice={notice} />;
        if (creature.kind === "crt-monk") return <CRTMonk key={creature.id} creature={creature} onNotice={notice} />;
        if (creature.kind === "floppy-bird") return <FloppyBird key={creature.id} creature={creature} onNotice={notice} />;
        if (creature.kind === "cable-spider") return <CableSpider key={creature.id} creature={creature} onNotice={notice} />;
        if (creature.kind === "ghost-veil") return <GhostVeil key={creature.id} creature={creature} onNotice={notice} />;
        return <PixelPet key={creature.id} creature={creature} onNotice={notice} />;
      })}
      <BigWhiteCursor />
    </div>
  );
}
