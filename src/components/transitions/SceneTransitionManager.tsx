"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { getWorld } from "@/data/worlds";
import { useRuntimeStore } from "@/store/useRuntimeStore";
import { useWorldStore } from "@/store/useWorldStore";
import ClockBloomTransition from "./ClockBloomTransition";
import SpiralDescentTransition from "./SpiralDescentTransition";
import OrreryShiftTransition from "./OrreryShiftTransition";
import LiquidGlassWarpTransition from "./LiquidGlassWarpTransition";
import MechanicalSwallowTransition from "./MechanicalSwallowTransition";
import GhostVeilTransition from "./GhostVeilTransition";
import ElevatorClimbTransition from "./ElevatorClimbTransition";

const phaseLines = [
  "ANTICIPATION: creatures freeze, particles pull inward",
  "TRANSFORMATION: the rings open their chrome mouths",
  "TRAVEL: the browser becomes a tunnel",
  "ARRIVAL: one small clue lands near the cursor",
];

export default function SceneTransitionManager() {
  const isTransitioning = useWorldStore((state) => state.isTransitioning);
  const transitionType = useWorldStore((state) => state.activeTransitionType);
  const currentWorld = useWorldStore((state) => state.currentWorld);
  const finishTransition = useWorldStore((state) => state.finishTransition);
  const phase = useRuntimeStore((state) => state.transitionPhase);
  const progress = useRuntimeStore((state) => state.transitionProgress);

  useEffect(() => {
    if (!isTransitioning) {
      return;
    }

    const timeout = window.setTimeout(() => {
      finishTransition();
    }, 2350);

    return () => window.clearTimeout(timeout);
  }, [finishTransition, isTransitioning, transitionType, currentWorld]);

  const transition = {
    "clock-bloom": <ClockBloomTransition />,
    "spiral-descent": <SpiralDescentTransition />,
    "orrery-shift": <OrreryShiftTransition />,
    "liquid-glass-warp": <LiquidGlassWarpTransition />,
    "mechanical-swallow": <MechanicalSwallowTransition />,
    "ghost-veil": <GhostVeilTransition />,
    "elevator-climb": <ElevatorClimbTransition />,
  }[transitionType];

  return (
    <AnimatePresence>
      {isTransitioning ? (
        <motion.div
          className="scene-transition-manager"
          data-phase={phase}
          style={{ "--transition-progress": progress } as React.CSSProperties}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
        >
          {transition}
          <motion.div
            className="transition-copy"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.18, duration: 0.5 }}
          >
            <b>{getWorld(currentWorld).name}</b>
            {phaseLines.map((line, index) => (
              <span key={line} style={{ "--i": index } as React.CSSProperties}>
                {line}
              </span>
            ))}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
