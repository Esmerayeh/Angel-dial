"use client";

import { AnimatePresence, motion } from "framer-motion";
import { getInsideViewDefinition } from "@/systems/objectInsideViewSystem";
import { useRuntimeStore } from "@/store/useRuntimeStore";
import { useWorldStore } from "@/store/useWorldStore";
import CDTrayCity from "./CDTrayCity";
import PopupInterior from "./PopupInterior";
import GhostInterior from "./GhostInterior";
import ClockworkInterior from "./ClockworkInterior";
import BottleMessageWorld from "./BottleMessageWorld";

export default function ObjectInsideView() {
  const insideView = useRuntimeStore((state) => state.activeInsideView);
  const source = useRuntimeStore((state) => state.insideViewSource);
  const closeInsideView = useRuntimeStore((state) => state.closeInsideView);
  const setSeraphLine = useWorldStore((state) => state.setSeraphLine);

  function close() {
    if (insideView) {
      setSeraphLine(getInsideViewDefinition(insideView).returnLine);
    }
    closeInsideView();
  }

  return (
    <AnimatePresence>
      {insideView ? (
        <motion.section
          className="inside-view"
          data-inside-view={insideView}
          initial={{ opacity: 0, scale: 0.18, rotate: -18, filter: "blur(18px)" }}
          animate={{ opacity: 1, scale: 1, rotate: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 1.28, rotate: 12, filter: "blur(14px)" }}
          transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
          aria-label={getInsideViewDefinition(insideView).title}
        >
          <div className="inside-view__tunnel" aria-hidden="true" />
          <header className="inside-view__header">
            <button type="button" onClick={close}>
              Drift Back
            </button>
            <b>{getInsideViewDefinition(insideView).title}</b>
            <code>{source ?? "inside://unknown"}</code>
          </header>
          {insideView === "cd-tray-city" ? <CDTrayCity /> : null}
          {insideView === "popup-interior" ? <PopupInterior /> : null}
          {insideView === "ghost-interior" ? <GhostInterior /> : null}
          {insideView === "clockwork-interior" ? <ClockworkInterior /> : null}
          {insideView === "bottle-message-world" ? <BottleMessageWorld /> : null}
        </motion.section>
      ) : null}
    </AnimatePresence>
  );
}
