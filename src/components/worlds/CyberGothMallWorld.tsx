"use client";

import { useRef, useState } from "react";
import OldWebButton from "@/components/diegetic-ui/OldWebButton";
import { portalOfferings } from "@/data/objects";
import { useRuntimeStore } from "@/store/useRuntimeStore";
import { useWorldStore } from "@/store/useWorldStore";
import { audioMoodEngine } from "@/systems/audioMoodEngine";
import { dragRotaryInstrument, releaseRotaryInstrument } from "@/systems/instrumentInteractionSystem";
import { getSticker } from "@/systems/stickerGenerator";

export default function CyberGothMallWorld() {
  const fountainRef = useRef<HTMLButtonElement>(null);
  const [floor, setFloor] = useState(0);
  const [draggingFountain, setDraggingFountain] = useState(false);
  const [shopperBurst, setShopperBurst] = useState(13);
  const runtimeInstrument = useRuntimeStore((state) => state.instruments["mall-fountain"]);
  const startRitual = useRuntimeStore((state) => state.startRitual);
  const finishRitual = useRuntimeStore((state) => state.finishRitual);
  const updateInstrument = useRuntimeStore((state) => state.updateInstrument);
  const openInsideView = useRuntimeStore((state) => state.openInsideView);
  const startTransition = useWorldStore((state) => state.startTransition);
  const offerObject = useWorldStore((state) => state.offerObject);
  const setSeraphLine = useWorldStore((state) => state.setSeraphLine);

  function spinFountain(event: React.PointerEvent<HTMLButtonElement>) {
    if (!fountainRef.current) return;
    const instrument = dragRotaryInstrument(
      "mall-fountain",
      { x: event.clientX, y: event.clientY },
      fountainRef.current.getBoundingClientRect(),
      useRuntimeStore.getState().instruments["mall-fountain"],
    );
    updateInstrument("mall-fountain", instrument);
    setFloor(Math.floor((instrument.angle / 360) * 7));
    setShopperBurst(13 + Math.floor(instrument.intensity * 16));
  }

  return (
    <div className="world world--mall">
      <div
        className="mall-spiral"
        style={{ "--floor": floor, "--mall-rotation": `${runtimeInstrument?.angle ?? floor * 24}deg`, "--mall-force": runtimeInstrument?.intensity ?? 0 } as React.CSSProperties}
      >
        {Array.from({ length: 7 }, (_, index) => (
          <button
            type="button"
            className="mall-balcony"
            key={index}
            style={{ "--i": index } as React.CSSProperties}
            onClick={() => {
              setFloor(index);
              audioMoodEngine.blip("portal");
            }}
          >
            <span>{["PEARL ARCADE", "MOON CAFE", "CD TRAY CITY", "SOFT SIGNAL GAMES", "SIGIL KIOSK", "AURA BOOTH", "RELIQUARY LOCKERS"][index]}</span>
          </button>
        ))}
      </div>
      <button
        ref={fountainRef}
        type="button"
        className={`mall-fountain ${draggingFountain ? "is-dragging" : ""}`}
        style={{ "--fountain-rotation": `${runtimeInstrument?.angle ?? 0}deg`, "--fountain-force": runtimeInstrument?.intensity ?? 0 } as React.CSSProperties}
        onPointerDown={(event) => {
          setDraggingFountain(true);
          startRitual("world-instrument");
          event.currentTarget.setPointerCapture(event.pointerId);
          spinFountain(event);
          audioMoodEngine.blip("portal");
        }}
        onPointerMove={(event) => {
          if (draggingFountain) spinFountain(event);
        }}
        onPointerUp={(event) => {
          setDraggingFountain(false);
          event.currentTarget.releasePointerCapture(event.pointerId);
          const released = releaseRotaryInstrument("mall-fountain", useRuntimeStore.getState().instruments["mall-fountain"]);
          updateInstrument("mall-fountain", released);
          finishRitual();
          setSeraphLine("The fountain rotated the Dream Arcade, brightened the music, and added moon shoppers to the orbit.");
        }}
      >
        <span />
        <strong>DREAM ARCADE</strong>
      </button>
      <button
        type="button"
        className="arcade-cabinet"
        onClick={() => {
          openInsideView("popup-interior", "SOFT SIGNAL ARCADE");
          setSeraphLine("A pearl cabinet opened a chapel of soft warnings, but only halfway.");
        }}
      >
        <b>PEARL ARCADE CABINET</b>
        <span>INSERT MOON PEARL INTO WATER</span>
      </button>
      <button
        type="button"
        className="cd-tray-world"
        onClick={() => {
          openInsideView("cd-tray-city", "CD TRAY CITY");
          audioMoodEngine.blip("portal");
        }}
      >
        <span />
        <em>CD TRAY CITY</em>
      </button>
      <div className="mall-stickers">
        {Array.from({ length: 12 }, (_, index) => (
          <button key={index} type="button" onClick={() => setSeraphLine(getSticker(index))}>
            {getSticker(index)}
          </button>
        ))}
      </div>
      <div className="mall-shoppers" aria-hidden="true">
        {Array.from({ length: shopperBurst }, (_, index) => (
          <span key={index} style={{ "--i": index } as React.CSSProperties} />
        ))}
      </div>
      <div className="world-actions">
        <OldWebButton onClick={() => offerObject(portalOfferings[0])}>DROP MOON BOTTLE INTO FOUNTAIN</OldWebButton>
        <OldWebButton onClick={() => startTransition("archive-ocean", "spiral-descent")}>FOLLOW WATER RIPPLE</OldWebButton>
      </div>
    </div>
  );
}
