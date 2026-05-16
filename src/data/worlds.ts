export type WorldId =
  | "angel-dial"
  | "cyber-goth-mall"
  | "login-chapel"
  | "malware-chapel"
  | "black-desktop"
  | "archive-ocean"
  | "gif-conservatory"
  | "angel-server-cathedral"
  | "red-chatrooms"
  | "memory-hospital"
  | "forgotten-orrery"
  | "rot-wall"
  | "floor-null";

export type EraId =
  | "1999-glitter-web"
  | "2003-cyber-goth-mall"
  | "2007-emo-myspace"
  | "2012-tumblr-decay"
  | "future-cathedral-os"
  | "unknown-corrupted-era";

export type MoodId =
  | "haunted"
  | "playful"
  | "tender"
  | "cursed"
  | "chaotic"
  | "lonely"
  | "holy"
  | "romantic"
  | "glitchy"
  | "feral";

export type TransitionType =
  | "clock-bloom"
  | "spiral-descent"
  | "orrery-shift"
  | "liquid-glass-warp"
  | "mechanical-swallow"
  | "ghost-veil"
  | "elevator-climb";

export type HauntedObject = {
  id: string;
  kind:
    | "clock"
    | "ghost"
    | "door"
    | "chain"
    | "creature"
    | "sticker"
    | "popup"
    | "folder"
    | "cd"
    | "radio"
    | "elevator"
    | "relic"
    | "bottle"
    | "mirror"
    | "puddle"
    | "flower";
  label?: string;
  draggable: boolean;
  rotatable?: boolean;
  pullable?: boolean;
  feedable?: boolean;
  insideViewId?: "cd-tray-city" | "popup-interior" | "ghost-interior" | "clockwork-interior" | "bottle-message-world";
  portalChance: number;
  destination?: WorldId;
  ritual?: "rotate" | "pull" | "feed" | "tune" | "open" | "climb" | "drag";
  moodAffinity?: MoodId[];
  secretDepth?: number;
  audioCue?: string;
  hoverLine?: string;
  decayState?: number;
  creatureInterest?: number;
};

export type WorldDefinition = {
  id: WorldId;
  name: string;
  subtitle: string;
  transition: TransitionType;
  charm: string;
  palette: string[];
  whispers: string[];
};

export type ClockRoomDefinition = {
  index: number;
  id: WorldId;
  name: string;
  subtitle: string;
  description: string;
  interaction: string;
  transitionLabel: string;
};

export const eras: EraId[] = [
  "1999-glitter-web",
  "2003-cyber-goth-mall",
  "2007-emo-myspace",
  "2012-tumblr-decay",
  "future-cathedral-os",
  "unknown-corrupted-era",
];

export const moods: MoodId[] = [
  "haunted",
  "playful",
  "tender",
  "cursed",
  "chaotic",
  "lonely",
  "holy",
  "romantic",
  "glitchy",
  "feral",
];

export const worlds: WorldDefinition[] = [
  {
    id: "angel-dial",
    name: "ANGEL DIAL",
    subtitle: "A SOFT HAUNTED INTERNET INSTRUMENT",
    transition: "liquid-glass-warp",
    charm: "glass halo clock",
    palette: ["#fffaf2", "#dcecff", "#f7d8e5", "#d6ad63"],
    whispers: ["The machine is listening softly.", "Turn the hand to begin."],
  },
  {
    id: "cyber-goth-mall",
    name: "DREAM ARCADE",
    subtitle: "SPIRAL MALL",
    transition: "orrery-shift",
    charm: "pearl arcade charm",
    palette: ["#fffaf2", "#f5bfd4", "#bddcf4", "#ead4a3"],
    whispers: ["Spin the fountain and the arcade hums.", "Tiny moon shoppers follow the music."],
  },
  {
    id: "archive-ocean",
    name: "ARCHIVE OCEAN",
    subtitle: "MOON BOTTLES",
    transition: "spiral-descent",
    charm: "moon bottle",
    palette: ["#fffdf7", "#bddcf4", "#a9d8ee", "#dff4e8"],
    whispers: ["Moon bottles drift through soft currents.", "The whirlpool plays like a harp."],
  },
  {
    id: "angel-server-cathedral",
    name: "ANGEL SERVER CATHEDRAL",
    subtitle: "CLOUD CHAPEL",
    transition: "clock-bloom",
    charm: "cloud server wing",
    palette: ["#fffaf2", "#f5f0ff", "#d8ccff", "#d6ad63"],
    whispers: ["SERAPH listens like a bell in a cloud.", "Rotate the halo engine gently."],
  },
  {
    id: "forgotten-orrery",
    name: "FORGOTTEN ORRERY",
    subtitle: "STAR ALIGNMENTS",
    transition: "clock-bloom",
    charm: "paper moon",
    palette: ["#fffdf7", "#d8ccff", "#f7d8e5", "#ead4a3"],
    whispers: ["Align relic planets into small constellations.", "A tiny room opens when the stars agree."],
  },
  {
    id: "memory-hospital",
    name: "MEMORY HOSPITAL",
    subtitle: "DREAM WARDS",
    transition: "ghost-veil",
    charm: "silk curtain",
    palette: ["#fffaf2", "#dff4e8", "#bddcf4", "#f7d8e5"],
    whispers: ["Nothing here is broken. Some things are only unfinished.", "Turn the dream chart slowly."],
  },
  {
    id: "rot-wall",
    name: "RELIQUARY WALL",
    subtitle: "VISITOR SHRINE",
    transition: "clock-bloom",
    charm: "pressed flower tile",
    palette: ["#fffaf2", "#f7d8e5", "#dff4e8", "#ead4a3"],
    whispers: ["The wall keeps what visitors leave behind.", "A relic may bloom into a portal."],
  },
  {
    id: "floor-null",
    name: "QUIET FLOOR",
    subtitle: "WHITE MIST",
    transition: "spiral-descent",
    charm: "white cursor moon",
    palette: ["#fffdf7", "#f5f0ff", "#dcecff", "#f7efe4"],
    whispers: ["The quiet floor answers by becoming mist.", "Follow the white cursor moon."],
  },
  {
    id: "login-chapel",
    name: "LOGIN CHAPEL",
    subtitle: "PASSWORD ROSE",
    transition: "clock-bloom",
    charm: "password pearl",
    palette: ["#fffaf2", "#f7d8e5", "#d8ccff", "#ead4a3"],
    whispers: ["Remember me is a soft little spell.", "Password pearls orbit the rose window."],
  },
  {
    id: "malware-chapel",
    name: "SOFT ERROR CHAPEL",
    subtitle: "POP-UP ROSARY",
    transition: "mechanical-swallow",
    charm: "sleepy warning bead",
    palette: ["#fffaf2", "#f5bfd4", "#d8ccff", "#d6ad63"],
    whispers: ["A gentle warning window asks to be arranged.", "Soft imps nap inside glass panels."],
  },
  {
    id: "black-desktop",
    name: "MOON DESKTOP",
    subtitle: "CIRCULAR OS",
    transition: "orrery-shift",
    charm: "desktop moon",
    palette: ["#fffdf7", "#bddcf4", "#d8ccff", "#ead4a3"],
    whispers: ["The taskbar is a pearl orbit.", "Dream files fold into paper birds."],
  },
  {
    id: "gif-conservatory",
    name: "GHOST VEIL GARDEN",
    subtitle: "SILK DOORWAYS",
    transition: "clock-bloom",
    charm: "silk flower",
    palette: ["#fffaf2", "#f7d8e5", "#dff4e8", "#d8ccff"],
    whispers: ["Pull a veil and a doorway remembers itself.", "Moths sleep in the silk garden."],
  },
  {
    id: "red-chatrooms",
    name: "WHISPER ROOM",
    subtitle: "RADIO SIGNALS",
    transition: "spiral-descent",
    charm: "glass radio bubble",
    palette: ["#fffaf2", "#bddcf4", "#f7d8e5", "#ead4a3"],
    whispers: ["Tune softly. Some messages become planets.", "A whisper is a room before it is a sentence."],
  },
];

export const mvpWorlds: WorldId[] = [
  "angel-dial",
  "cyber-goth-mall",
  "archive-ocean",
  "angel-server-cathedral",
  "forgotten-orrery",
  "memory-hospital",
  "rot-wall",
  "floor-null",
];

export const clockRooms: ClockRoomDefinition[] = [
  {
    index: 0,
    id: "gif-conservatory",
    name: "GHOST VEIL GARDEN",
    subtitle: "Silk Doorways",
    description: "Floating silk ghosts, pastel flowers, hanging pearls, and soft water floors.",
    interaction: "Pull ghost veils to open doorways.",
    transitionLabel: "Silk Veil",
  },
  {
    index: 1,
    id: "cyber-goth-mall",
    name: "DREAM ARCADE",
    subtitle: "Spiral Mall",
    description: "Pastel spiral mall with pearl arcade machines and tiny moon shoppers.",
    interaction: "Spin the fountain to rotate the arcade.",
    transitionLabel: "Clock Bloom",
  },
  {
    index: 2,
    id: "archive-ocean",
    name: "ARCHIVE OCEAN",
    subtitle: "Moon Bottles",
    description: "Blue glass ocean, moon bottles, browser jellyfish, and pearl lilies.",
    interaction: "Guide the whirlpool harp and open bottle worlds.",
    transitionLabel: "Water Ripple",
  },
  {
    index: 3,
    id: "angel-server-cathedral",
    name: "ANGEL SERVER",
    subtitle: "Cloud Chapel",
    description: "Ivory server cathedral with warm screens, organ cables, and halo engine.",
    interaction: "Rotate the halo engine and listen to SERAPH.",
    transitionLabel: "Clock Bloom",
  },
  {
    index: 4,
    id: "forgotten-orrery",
    name: "FORGOTTEN ORRERY",
    subtitle: "Star Alignments",
    description: "Delicate celestial machine with paper moons and golden orbit wires.",
    interaction: "Align relic planets into constellations.",
    transitionLabel: "Clock Bloom",
  },
  {
    index: 5,
    id: "memory-hospital",
    name: "MEMORY HOSPITAL",
    subtitle: "Dream Wards",
    description: "Moonlit beds, silk curtains, dream monitors, and quiet flowers.",
    interaction: "Turn the dream chart to reveal patients.",
    transitionLabel: "Silk Veil",
  },
  {
    index: 6,
    id: "red-chatrooms",
    name: "WHISPER ROOM",
    subtitle: "Radio Signals",
    description: "Pastel radio room with soft waveform ribbons and message planets.",
    interaction: "Tune frequencies to reveal hidden whispers.",
    transitionLabel: "Radio Wave",
  },
  {
    index: 7,
    id: "rot-wall",
    name: "RELIQUARY WALL",
    subtitle: "Visitor Shrine",
    description: "Patchwork shrine of relic charms, pressed flowers, notes, and keepsakes.",
    interaction: "Leave a relic and watch it bloom or age.",
    transitionLabel: "Clock Bloom",
  },
  {
    index: 8,
    id: "login-chapel",
    name: "LOGIN CHAPEL",
    subtitle: "Password Rose",
    description: "Rose window made of login forms, floating pearls, and identity ghosts.",
    interaction: "Type dream words and open password pearls.",
    transitionLabel: "Clock Bloom",
  },
  {
    index: 9,
    id: "malware-chapel",
    name: "SOFT ERROR CHAPEL",
    subtitle: "Popup Rosary",
    description: "Gentle warning windows, sleepy popups, glass bugs, and moth imps.",
    interaction: "Arrange popup beads into soft warnings.",
    transitionLabel: "Object Entry",
  },
  {
    index: 10,
    id: "black-desktop",
    name: "MOON DESKTOP",
    subtitle: "Circular OS",
    description: "Circular desktop moon with orbiting folders, pearl taskbar, and cursor pets.",
    interaction: "Rotate the taskbar wheel to open file worlds.",
    transitionLabel: "Clock Bloom",
  },
  {
    index: 11,
    id: "floor-null",
    name: "QUIET FLOOR",
    subtitle: "White Mist",
    description: "Pale mist, impossible staircases, white cursor moon, and unanswered rooms.",
    interaction: "Move slowly and follow the white cursor.",
    transitionLabel: "Quiet Fade",
  },
];

export const worldIdToClockIndex = clockRooms.reduce(
  (lookup, room) => ({
    ...lookup,
    [room.id]: room.index,
  }),
  {} as Partial<Record<WorldId, number>>,
);

export function getWorld(id: WorldId) {
  return worlds.find((world) => world.id === id) ?? worlds[0];
}

export function getClockRoom(id: WorldId) {
  return clockRooms.find((room) => room.id === id);
}
