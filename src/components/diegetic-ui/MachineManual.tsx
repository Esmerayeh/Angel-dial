"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import WorldChart from "./WorldChart";

type ManualTab = "controls" | "rooms" | "inside" | "transitions";

type MachineManualProps = {
  open: boolean;
  muted: boolean;
  reducedMotion: boolean;
  onClose: () => void;
  onToggleMuted: () => void;
  onToggleReducedMotion: () => void;
};

const tabs: Array<{ id: ManualTab; label: string }> = [
  { id: "controls", label: "Controls" },
  { id: "rooms", label: "12 Rooms" },
  { id: "inside", label: "Inside Worlds" },
  { id: "transitions", label: "Transitions" },
];

const controls = [
  ["Rotate the Dial", "Drag the golden hand. The nearest room glows before release."],
  ["Pull the Ghost", "Stretch a silk veil until it becomes a soft doorway."],
  ["Tune the Radio", "Rotate the glass knob and listen for hidden whisper signals."],
  ["Use the Chain", "Pull downward to drift through circular passing-floor windows."],
  ["Open Objects", "Drag or hold curious relics until the camera enters their inside."],
  ["Leave a Relic", "Feed the Reliquary Wall a note, charm, flower, or keepsake."],
];

const insideWorlds = [
  ["CD Tray City", "A tiny dream town inside a pearl music disc."],
  ["Bottle Message Room", "Moon-water, floating paper, letters from the deep."],
  ["Clockwork Interior", "Soft gold gears, workers, bells, and hidden keys."],
  ["Popup Interior", "Pink and lilac panels arranged like gentle warnings."],
  ["Ghost Interior", "Fabric corridors, moths, and doors behind the veil."],
  ["Tiny Website Shrine", "An old page rebuilt as a tender little altar."],
];

const transitionList = [
  ["Clock Bloom", "Rings expand like petals and the room appears from pearl mist."],
  ["Water Ripple", "The clock face becomes moon water and the hand bends in reflection."],
  ["Silk Veil", "A translucent ghost stretches across the world, then opens."],
  ["Radio Wave", "Circular signals unfold the Whisper Room from soft static."],
  ["Object Entry", "An object grows toward the camera and becomes a tiny world."],
  ["Elevator Drift", "Round floor windows pass slowly while the chain breathes."],
];

export default function MachineManual({
  open,
  muted,
  reducedMotion,
  onClose,
  onToggleMuted,
  onToggleReducedMotion,
}: MachineManualProps) {
  const [tab, setTab] = useState<ManualTab>("controls");

  return (
    <AnimatePresence>
      {open ? (
        <motion.aside
          className="machine-manual"
          role="dialog"
          aria-modal="true"
          aria-label="Angel Dial manual"
          initial={{ opacity: 0, scale: 0.96, y: 18, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.98, y: 20, filter: "blur(10px)" }}
          transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="machine-manual__aura" aria-hidden="true" />
          <header className="machine-manual__header">
            <div>
              <p>ANGEL DIAL</p>
              <h2>Manual / Controls</h2>
              <span>Turn, pull, tune, open, leave, and listen.</span>
            </div>
            <button type="button" onClick={onClose} aria-label="Close manual">
              Close
            </button>
          </header>

          <nav className="machine-manual__tabs" aria-label="Manual tabs">
            {tabs.map((item) => (
              <button
                key={item.id}
                type="button"
                className={tab === item.id ? "is-active" : ""}
                onClick={() => setTab(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {tab === "controls" ? (
            <div className="machine-manual__controls">
              <section className="machine-manual__quick">
                <h3>Machine State</h3>
                <button type="button" onClick={onToggleMuted}>
                  Sound: {muted ? "Off" : "On"}
                </button>
                <button type="button" onClick={onToggleReducedMotion}>
                  Calm Mode: {reducedMotion ? "On" : "Off"}
                </button>
                <p>Press H for this manual. Press Esc to close it.</p>
              </section>
              <section className="machine-manual__guide">
                {controls.map(([name, text]) => (
                  <article key={name}>
                    <span aria-hidden="true" />
                    <h3>{name}</h3>
                    <p>{text}</p>
                  </article>
                ))}
              </section>
            </div>
          ) : null}

          {tab === "rooms" ? <WorldChart /> : null}

          {tab === "inside" ? (
            <div className="machine-manual__tiles">
              {insideWorlds.map(([name, text]) => (
                <article key={name}>
                  <span aria-hidden="true" />
                  <h3>{name}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          ) : null}

          {tab === "transitions" ? (
            <div className="machine-manual__tiles machine-manual__tiles--wide">
              {transitionList.map(([name, text]) => (
                <article key={name}>
                  <span aria-hidden="true" />
                  <h3>{name}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          ) : null}
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
