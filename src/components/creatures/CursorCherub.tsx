"use client";

import type { CreatureSeed } from "@/data/creatures";

export default function CursorCherub({ creature, onNotice }: { creature: CreatureSeed; onNotice: (line: string) => void }) {
  return (
    <button
      type="button"
      className="creature creature--cursor-cherub"
      style={{ "--orbit": creature.orbit, "--speed": `${creature.speed}s` } as React.CSSProperties}
      onClick={() => onNotice(creature.line)}
      title={creature.line}
    >
      <span className="creature__wings" />
      <span className="creature__cursor" />
    </button>
  );
}
