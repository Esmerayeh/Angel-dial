"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import RuntimeController from "@/components/RuntimeController";
import CreatureSystem from "@/components/creatures/CreatureSystem";
import ArtifactPrompt from "@/components/diegetic-ui/ArtifactPrompt";
import MachineManual from "@/components/diegetic-ui/MachineManual";
import CRTEffect from "@/components/effects/CRTEffect";
import EdgeHauntLayer from "@/components/effects/EdgeHauntLayer";
import FogLayer from "@/components/effects/FogLayer";
import GlitchLayer from "@/components/effects/GlitchLayer";
import ParticleField from "@/components/effects/ParticleField";
import RainLayer from "@/components/effects/RainLayer";
import VHSNoise from "@/components/effects/VHSNoise";
import SceneTransitionManager from "@/components/transitions/SceneTransitionManager";
import AngelDialWorld from "@/components/worlds/AngelDialWorld";
import AngelServerWorld from "@/components/worlds/AngelServerWorld";
import ArchiveOceanWorld from "@/components/worlds/ArchiveOceanWorld";
import BlackDesktopWorld from "@/components/worlds/BlackDesktopWorld";
import CyberGothMallWorld from "@/components/worlds/CyberGothMallWorld";
import FloorNullWorld from "@/components/worlds/FloorNullWorld";
import ForgottenOrreryWorld from "@/components/worlds/ForgottenOrreryWorld";
import GifConservatoryWorld from "@/components/worlds/GifConservatoryWorld";
import LoginChapelWorld from "@/components/worlds/LoginChapelWorld";
import MalwareChapelWorld from "@/components/worlds/MalwareChapelWorld";
import MemoryHospitalWorld from "@/components/worlds/MemoryHospitalWorld";
import RedChatroomsWorld from "@/components/worlds/RedChatroomsWorld";
import RotWallWorld from "@/components/worlds/RotWallWorld";
import ObjectInsideView from "@/components/inside-views/ObjectInsideView";
import type { WorldId } from "@/data/worlds";
import { getWorld } from "@/data/worlds";
import { useArtifactStore } from "@/store/useArtifactStore";
import { useAudioStore } from "@/store/useAudioStore";
import { useCreatureStore } from "@/store/useCreatureStore";
import { useRotWallStore } from "@/store/useRotWallStore";
import { useRuntimeStore } from "@/store/useRuntimeStore";
import { useWorldStore } from "@/store/useWorldStore";
import { audioMoodEngine } from "@/systems/audioMoodEngine";
import { spawnFloatingJunk } from "@/systems/floatingJunkSpawner";

function WorldRenderer({ world }: { world: WorldId }) {
  if (world === "cyber-goth-mall") return <CyberGothMallWorld />;
  if (world === "archive-ocean") return <ArchiveOceanWorld />;
  if (world === "angel-server-cathedral") return <AngelServerWorld />;
  if (world === "forgotten-orrery") return <ForgottenOrreryWorld />;
  if (world === "memory-hospital") return <MemoryHospitalWorld />;
  if (world === "rot-wall") return <RotWallWorld />;
  if (world === "floor-null") return <FloorNullWorld />;
  if (world === "login-chapel") return <LoginChapelWorld />;
  if (world === "malware-chapel") return <MalwareChapelWorld />;
  if (world === "black-desktop") return <BlackDesktopWorld />;
  if (world === "gif-conservatory") return <GifConservatoryWorld />;
  if (world === "red-chatrooms") return <RedChatroomsWorld />;
  return <AngelDialWorld />;
}

export default function AngelMachineExperience() {
  const [entered, setEntered] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [readable, setReadable] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const currentWorld = useWorldStore((state) => state.currentWorld);
  const currentMood = useWorldStore((state) => state.currentMood);
  const currentEra = useWorldStore((state) => state.currentEra);
  const visitorAlias = useWorldStore((state) => state.visitorAlias);
  const dailySeed = useWorldStore((state) => state.dailyMutationSeed);
  const line = useWorldStore((state) => state.lastSeraphLine);
  const initializeVisitor = useWorldStore((state) => state.initializeVisitor);
  const returnToDial = useWorldStore((state) => state.returnToDial);
  const setSeraphLine = useWorldStore((state) => state.setSeraphLine);
  const trackInteraction = useWorldStore((state) => state.trackInteraction);
  const initializeArtifacts = useArtifactStore((state) => state.initializeArtifacts);
  const initializeRotWall = useRotWallStore((state) => state.initializeRotWall);
  const regenerateCreatures = useCreatureStore((state) => state.regenerate);
  const transitionPhase = useRuntimeStore((state) => state.transitionPhase);
  const activeRitual = useRuntimeStore((state) => state.activeRitual);
  const muted = useAudioStore((state) => state.muted);
  const toggleMuted = useAudioStore((state) => state.toggleMuted);
  const enableAudio = useAudioStore((state) => state.enableAudio);
  const setActiveWorld = useAudioStore((state) => state.setActiveWorld);
  const intensity = useWorldStore((state) => state.audioIntensity);
  const junk = useMemo(() => spawnFloatingJunk(dailySeed, 58), [dailySeed]);
  const world = getWorld(currentWorld);

  useEffect(() => {
    initializeVisitor();
    initializeArtifacts();
    initializeRotWall();
    regenerateCreatures(dailySeed, 32);
  }, [dailySeed, initializeArtifacts, initializeRotWall, initializeVisitor, regenerateCreatures]);

  useEffect(() => {
    setActiveWorld(currentWorld);
    audioMoodEngine.update(currentWorld, currentMood, intensity);
  }, [currentMood, currentWorld, intensity, setActiveWorld]);

  useEffect(() => {
    audioMoodEngine.setMuted(muted || !entered);
  }, [entered, muted]);

  useEffect(() => {
    document.documentElement.style.setProperty("--manual-open", manualOpen ? "1" : "0");
  }, [manualOpen]);

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "h") {
        setManualOpen((value) => !value);
      }
      if (event.key === "Escape") {
        setManualOpen(false);
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  function enterMachine() {
    setEntered(true);
    enableAudio();
    void audioMoodEngine.start().then(() => {
      audioMoodEngine.setMuted(muted);
      audioMoodEngine.update(currentWorld, currentMood, intensity);
      audioMoodEngine.blip("portal");
    });
  }

  return (
    <main
      className={`machine-shell ${entered ? "is-entered" : ""} ${readable ? "is-readable" : ""} ${
        reducedMotion ? "is-reduced-motion" : ""
      } ${manualOpen ? "is-manual-open" : ""}`}
      data-world={currentWorld}
      data-mood={currentMood}
      data-era={currentEra}
    >
      <RuntimeController />
      <ParticleField />
      <FogLayer />
      <RainLayer />
      <VHSNoise />
      <GlitchLayer />
      <EdgeHauntLayer />
      <div className="floating-junk" aria-hidden="true">
        {junk.map((item) => (
          <button
            key={item.id}
            type="button"
            style={
              {
                "--x": `${item.x}%`,
                "--y": `${item.y}%`,
                "--size": `${item.size}px`,
                "--delay": `${item.delay}s`,
                "--spin": item.spin,
              } as React.CSSProperties
            }
            onClick={() => {
              trackInteraction("wrongClicks");
              setSeraphLine(`${item.label} chimed once and drifted behind the dial.`);
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      <CreatureSystem />
      <header className="dream-titlebar" aria-label="Angel Dial title">
        <p>ANGEL DIAL <span aria-hidden="true">✦</span></p>
        <h1>A soft haunted internet instrument</h1>
        <small>Turn the hand to begin</small>
      </header>
      <section className="world-stage" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentWorld}
            className="world-stage__scene"
            initial={{ opacity: 0, scale: 0.96, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 1.06, rotate: 2 }}
            transition={{ duration: reducedMotion ? 0.01 : 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            <WorldRenderer world={currentWorld} />
          </motion.div>
        </AnimatePresence>
      </section>
      <ObjectInsideView />
      <aside className="seraph-console" aria-label="SERAPH-404 behavior oracle">
        <b>SERAPH-404</b>
        <p>{line}</p>
        <code>{world.name}</code>
      </aside>
      <button
        type="button"
        className="dream-sound-control"
        onClick={() => {
          if (!entered) {
            enterMachine();
            return;
          }
          toggleMuted();
        }}
      >
        <span aria-hidden="true">♪</span> Sound: {muted ? "Off" : "On"}
      </button>
      <button type="button" className="dream-manual-button" onClick={() => setManualOpen(true)}>
        <span aria-hidden="true">?</span> Manual
      </button>
      <button
        type="button"
        className="dream-enter-button"
        onClick={() => {
          if (!entered) {
            enterMachine();
            return;
          }
          returnToDial();
        }}
      >
        {entered ? "Return to Dial" : "Enter the Machine"}
        <small>{visitorAlias}</small>
      </button>
      <p className="dream-footer">The hand sings when you move it. Drag to tune. Explore. Listen.</p>
      <ArtifactPrompt />
      <MachineManual
        open={manualOpen}
        muted={muted}
        reducedMotion={reducedMotion}
        onClose={() => setManualOpen(false)}
        onToggleMuted={() => {
          if (!entered) {
            enterMachine();
            return;
          }
          toggleMuted();
        }}
        onToggleReducedMotion={() => setReducedMotion((value) => !value)}
      />
      <SceneTransitionManager />
      <CRTEffect />
      <div className="runtime-readout" aria-hidden="true">
        <span>{transitionPhase}</span>
        <span>{activeRitual ?? "idle"}</span>
      </div>
    </main>
  );
}
