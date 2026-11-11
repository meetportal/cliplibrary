const HEX = /^#[0-9a-f]{6}$/i;

const solid = (color: string) => (HEX.test(color.slice(0, 7)) ? color.slice(0, 7) : '#000000');

const channels = (hex: string): number[] =>
  [1, 3, 5].map((at) => Number.parseInt(solid(hex).slice(at, at + 2), 16));

export const mix = (from: string, to: string, amount: number): string => {
  const start = channels(from);
  const end = channels(to);
  const t = Math.max(0, Math.min(1, amount));
  return `#${start
    .map((value, index) =>
      Math.round(value + ((end[index] ?? value) - value) * t)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`;
};

export const alpha = (color: string, opacity: number): string => {
  const value = Math.round(Math.max(0, Math.min(1, opacity)) * 255);
  return `${solid(color)}${value.toString(16).padStart(2, '0')}`;
};
