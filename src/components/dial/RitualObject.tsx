"use client";

import { useRef, useState } from "react";
import type { HauntedObject } from "@/data/worlds";
import { useRitualStore } from "@/store/useRitualStore";
import { useRuntimeStore } from "@/store/useRuntimeStore";
import { useWorldStore } from "@/store/useWorldStore";
import { audioMoodEngine } from "@/systems/audioMoodEngine";
import { resolveInsideView } from "@/systems/objectInsideViewSystem";
import { distance, inverseSquareAttraction } from "@/systems/physicsMath";

type RitualObjectProps = {
  object: HauntedObject;
  index: number;
};

export default function RitualObject({ object, index }: RitualObjectProps) {
  const dragStart = useRef({ x: 0, y: 0 });
  const lastPoint = useRef({ x: 0, y: 0 });
  const movedDuringDrag = useRef(false);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const setDraggedObject = useRitualStore((state) => state.setDraggedObject);
  const setHoverLine = useRitualStore((state) => state.setHoverLine);
  const startRitual = useRuntimeStore((state) => state.startRitual);
  const finishRitual = useRuntimeStore((state) => state.finishRitual);
  const setObjectState = useRuntimeStore((state) => state.setObjectState);
  const openInsideView = useRuntimeStore((state) => state.openInsideView);
  const portalPullStrength = useRuntimeStore((state) => state.portalPullStrength);
  const offerObject = useWorldStore((state) => state.offerObject);
  const trackInteraction = useWorldStore((state) => state.trackInteraction);

  const insideViewId = resolveInsideView(object);

  function portalPoint() {
    if (typeof window === "undefined") return { x: 0, y: 0 };
    return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  }

  return (
    <button
      type="button"
      className={`ritual-object ritual-object--${object.kind} ${dragging ? "is-dragging" : ""}`}
      draggable={object.draggable}
      onDragStart={(event) => {
        setDraggedObject(object);
        movedDuringDrag.current = false;
        event.dataTransfer.setData("text/plain", object.id);
        audioMoodEngine.blip("portal");
      }}
      onDragEnd={() => {
        setDraggedObject(undefined);
        finishRitual();
      }}
      onPointerDown={(event) => {
        if (!object.draggable) return;
        setDragging(true);
        startRitual("object-drag");
        setDraggedObject(object);
        dragStart.current = { x: event.clientX - position.x, y: event.clientY - position.y };
        lastPoint.current = { x: event.clientX, y: event.clientY };
        event.currentTarget.setPointerCapture(event.pointerId);
        audioMoodEngine.blip(object.audioCue === "popup-blip" ? "error" : "portal");
      }}
      onPointerMove={(event) => {
        if (!dragging) return;
        const next = {
          x: event.clientX - dragStart.current.x,
          y: event.clientY - dragStart.current.y,
        };
        const nextVelocity = {
          x: event.clientX - lastPoint.current.x,
          y: event.clientY - lastPoint.current.y,
        };
        movedDuringDrag.current = true;
        const attraction = inverseSquareAttraction({ x: event.clientX, y: event.clientY }, portalPoint(), 1 + portalPullStrength * 2.2, 70, 740);
        setPosition({
          x: next.x + attraction.x * 110,
          y: next.y + attraction.y * 110,
        });
        setVelocity(nextVelocity);
        setObjectState(object.id, {
          x: next.x,
          y: next.y,
          velocityX: nextVelocity.x,
          velocityY: nextVelocity.y,
          wobble: Math.min(1, Math.hypot(nextVelocity.x, nextVelocity.y) / 30),
          portalForce: attraction.force,
          dragging: true,
          decayState: object.decayState ?? 0,
          insideViewId,
        });
        lastPoint.current = { x: event.clientX, y: event.clientY };
      }}
      onPointerUp={(event) => {
        if (!dragging) return;
        setDragging(false);
        event.currentTarget.releasePointerCapture(event.pointerId);
        setDraggedObject(undefined);
        finishRitual();
        setObjectState(object.id, {
          velocityX: velocity.x * 0.78,
          velocityY: velocity.y * 0.78,
          dragging: false,
        });

        const nearPortal = distance({ x: event.clientX, y: event.clientY }, portalPoint()) < 132;
        if (nearPortal && object.feedable !== false) {
          offerObject(object);
          audioMoodEngine.blip("portal");
        }
      }}
      onMouseEnter={() => setHoverLine(object.hoverLine ?? "THIS OBJECT IS LISTENING")}
      onClick={() => {
        if (movedDuringDrag.current) {
          movedDuringDrag.current = false;
          return;
        }
        trackInteraction("clicks");
        if (insideViewId) {
          openInsideView(insideViewId, object.label ?? object.id);
          audioMoodEngine.blip("portal");
        } else if (object.portalChance > 0.9) {
          offerObject(object);
        } else {
          setHoverLine(object.hoverLine ?? "WRONG CLICK ACCEPTED");
          audioMoodEngine.blip("error");
        }
      }}
      style={
        {
          "--i": index,
          "--drag-x": `${position.x}px`,
          "--drag-y": `${position.y}px`,
          "--object-wobble": Math.min(1, Math.hypot(velocity.x, velocity.y) / 32),
        } as React.CSSProperties
      }
      title={object.hoverLine}
    >
      <span>{object.label}</span>
    </button>
  );
}
