"use client";

import type { CreatureSeed } from "@/data/creatures";

export default function FloppyBird({ creature, onNotice }: { creature: CreatureSeed; onNotice: (line: string) => void }) {
  return (
    <button
      type="button"
      className="creature creature--floppy-bird"
      style={{ "--orbit": creature.orbit, "--speed": `${creature.speed}s` } as React.CSSProperties}
      onClick={() => onNotice(creature.line)}
      title={creature.line}
    >
      <span />
      <i>1.44</i>
    </button>
  );
}
