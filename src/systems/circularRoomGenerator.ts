export type MicroRoom = {
  id: string;
  name: string;
  contents: string[];
  line: string;
};

const roomNames = [
  "tiny internet cafe",
  "miniature train station",
  "broken aquarium",
  "tiny website shrine",
  "pixel bedroom",
  "music-box room under a CD",
];

const contents = [
  "sleeping pixel pet",
  "blue bottle",
  "wrong browser tab",
  "neon curtain",
  "tiny escalator",
  "cursor candle",
  "wet sticker wall",
  "archive moth",
];

export function generateCircularRoom(seed: number): MicroRoom {
  return {
    id: `micro-room-${seed}`,
    name: roomNames[seed % roomNames.length].toUpperCase(),
    contents: [contents[seed % contents.length], contents[(seed + 3) % contents.length], contents[(seed + 5) % contents.length]],
    line: "The room is bigger inside the object and refuses to clarify.",
  };
}
