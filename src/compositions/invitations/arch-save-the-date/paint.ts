const toRgb = (hex: string): [number, number, number] => [
  Number.parseInt(hex.slice(1, 3), 16),
  Number.parseInt(hex.slice(3, 5), 16),
  Number.parseInt(hex.slice(5, 7), 16),
];

const toHex = (channels: readonly number[]): string =>
  `#${channels
    .map((value) =>
      Math.round(Math.min(255, Math.max(0, value)))
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`;

export const mix = (from: string, to: string, amount: number): string => {
  const a = toRgb(from);
  const b = toRgb(to);
  return toHex(a.map((value, index) => value + ((b[index] ?? value) - value) * amount));
};

export const tint = (color: string, amount: number): string => mix(color, '#ffffff', amount);

export const shade = (color: string, amount: number): string => mix(color, '#3a1420', amount);

export const withAlpha = (color: string, alpha: number): string => {
  const [r, g, b] = toRgb(color);
  return `rgba(${r}, ${g}, ${b}, ${Math.min(1, Math.max(0, alpha)).toFixed(3)})`;
};

export const seeded = (seed: number): (() => number) => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
};
