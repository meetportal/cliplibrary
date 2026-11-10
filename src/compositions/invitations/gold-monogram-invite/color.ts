const channels = (hex: string): [number, number, number] => [
  Number.parseInt(hex.slice(1, 3), 16),
  Number.parseInt(hex.slice(3, 5), 16),
  Number.parseInt(hex.slice(5, 7), 16),
];

const hexByte = (value: number) =>
  Math.round(Math.max(0, Math.min(255, value)))
    .toString(16)
    .padStart(2, '0');

export const mix = (from: string, to: string, amount: number): string => {
  const a = channels(from);
  const b = channels(to);
  return `#${a.map((value, index) => hexByte(value + ((b[index] ?? 0) - value) * amount)).join('')}`;
};

const MIN_LIGHTNESS = 0.52;

const lifted = (hex: string): string => {
  const [red, green, blue] = channels(hex).map((value) => value / 255) as [number, number, number];
  const high = Math.max(red, green, blue);
  const low = Math.min(red, green, blue);
  const lightness = (high + low) / 2;
  if (lightness >= MIN_LIGHTNESS) {
    return hex.slice(0, 7);
  }
  const target = (MIN_LIGHTNESS - lightness) / (1 - lightness);
  return mix(hex.slice(0, 7), '#ffffff', target);
};

export type GoldTones = { deep: string; mid: string; light: string; highlight: string };

export const goldTones = (primary: string): GoldTones => {
  const mid = lifted(primary);
  return {
    deep: mix(mid, '#000000', 0.42),
    mid,
    light: mix(mid, '#ffffff', 0.3),
    highlight: mix(mid, '#fffaf0', 0.7),
  };
};

export const edgeOf = (background: string): string => mix(background.slice(0, 7), '#000000', 0.62);
