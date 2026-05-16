import type { AnonymousArtifact } from "@/store/useArtifactStore";
import type { RotWallRelic } from "@/store/useRotWallStore";
import { rotWallSeeds, type RotWallRelicSeed } from "@/data/rotWallSeeds";
import type { MoodId } from "@/data/worlds";
import { clamp } from "./physicsMath";

export const rotWallStorageKey = "angel-dial-rot-wall-relics";

function seededNumber(seed: string, salt: number) {
  let value = salt * 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    value ^= seed.charCodeAt(index);
    value = Math.imul(value, 16777619);
  }
  return Math.abs(value >>> 0) / 4294967295;
}

function relicFromSeed(seed: RotWallRelicSeed, index: number): RotWallRelic {
  const id = `seed-wall-${index}`;
  return {
    id,
    x: 8 + seededNumber(id, 2) * 84,
    y: 8 + seededNumber(id, 3) * 84,
    type: seed.type,
    content: seed.content,
    createdAt: new Date(Date.now() - (index + 4) * 86400000).toISOString(),
    decayLevel: clamp(0.08 + index * 0.045),
    mutationSeed: Math.floor(seededNumber(seed.content, 8) * 99999),
    portalChance: seededNumber(seed.content, 10) > 0.82 ? 0.92 : 0.26 + seededNumber(seed.content, 11) * 0.42,
    mood: seed.mood,
    discoveredCount: 0,
  };
}

export function createSeededRotWall() {
  return rotWallSeeds.map(relicFromSeed);
}

export function readLocalRotWallRelics(): RotWallRelic[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(rotWallStorageKey);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as RotWallRelic[];
  } catch {
    return [];
  }
}

export function writeLocalRotWallRelics(relics: RotWallRelic[]) {
  if (typeof window === "undefined") return;
  const localRelics = relics.filter((relic) => !relic.id.startsWith("seed-wall-")).slice(-80);
  window.localStorage.setItem(rotWallStorageKey, JSON.stringify(localRelics));
}

export function createRotWallRelicFromArtifact(artifact: AnonymousArtifact, mood: MoodId, count: number): RotWallRelic {
  const seed = `${artifact.text}-${artifact.createdAt}-${count}`;
  return {
    id: `reliquary-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    x: 6 + seededNumber(seed, 13) * 88,
    y: 8 + seededNumber(seed, 17) * 84,
    type: artifact.place.includes("bottle") ? "web-badge" : artifact.place.includes("cable") ? "pixel-sigil" : "note",
    content: artifact.text,
    createdAt: artifact.createdAt,
    decayLevel: 0,
    mutationSeed: Math.floor(seededNumber(seed, 19) * 99999),
    portalChance: 0.18 + seededNumber(seed, 23) * 0.72,
    mood,
    discoveredCount: 0,
  };
}

export function decayRelic(relic: RotWallRelic, now = Date.now()): RotWallRelic {
  const ageDays = Math.max(0, (now - new Date(relic.createdAt).getTime()) / 86400000);
  const decayLevel = clamp(relic.decayLevel + ageDays * 0.012);
  return {
    ...relic,
    decayLevel,
    x: clamp(relic.x + Math.sin((now / 1000 + relic.mutationSeed) * 0.02) * decayLevel * 0.06, 2, 96),
    y: clamp(relic.y + Math.cos((now / 1000 + relic.mutationSeed) * 0.018) * decayLevel * 0.05, 2, 96),
    portalChance: clamp(relic.portalChance + decayLevel * 0.08),
  };
}

export function corruptRelicText(text: string, decayLevel: number, seed: number) {
  if (decayLevel < 0.08) return text;
  const glyphs = ["·", "?", "o", "✦", "~", "petal", "moon"];
  return text
    .split("")
    .map((character, index) => {
      const shouldCorrupt = seededNumber(`${text}-${seed}`, index) < decayLevel * 0.16;
      return shouldCorrupt ? glyphs[(index + seed) % glyphs.length] : character;
    })
    .join("");
}
