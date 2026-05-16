import type { MoodId } from "./worlds";

export type RotWallRelicSeed = {
  type: "sticker" | "dead-link" | "note" | "cursed-button" | "fake-ad" | "pixel-sigil" | "web-badge";
  content: string;
  mood: MoodId;
};

export const rotWallSeeds: RotWallRelicSeed[] = [
  { type: "web-badge", content: "BEST VIEWED IN A DREAM", mood: "haunted" },
  { type: "web-badge", content: "moon-archive://bottle/guestbook", mood: "lonely" },
  { type: "fake-ad", content: "FREE CURSOR PACK, ONE DREAM REQUIRED", mood: "playful" },
  { type: "pixel-sigil", content: "PEARL MOON PEARL", mood: "holy" },
  { type: "note", content: "i left this here before the water rose", mood: "tender" },
  { type: "cursed-button", content: "YES / MAYBE / LATER", mood: "romantic" },
  { type: "sticker", content: "UNDER CONSTRUCTION IN A DREAM", mood: "playful" },
  { type: "web-badge", content: "moon-archive://bottle/last-seen", mood: "haunted" },
  { type: "web-badge", content: "STRAY_SIGNAL WAS HERE", mood: "romantic" },
];
