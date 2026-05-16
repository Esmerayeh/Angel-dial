"use client";

import { useRef, useState } from "react";
import FakeBrowserWindow from "@/components/diegetic-ui/FakeBrowserWindow";
import OldWebButton from "@/components/diegetic-ui/OldWebButton";
import { portalOfferings } from "@/data/objects";
import { useRuntimeStore } from "@/store/useRuntimeStore";
import { useWorldStore } from "@/store/useWorldStore";
import { audioMoodEngine } from "@/systems/audioMoodEngine";
import { dragRotaryInstrument, releaseRotaryInstrument } from "@/systems/instrumentInteractionSystem";

export default function ArchiveOceanWorld() {
  const whirlpoolRef = useRef<HTMLButtonElement>(null);
  const [draggingWhirlpool, setDraggingWhirlpool] = useState(false);
  const [leviathanAwake, setLeviathanAwake] = useState(false);
  const runtimeInstrument = useRuntimeStore((state) => state.instruments["archive-whirlpool"]);
  const startRitual = useRuntimeStore((state) => state.startRitual);
  const finishRitual = useRuntimeStore((state) => state.finishRitual);
  const updateInstrument = useRuntimeStore((state) => state.updateInstrument);
  const openInsideView = useRuntimeStore((state) => state.openInsideView);
  const startTransition = useWorldStore((state) => state.startTransition);
  const offerObject = useWorldStore((state) => state.offerObject);
  const setSeraphLine = useWorldStore((state) => state.setSeraphLine);

  function stirWhirlpool(event: React.PointerEvent<HTMLButtonElement>) {
    if (!whirlpoolRef.current) return;
    const instrument = dragRotaryInstrument(
      "archive-whirlpool",
      { x: event.clientX, y: event.clientY },
      whirlpoolRef.current.getBoundingClientRect(),
      useRuntimeStore.getState().instruments["archive-whirlpool"],
    );
    updateInstrument("archive-whirlpool", instrument);
    if (instrument.intensity > 0.72) {
      setLeviathanAwake(true);
    }
  }

  return (
    <div className="world world--ocean">
      <button
        ref={whirlpoolRef}
        className="archive-whirlpool"
        type="button"
        style={{ "--whirlpool-angle": `${runtimeInstrument?.angle ?? 0}deg`, "--whirlpool-force": runtimeInstrument?.intensity ?? 0 } as React.CSSProperties}
        onPointerDown={(event) => {
          setDraggingWhirlpool(true);
          startRitual("world-instrument");
          event.currentTarget.setPointerCapture(event.pointerId);
          stirWhirlpool(event);
          audioMoodEngine.blip("portal");
        }}
        onPointerMove={(event) => {
          if (draggingWhirlpool) stirWhirlpool(event);
        }}
        onPointerUp={(event) => {
          setDraggingWhirlpool(false);
          event.currentTarget.releasePointerCapture(event.pointerId);
          const released = releaseRotaryInstrument("archive-whirlpool", useRuntimeStore.getState().instruments["archive-whirlpool"]);
          updateInstrument("archive-whirlpool", released);
          finishRitual();
          setSeraphLine(
            released.intensity > 0.62
              ? "The whirlpool pulled moon bottles, pearl links, and the audio filter into the same soft current."
              : "The whirlpool is a browser loading flower wearing water.",
          );
        }}
      >
        <span />
        <strong>ARCHIVE OCEAN</strong>
      </button>
      <div className={`link-leviathan ${leviathanAwake ? "is-awake" : ""}`} aria-hidden="true">
        {Array.from({ length: 18 }, (_, index) => (
          <span key={index} style={{ "--i": index } as React.CSSProperties}>
            moon://thread
          </span>
        ))}
      </div>
      <div className="ocean-windows">
        {["guestbook.html", "brb_forever.txt", "empty-mall.gif", "profile-final-real"].map((url, index) => (
              <FakeBrowserWindow key={url} url={`moon-archive://${url}`}>
            <button
              type="button"
              onClick={() => {
                if (index === 1) {
                  openInsideView("bottle-message-world", "moon-archive://brb_forever.txt");
                } else {
                  setSeraphLine("The window shimmered and released a wet bookmark.");
                }
              }}
            >
              {index === 1 ? "OPEN BOTTLE MESSAGE" : "PULL WINDOW CLOSER"}
            </button>
          </FakeBrowserWindow>
        ))}
      </div>
      <button
        type="button"
        className="message-bottle"
        onClick={() => {
          openInsideView("bottle-message-world", "BOTTLE MESSAGE ROOM");
          audioMoodEngine.blip("ghost");
        }}
      >
        <span />
        BOTTLE MESSAGE ROOM
      </button>
      <div className="link-jellyfish" aria-hidden="true">
        {Array.from({ length: 9 }, (_, index) => (
          <span key={index} style={{ "--i": index } as React.CSSProperties}>
            &lt;a href="#"&gt;
          </span>
        ))}
      </div>
      <div className="world-actions">
        <OldWebButton onClick={() => offerObject(portalOfferings[2])}>KEEP CLOUD SERVER WING</OldWebButton>
        <OldWebButton onClick={() => startTransition("angel-server-cathedral", "clock-bloom")}>FOLLOW WHITE CABLE</OldWebButton>
      </div>
    </div>
  );
}
