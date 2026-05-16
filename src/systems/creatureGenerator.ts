import { creatureCatalog, type CreatureKind, type CreatureSeed } from "@/data/creatures";

const kinds = Object.keys(creatureCatalog) as CreatureKind[];

function seededRandom(seed: number) {
  let state = seed % 2147483647;
  if (state <= 0) {
    state += 2147483646;
  }

  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

export function generateCreatures(seed: number, count = 24): CreatureSeed[] {
  const random = seededRandom(seed + 404);

  return Array.from({ length: count }, (_, index) => {
    const kind = kinds[Math.floor(random() * kinds.length)];
    const lines = creatureCatalog[kind];

    return {
      id: `${kind}-${seed}-${index}`,
      kind,
      label: kind.replaceAll("-", " ").toUpperCase(),
      mood: ["haunted", "playful", "cursed", "tender", "glitchy"][Math.floor(random() * 5)],
      orbit: 18 + random() * 78,
      speed: 12 + random() * 44,
      line: lines[Math.floor(random() * lines.length)],
    };
  });
}
