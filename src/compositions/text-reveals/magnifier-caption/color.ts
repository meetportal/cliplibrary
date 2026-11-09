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

export const alpha = (hex: string, amount: number): string =>
  `${hex.slice(0, 7)}${hexByte(Math.max(0, Math.min(1, amount)) * 255)}`;

const luminance = (hex: string): number => {
  const linear = channels(hex).map((value) => {
    const unit = value / 255;
    return unit <= 0.03928 ? unit / 12.92 : ((unit + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * (linear[0] ?? 0) + 0.7152 * (linear[1] ?? 0) + 0.0722 * (linear[2] ?? 0);
};

export const contrast = (first: string, second: string): number => {
  const a = luminance(first);
  const b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
};

export const readableOn = (
  color: string,
  background: string,
  toward: string,
  minimum: number,
): string => {
  let lifted = color.slice(0, 7);
  for (let step = 1; step <= 20 && contrast(lifted, background) < minimum; step++) {
    lifted = mix(color, toward, step / 20);
  }
  return lifted;
};
