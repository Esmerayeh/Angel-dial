const junkLabels = [
  "MOON PETAL",
  "PEARL TEAR",
  "GLASS CD",
  "BLUSH CHARM",
  "CURSOR CANDLE",
  "BUTTERFLY GIF",
  "LACE PEARL",
  "ANGEL PNG",
  "MOON THREAD",
  "RAINY TAB",
  "CHROME BEAD",
  "MOON BUTTON",
  "FORUM FLOWER",
  "RADIO WAVE",
  "SOFT PEARL",
  "DREAM BAG",
];

export type FloatingJunk = {
  id: string;
  label: string;
  x: number;
  y: number;
  size: number;
  delay: number;
  spin: number;
};

export function spawnFloatingJunk(seed: number, count = 48): FloatingJunk[] {
  return Array.from({ length: count }, (_, index) => {
    const base = Math.sin((seed + index * 13.37) * 9.17) * 10000;
    const random = base - Math.floor(base);

    return {
      id: `junk-${seed}-${index}`,
      label: junkLabels[index % junkLabels.length],
      x: (random * 113 + index * 17) % 100,
      y: (random * 89 + index * 23) % 100,
      size: 18 + ((index * 7) % 34),
      delay: (index % 11) * 0.31,
      spin: index % 2 === 0 ? 1 : -1,
    };
  });
}
