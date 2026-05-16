export type CreatureKind =
  | "cursor-cherub"
  | "popup-imp"
  | "halo-fish"
  | "loading-moth"
  | "crt-monk"
  | "floppy-bird"
  | "cable-spider"
  | "ghost-veil"
  | "pixel-pet";

export type CreatureSeed = {
  id: string;
  kind: CreatureKind;
  label: string;
  mood: string;
  orbit: number;
  speed: number;
  line: string;
};

export const creatureCatalog: Record<CreatureKind, string[]> = {
  "cursor-cherub": [
    "steals buttons politely",
    "gets dizzy near rotating rings",
    "leaves chrome glitter on the cursor",
  ],
  "popup-imp": [
    "opens apology windows",
    "laughs in alert sounds",
    "multiplies when ignored",
  ],
  "halo-fish": [
    "swims through portals",
    "turns HTML into bubbles",
    "nudges relics toward the mouth",
  ],
  "loading-moth": [
    "gathers when reality buffers",
    "sews fog to progress bars",
    "builds portals from dust",
  ],
  "crt-monk": [
    "<div class=\"grief\">still here</div>",
    "polishes the rose window",
    "blocks doors until they are ready",
  ],
  "floppy-bird": [
    "delivers anonymous notes",
    "lands near lost objects",
    "drops a tiny file when clicked",
  ],
  "cable-spider": [
    "stitches broken portals",
    "reroutes paths through wires",
    "keeps one eye on the radio",
  ],
  "ghost-veil": [
    "stretches into a doorway",
    "whispers from the top edge",
    "becomes hospital curtains",
  ],
  "pixel-pet": [
    "eats glitter stickers",
    "sleeps on web buttons",
    "evolves when fed moon threads",
  ],
};
