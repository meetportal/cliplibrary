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
  `${hex.slice(0, 7)}${hexByte(amount * 255)}`;

const MIN_LIGHTNESS = 0.5;

const hue = (red: number, green: number, blue: number, high: number, span: number) => {
  if (span === 0) {
    return 0;
  }
  if (high === red) {
    return ((green - blue) / span + 6) % 6;
  }
  return high === green ? (blue - red) / span + 2 : (red - green) / span + 4;
};

const fromHsl = (sector: number, saturation: number, lightness: number) => {
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const second = chroma * (1 - Math.abs((sector % 2) - 1));
  const base = lightness - chroma / 2;
  const order: [number, number, number][] = [
    [chroma, second, 0],
    [second, chroma, 0],
    [0, chroma, second],
    [0, second, chroma],
    [second, 0, chroma],
    [chroma, 0, second],
  ];
  const [red, green, blue] = order[Math.floor(sector) % 6] ?? [0, 0, 0];
  return `#${[red, green, blue].map((value) => hexByte((value + base) * 255)).join('')}`;
};

export const tubeColor = (hex: string): string => {
  const [red8, green8, blue8] = channels(hex);
  const red = red8 / 255;
  const green = green8 / 255;
  const blue = blue8 / 255;
  const high = Math.max(red, green, blue);
  const low = Math.min(red, green, blue);
  const lightness = (high + low) / 2;
  if (lightness >= MIN_LIGHTNESS) {
    return hex.slice(0, 7);
  }
  const span = high - low;
  const saturation = span === 0 ? 0 : span / (1 - Math.abs(2 * lightness - 1));
  return fromHsl(hue(red, green, blue, high, span), saturation, MIN_LIGHTNESS);
};
