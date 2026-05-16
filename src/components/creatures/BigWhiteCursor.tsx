"use client";

import { useCreatureStore } from "@/store/useCreatureStore";
import { useWorldStore } from "@/store/useWorldStore";

export default function BigWhiteCursor() {
  const visible = useCreatureStore((state) => state.bigCursorVisible);
  const hideBigCursor = useCreatureStore((state) => state.hideBigCursor);
  const startTransition = useWorldStore((state) => state.startTransition);

  if (!visible) {
    return null;
  }

  return (
    <button
      className="big-white-cursor"
      type="button"
      onClick={() => {
        startTransition("floor-null", "spiral-descent");
        hideBigCursor();
      }}
      aria-label="Big White Cursor"
    />
  );
}
