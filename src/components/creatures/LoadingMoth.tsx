"use client";

import type { CreatureSeed } from "@/data/creatures";

export default function LoadingMoth({ creature, onNotice }: { creature: CreatureSeed; onNotice: (line: string) => void }) {
  return (
    <button
      type="button"
      className="creature creature--loading-moth"
      style={{ "--orbit": creature.orbit, "--speed": `${creature.speed}s` } as React.CSSProperties}
      onClick={() => onNotice(creature.line)}
      title={creature.line}
    >
      <span />
      <span />
      <i />
    </button>
  );
}
