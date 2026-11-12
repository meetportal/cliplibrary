const HEX = /^#[0-9a-f]{6}$/i;

const solid = (color: string) => (HEX.test(color.slice(0, 7)) ? color.slice(0, 7) : '#000000');

const channels = (hex: string): number[] =>
  [1, 3, 5].map((at) => Number.parseInt(solid(hex).slice(at, at + 2), 16));

export const unitRgb = (color: string): [number, number, number] => {
  const [r = 0, g = 0, b = 0] = channels(color).map((value) => Number((value / 255).toFixed(4)));
  return [r, g, b];
};

const toLinear = (value: number) => {
  const unit = value / 255;
  return unit <= 0.04045 ? unit / 12.92 : ((unit + 0.055) / 1.055) ** 2.4;
};

const fromLinear = (value: number) => {
  const unit = value <= 0.0031308 ? value * 12.92 : 1.055 * value ** (1 / 2.4) - 0.055;
  return Math.round(Math.max(0, Math.min(1, unit)) * 255);
};

const luminance = (color: string): number => {
  const [r = 0, g = 0, b = 0] = channels(color).map(toLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const contrast = (a: string, b: string) => {
  const [light = 0, dark = 0] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
};

export type Lab = { l: number; a: number; b: number };

export const toLab = (color: string): Lab => {
  const [r = 0, g = 0, b = 0] = channels(color).map(toLinear);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return {
    l: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  };
};

export const fromLab = ({ l, a, b }: Lab): string => {
  const lc = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const mc = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const sc = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const rgb = [
    4.0767416621 * lc - 3.3077115913 * mc + 0.2309699292 * sc,
    -1.2684380046 * lc + 2.6097574011 * mc - 0.3413193965 * sc,
    -0.0041960863 * lc - 0.7034186147 * mc + 1.707614701 * sc,
  ];
  return `#${rgb.map((value) => fromLinear(value).toString(16).padStart(2, '0')).join('')}`;
};

export const mixLab = (from: string, to: string, amount: number): string => {
  const start = toLab(from);
  const end = toLab(to);
  const t = Math.max(0, Math.min(1, amount));
  return fromLab({
    l: start.l + (end.l - start.l) * t,
    a: start.a + (end.a - start.a) * t,
    b: start.b + (end.b - start.b) * t,
  });
};

export const legibleOn = (color: string, background: string, ratio: number): string => {
  const start = toLab(color);
  const target = luminance(background) < 0.4 ? 1 : 0;
  for (let step = 0; step <= 24; step++) {
    const t = step / 24;
    const candidate = fromLab({
      l: start.l + (target - start.l) * t,
      a: start.a,
      b: start.b,
    });
    if (contrast(candidate, background) >= ratio) {
      return candidate;
    }
  }
  return target === 1 ? '#ffffff' : '#000000';
};
