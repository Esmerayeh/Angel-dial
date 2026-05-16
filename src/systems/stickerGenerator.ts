export const stickerWords = [
  "BEST VIEWED IN A DREAM",
  "UNDER CONSTRUCTION FOREVER",
  "I WANT TO BELIEVE IN HTML",
  "NO LOGIN NO GODS",
  "CLICKING IS RUDE",
  "BRB FOREVER",
  "VIEW SOURCE",
  "HOT TOPIC FROM ANOTHER TIMELINE",
  "ERROR: FEELING NOT FOUND",
];

export function getSticker(index: number) {
  return stickerWords[index % stickerWords.length];
}
