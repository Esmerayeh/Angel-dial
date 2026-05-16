import type { WorldId } from "@/data/worlds";

const commandMap: Record<string, { line: string; unlock?: WorldId; resetAlias?: boolean }> = {
  "/remember me": {
    line: "Remember me is a prayer. The Login Chapel blinked.",
    unlock: "login-chapel",
  },
  "/forget me": {
    line: "You asked to drift. Rain begins softly in local storage.",
    unlock: "floor-null",
    resetAlias: true,
  },
  "/open null": {
    line: "The Quiet Floor does not open. It becomes mist.",
    unlock: "floor-null",
  },
  "/brb forever": {
    line: "A whisper bubble has become a tiny planet.",
    unlock: "red-chatrooms",
  },
  "/feed machine": {
    line: "The halo mouth is hungry in a more specific way.",
    unlock: "angel-server-cathedral",
  },
  "/dial backwards": {
    line: "You rotated time backward. A ghost veil listened.",
    unlock: "floor-null",
  },
};

export function checkSecretCommand(command: string) {
  return commandMap[command.trim().toLowerCase()];
}

export function shouldUnlockFloorNull(rotation: number, pullDistance: number) {
  return rotation < -240 || pullDistance > 245;
}

export function getWrongClickReward(count: number) {
  const rewards = [
    "A tiny popup says thank you for noticing.",
    "The moon charm rotated the room instead of itself.",
    "A sticker peeled back to reveal a smaller sticker.",
    "All creatures listened for exactly one glass chime.",
  ];

  return rewards[count % rewards.length];
}
