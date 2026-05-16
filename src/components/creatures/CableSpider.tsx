"use client";

import type { CreatureSeed } from "@/data/creatures";

export default function CableSpider({ creature, onNotice }: { creature: CreatureSeed; onNotice: (line: string) => void }) {
  return (
    <button
      type="button"
      className="creature creature--cable-spider"
      style={{ "--orbit": creature.orbit, "--speed": `${creature.speed}s` } as React.CSSProperties}
      onClick={() => onNotice(creature.line)}
      title={creature.line}
    >
      <span />
      <span />
      <span />
    </button>
  );
}
