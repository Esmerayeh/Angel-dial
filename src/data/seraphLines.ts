import type { WorldId } from "./worlds";

export const seraphLines = [
  "The machine is listening softly.",
  "You turned the hand like a small piece of weather.",
  "A door remembered how to open.",
  "The ghost stretched but did not break.",
  "The wall keeps what visitors leave behind.",
  "Nothing here is broken. Some things are only unfinished.",
  "Move slowly. The dial will sing.",
  "A pearl has noticed your cursor.",
  "The room brightened where you lingered.",
  "The machine adjusted its breathing to match yours.",
];

export const worldSeraphLines: Record<WorldId, string[]> = {
  "angel-dial": [
    "The hand moved. The soft internet heard it.",
    "Your alias is local only. The machine keeps no accounts.",
  ],
  "cyber-goth-mall": [
    "You stood near the arcade too long. A small cabinet now hums for you.",
    "The fountain is turning the mall like a music box.",
  ],
  "archive-ocean": [
    "The bottle remembers being a letter.",
    "The water has folded your hesitation into a wave.",
  ],
  "angel-server-cathedral": [
    "You are not logged in. You are only softly present.",
    "A monitor angel placed your gesture near the organ.",
  ],
  "forgotten-orrery": [
    "You aligned small moons into a living sentence.",
    "A tiny portal opened because the stars agreed.",
  ],
  "memory-hospital": [
    "This room is not sad. It is still loading.",
    "The curtain noticed how gently you pulled.",
  ],
  "rot-wall": [
    "The Reliquary Wall keeps visitor relics like pressed flowers.",
    "A relic faded while you watched, which means it trusts you.",
  ],
  "floor-null": [
    "The white cursor moon drifted once. Do not explain the result.",
    "You have reached the room that answers with mist.",
  ],
  "login-chapel": ["Remember me is a prayer with local storage."],
  "malware-chapel": ["A soft warning window unfolded like a paper flower."],
  "black-desktop": ["The recycle bin contains several tiny moons."],
  "gif-conservatory": ["The ghost veil garden opened a silk door."],
  "red-chatrooms": ["Some whispers are real. The room will not say which."],
};

export function pickSeraphLine(world: WorldId, interactionCount: number) {
  const localLines = worldSeraphLines[world] ?? [];
  const source = localLines.length > 0 ? localLines : seraphLines;
  return source[interactionCount % source.length];
}
