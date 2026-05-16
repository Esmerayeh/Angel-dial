"use client";

import { useEffect, useRef, useState } from "react";
import { clockRooms, type WorldId } from "@/data/worlds";
import { useRuntimeStore } from "@/store/useRuntimeStore";
import { useWorldStore } from "@/store/useWorldStore";
import { audioMoodEngine } from "@/systems/audioMoodEngine";
import { angleFromPointer, clamp, normalizeAngle, shortestAngleDelta, springTo } from "@/systems/physicsMath";
import { shouldUnlockFloorNull } from "@/systems/secretTriggerSystem";

type ClockHandProps = {
  onWorldGesture: (world: WorldId) => void;
};

const SEGMENT_SIZE = 360 / 12;

function roomFromAngle(angle: number) {
  const index = Math.round(normalizeAngle(angle) / SEGMENT_SIZE) % clockRooms.length;
  return clockRooms[index] ?? clockRooms[0];
}

function snapToRoomAngle(angle: number) {
  return roomFromAngle(angle).index * SEGMENT_SIZE;
}

export default function ClockHand({ onWorldGesture }: ClockHandProps) {
  const handRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>();
  const settleRef = useRef<number>();
  const targetAngle = useRef(0);
  const visualAngle = useRef(0);
  const visualVelocity = useRef(0);
  const trailAngle = useRef(0);
  const trailVelocity = useRef(0);
  const lastMoveAngle = useRef(0);
  const lastMoveAt = useRef(0);
  const [dragging, setDragging] = useState(false);
  const [settling, setSettling] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(roomFromAngle(0));
  const [renderAngles, setRenderAngles] = useState({ visual: 0, trail: 0 });
  const rotation = useWorldStore((state) => state.clockRotation);
  const startRitual = useRuntimeStore((state) => state.startRitual);
  const finishRitual = useRuntimeStore((state) => state.finishRitual);
  const updateInstrument = useRuntimeStore((state) => state.updateInstrument);
  const setClockRotation = useWorldStore((state) => state.setClockRotation);
  const setMinuteIntensity = useWorldStore((state) => state.setMinuteIntensity);
  const addSecret = useWorldStore((state) => state.addSecret);
  const ghostPull = useWorldStore((state) => state.interactionStats.pulls);
  const trackInteraction = useWorldStore((state) => state.trackInteraction);

  useEffect(() => {
    if (!dragging && !settling) {
      targetAngle.current = rotation;
      visualAngle.current = rotation;
      trailAngle.current = rotation;
      setRenderAngles({ visual: rotation, trail: rotation });
    }
  }, [dragging, rotation, settling]);

  useEffect(() => {
    let previous = performance.now();

    const tick = (now: number) => {
      const delta = Math.min(1 / 24, Math.max(1 / 120, (now - previous) / 1000));
      previous = now;
      const visualTarget = visualAngle.current + shortestAngleDelta(visualAngle.current, targetAngle.current);
      const visualSpring = springTo(visualAngle.current, visualTarget, visualVelocity.current, dragging ? 0.22 : 0.14, 0.72, delta);
      visualAngle.current = normalizeAngle(visualSpring.value);
      visualVelocity.current = visualSpring.velocity;
      const trailTarget = trailAngle.current + shortestAngleDelta(trailAngle.current, visualAngle.current);
      const trailSpring = springTo(trailAngle.current, trailTarget, trailVelocity.current, 0.075, 0.8, delta);
      trailAngle.current = normalizeAngle(trailSpring.value);
      trailVelocity.current = trailSpring.velocity;
      const force = clamp(Math.abs(visualVelocity.current) / 28);

      setRenderAngles({ visual: visualAngle.current, trail: trailAngle.current });
      setClockRotation(visualAngle.current);
      setMinuteIntensity(normalizeAngle(visualAngle.current) / 360);
      updateInstrument("angel-dial-clock", {
        id: "angel-dial-clock",
        angle: visualAngle.current,
        velocity: visualVelocity.current,
        tension: 0,
        dragging,
        intensity: force,
        audioValue: clamp(force * 0.65 + normalizeAngle(visualAngle.current) / 360 * 0.35),
        visualValue: clamp(force + (dragging ? 0.28 : 0.08)),
        portalOutcome: selectedRoom.id,
      });

      frameRef.current = window.requestAnimationFrame(tick);
    };

    frameRef.current = window.requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
      if (settleRef.current) {
        window.clearTimeout(settleRef.current);
      }
    };
  }, [dragging, selectedRoom.id, setClockRotation, setMinuteIntensity, updateInstrument]);

  function updateFromPointer(event: React.PointerEvent<HTMLDivElement>) {
    if (!handRef.current) {
      return;
    }

    const nextAngle = angleFromPointer({ x: event.clientX, y: event.clientY }, handRef.current.getBoundingClientRect());
    const now = performance.now();
    const elapsed = Math.max(16, now - lastMoveAt.current);
    const velocity = shortestAngleDelta(lastMoveAngle.current, nextAngle) / (elapsed / 16);
    const room = roomFromAngle(nextAngle);
    lastMoveAngle.current = nextAngle;
    lastMoveAt.current = now;
    targetAngle.current = nextAngle;
    setSelectedRoom(room);
    setMinuteIntensity(normalizeAngle(nextAngle) / 360);
    updateInstrument("angel-dial-clock", {
      id: "angel-dial-clock",
      angle: nextAngle,
      velocity,
      tension: 0,
      dragging: true,
      intensity: clamp(Math.abs(velocity) / 36),
      audioValue: clamp(Math.abs(velocity) / 58 + normalizeAngle(nextAngle) / 360 * 0.5),
      visualValue: clamp(0.35 + Math.abs(velocity) / 42),
      portalOutcome: room.id,
    });

    if (shouldUnlockFloorNull(nextAngle, ghostPull)) {
      addSecret("quiet-floor-glimpse");
    }
  }

  function releaseHand(event: React.PointerEvent<HTMLDivElement>) {
    setDragging(false);
    setSettling(true);
    event.currentTarget.releasePointerCapture(event.pointerId);
    const snapped = snapToRoomAngle(targetAngle.current);
    const room = roomFromAngle(snapped);
    targetAngle.current = snapped;
    setSelectedRoom(room);
    trackInteraction("rotations");
    audioMoodEngine.blip("portal");

    if (settleRef.current) {
      window.clearTimeout(settleRef.current);
    }

    settleRef.current = window.setTimeout(() => {
      setSettling(false);
      finishRitual();
      onWorldGesture(room.id);
    }, 640);
  }

  return (
    <div
      ref={handRef}
      className={`clock-hand-instrument ${dragging ? "is-dragging" : ""} ${settling ? "is-settling" : ""}`}
      style={
        {
          "--clock-rotation": `${renderAngles.visual}deg`,
          "--clock-trail-rotation": `${renderAngles.trail}deg`,
          "--clock-force": dragging ? 1 : settling ? 0.62 : 0.18,
          "--selected-room": selectedRoom.index,
        } as React.CSSProperties
      }
      role="slider"
      tabIndex={0}
      aria-label={`Rotate the celestial clock hand. Selected room: ${selectedRoom.name}`}
      aria-valuemin={0}
      aria-valuemax={11}
      aria-valuenow={selectedRoom.index}
      onPointerDown={(event) => {
        setDragging(true);
        setSettling(false);
        startRitual("clock-rotation");
        event.currentTarget.setPointerCapture(event.pointerId);
        lastMoveAngle.current = targetAngle.current;
        lastMoveAt.current = performance.now();
        updateFromPointer(event);
        audioMoodEngine.blip("portal");
      }}
      onPointerMove={(event) => {
        if (dragging) {
          updateFromPointer(event);
        }
      }}
      onPointerUp={releaseHand}
      onPointerCancel={(event) => {
        if (dragging) {
          releaseHand(event);
        }
      }}
      onKeyDown={(event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
          return;
        }
        event.preventDefault();
        startRitual("clock-rotation");
        const direction = event.key === "ArrowRight" ? 1 : -1;
        const next = normalizeAngle(targetAngle.current + direction * SEGMENT_SIZE);
        targetAngle.current = next;
        const room = roomFromAngle(next);
        setSelectedRoom(room);
        window.setTimeout(() => {
          finishRitual();
          onWorldGesture(room.id);
        }, 640);
      }}
    >
      <span className="clock-hand__ripple" aria-hidden="true" />
      <span className="clock-hand__selected-string" aria-hidden="true" />
      <span className="clock-hand__trail" aria-hidden="true">
        <svg viewBox="-34 -330 68 660" role="presentation">
          <path d="M0,-302 C10,-214 10,-110 0,-8 C-10,-110 -10,-214 0,-302Z" />
        </svg>
      </span>
      <span className="clock-hand__main" aria-hidden="true">
        <svg viewBox="-46 -360 92 720" role="presentation">
          <defs>
            <linearGradient id="angelHandGold" x1="0" x2="1">
              <stop offset="0" stopColor="#f8e7b8" />
              <stop offset="0.48" stopColor="#d6ad63" />
              <stop offset="1" stopColor="#fffaf2" />
            </linearGradient>
            <radialGradient id="angelHandJewel">
              <stop offset="0" stopColor="#fffdf7" />
              <stop offset="0.42" stopColor="#bddcf4" />
              <stop offset="1" stopColor="#d8ccff" />
            </radialGradient>
          </defs>
          <path className="clock-hand__spire" d="M0,-334 L18,-292 L8,-284 L8,-36 L0,-18 L-8,-36 L-8,-284 L-18,-292Z" />
          <path className="clock-hand__tail" d="M0,32 C18,84 15,154 0,228 C-15,154 -18,84 0,32Z" />
          <path className="clock-hand__filigree" d="M0,-244 C26,-210 24,-164 0,-136 C-24,-164 -26,-210 0,-244Z" />
          <path className="clock-hand__filigree" d="M0,76 C24,104 22,150 0,178 C-22,150 -24,104 0,76Z" />
          <circle className="clock-hand__bead" cx="0" cy="-198" r="7" />
          <circle className="clock-hand__bead" cx="0" cy="-116" r="5" />
          <circle className="clock-hand__bead" cx="0" cy="118" r="6" />
          <circle className="clock-hand__jewel" cx="0" cy="0" r="26" />
          <circle className="clock-hand__jewel-ring" cx="0" cy="0" r="34" />
        </svg>
      </span>
      <span className="clock-hand__room-label">{selectedRoom.name}</span>
    </div>
  );
}
