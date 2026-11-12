type Lab = [number, number, number];

const toLinear = (channel: number) =>
  channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;

const toGamma = (channel: number) =>
  channel <= 0.0031308 ? channel * 12.92 : 1.055 * channel ** (1 / 2.4) - 0.055;

const rgbOf = (hex: string): Lab => {
  const value = hex.slice(1, 7);
  return [0, 2, 4].map((at) => Number.parseInt(value.slice(at, at + 2), 16) / 255) as Lab;
};

const oklab = (hex: string): Lab => {
  const [r, g, b] = rgbOf(hex).map(toLinear) as Lab;
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
};

const hexOf = ([L, A, B]: Lab): string => {
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  const rgb = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  return `#${rgb
    .map((channel) =>
      Math.round(Math.max(0, Math.min(1, toGamma(channel))) * 255)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`;
};

export const mixOklab = (from: string, to: string, amount: number): string => {
  const [l1, a1, b1] = oklab(from);
  const [l2, a2, b2] = oklab(to);
  return hexOf([l1 + (l2 - l1) * amount, a1 + (a2 - a1) * amount, b1 + (b2 - b1) * amount]);
};

const lightness = (hex: string): number => oklab(hex)[0];

export const inkOn = (fill: string, ink: string, chalk: string): string =>
  Math.abs(lightness(fill) - lightness(ink)) >= Math.abs(lightness(fill) - lightness(chalk))
    ? ink
    : chalk;

export const liftOn = (color: string, board: string, minimumGap = 0.3): string => {
  const gap = lightness(color) - lightness(board);
  if (gap >= minimumGap) {
    return color;
  }
  const target = Math.min(0.95, lightness(board) + minimumGap);
  const [, a, b] = oklab(color);
  return hexOf([target, a, b]);
};
