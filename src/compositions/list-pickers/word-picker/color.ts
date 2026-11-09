const HEX = /^#[0-9a-f]{6}$/i;

const channels = (hex: string): [number, number, number] => {
  const base = HEX.test(hex.slice(0, 7)) ? hex.slice(0, 7) : '#000000';
  return [1, 3, 5].map((at) => Number.parseInt(base.slice(at, at + 2), 16)) as [
    number,
    number,
    number,
  ];
};

const toHex = (values: readonly number[]) =>
  `#${values
    .map((value) =>
      Math.round(Math.max(0, Math.min(255, value)))
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`;

export const mixHex = (from: string, to: string, amount: number): string => {
  const start = channels(from);
  const end = channels(to);
  const t = Math.max(0, Math.min(1, amount));
  return toHex(start.map((value, index) => value + ((end[index] ?? value) - value) * t));
};

export const withAlpha = (color: string, alpha: number): string =>
  `${mixHex(color, color, 0)}${Math.round(Math.max(0, Math.min(1, alpha)) * 255)
    .toString(16)
    .padStart(2, '0')}`;

const linear = (value: number) => {
  const unit = value / 255;
  return unit <= 0.03928 ? unit / 12.92 : ((unit + 0.055) / 1.055) ** 2.4;
};

export const luminance = (hex: string): number => {
  const [red, green, blue] = channels(hex).map(linear) as [number, number, number];
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
};

const contrastRatio = (first: string, second: string): number => {
  const a = luminance(first);
  const b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
};

export const readableOn = (color: string, page: string, toward: string, minimum = 3): string => {
  if (contrastRatio(color, page) >= minimum) {
    return color.slice(0, 7);
  }
  for (let step = 1; step <= 20; step++) {
    const candidate = mixHex(color, toward, step / 20);
    if (contrastRatio(candidate, page) >= minimum) {
      return candidate;
    }
  }
  return toward.slice(0, 7);
};

export const bestOn = (fill: string, options: readonly string[]): string =>
  options.reduce((best, option) =>
    contrastRatio(option, fill) > contrastRatio(best, fill) ? option : best,
  );
