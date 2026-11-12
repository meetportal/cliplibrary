type Oklab = [number, number, number];

const SIX = /^#[0-9a-f]{6}/i;

const bytes = (color: string): [number, number, number] => {
  const hex = SIX.test(color) ? color.slice(1, 7) : '000000';
  return [0, 2, 4].map((at) => Number.parseInt(hex.slice(at, at + 2), 16)) as [
    number,
    number,
    number,
  ];
};

const linear = (byte: number) => {
  const unit = byte / 255;
  return unit <= 0.04045 ? unit / 12.92 : ((unit + 0.055) / 1.055) ** 2.4;
};

const encode = (value: number) => {
  const unit = value <= 0.0031308 ? value * 12.92 : 1.055 * value ** (1 / 2.4) - 0.055;
  return Math.round(Math.max(0, Math.min(1, unit)) * 255)
    .toString(16)
    .padStart(2, '0');
};

const toOklab = (color: string): Oklab => {
  const [r, g, b] = bytes(color).map(linear) as [number, number, number];
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
};

const fromOklab = ([lightness, a, b]: Oklab): string => {
  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return `#${encode(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s)}${encode(
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
  )}${encode(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s)}`;
};

export const mixOklab = (from: string, to: string, amount: number): string => {
  const a = toOklab(from);
  const b = toOklab(to);
  const t = Math.max(0, Math.min(1, amount));
  return fromOklab([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]);
};

const luminance = (color: string) => {
  const [r, g, b] = bytes(color).map(linear) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (a: string, b: string) => {
  const one = luminance(a);
  const two = luminance(b);
  return (Math.max(one, two) + 0.05) / (Math.min(one, two) + 0.05);
};

export const liftOn = (color: string, background: string, ratio: number): string => {
  const start = toOklab(color);
  const target = luminance(background) < 0.3 ? 0.97 : 0.18;
  for (let step = 0; step <= 20; step++) {
    const t = step / 20;
    const candidate = fromOklab([start[0] + (target - start[0]) * t, start[1], start[2]]);
    if (contrast(candidate, background) >= ratio) {
      return candidate;
    }
  }
  return target > 0.5 ? '#ffffff' : '#111111';
};

export const inkOn = (ink: string, fill: string, light: string): string => {
  if (contrast(ink, fill) >= 4.5) {
    return ink;
  }
  return contrast(light, fill) >= contrast(ink, fill) ? light : ink;
};
