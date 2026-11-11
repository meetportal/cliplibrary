type Rgb = [number, number, number];
type Lab = [number, number, number];

const parse = (hex: string): Rgb => {
  const value = hex.replace('#', '').slice(0, 6);
  return [0, 2, 4].map((at) => Number.parseInt(value.slice(at, at + 2), 16) / 255) as Rgb;
};

const toHex = (rgb: Rgb): string =>
  `#${rgb
    .map((channel) =>
      Math.round(Math.min(1, Math.max(0, channel)) * 255)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`;

const toLinear = (channel: number) =>
  channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;

const fromLinear = (channel: number) =>
  channel <= 0.0031308 ? channel * 12.92 : 1.055 * channel ** (1 / 2.4) - 0.055;

const toLab = (hex: string): Lab => {
  const [r, g, b] = parse(hex).map(toLinear) as Rgb;
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
};

const fromLab = ([lightness, a, b]: Lab): string => {
  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return toHex(
    [
      4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
    ].map(fromLinear) as Rgb,
  );
};

export const mix = (from: string, to: string, amount: number): string => {
  const a = toLab(from);
  const b = toLab(to);
  return fromLab(
    [0, 1, 2].map((at) => (a[at] ?? 0) + ((b[at] ?? 0) - (a[at] ?? 0)) * amount) as Lab,
  );
};

const luminance = (hex: string) => {
  const [r, g, b] = parse(hex).map(toLinear) as Rgb;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (one: string, two: string): number => {
  const a = luminance(one);
  const b = luminance(two);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
};

const MIN_ACCENT_CHROMA = 0.14;

export const readableOn = (color: string, surface: string, minimum: number): string => {
  if (contrast(color, surface) >= minimum) {
    return color;
  }
  const lighter = luminance(surface) < 0.18;
  const [lightness, a, b] = toLab(color);
  const chroma = Math.hypot(a, b);
  const boost = chroma > 0.001 ? Math.max(1, MIN_ACCENT_CHROMA / chroma) : 1;
  for (let step = 1; step <= 40; step++) {
    const target = lighter
      ? lightness + (1 - lightness) * (step / 40)
      : lightness * (1 - step / 40);
    const grow = 1 + (boost - 1) * Math.min(1, step / 12);
    const candidate = fromLab([target, a * grow, b * grow]);
    if (contrast(candidate, surface) >= minimum) {
      return candidate;
    }
  }
  return lighter ? '#ffffff' : '#000000';
};
