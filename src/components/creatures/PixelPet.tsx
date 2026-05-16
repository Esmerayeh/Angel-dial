"use client";

import type { CreatureSeed } from "@/data/creatures";

export default function PixelPet({ creature, onNotice }: { creature: CreatureSeed; onNotice: (line: string) => void }) {
  return (
    <button
      type="button"
      className="creature creature--pixel-pet"
      style={{ "--orbit": creature.orbit, "--speed": `${creature.speed}s` } as React.CSSProperties}
      onClick={() => onNotice(creature.line)}
      title={creature.line}
    >
      <span />
      <i>zZ</i>
    </button>
  );
}
