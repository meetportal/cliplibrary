const HEX = /^#[0-9a-f]{6}$/i;

const solid = (color: string) => (HEX.test(color.slice(0, 7)) ? color.slice(0, 7) : '#000000');

const channels = (hex: string): number[] =>
  [1, 3, 5].map((at) => Number.parseInt(solid(hex).slice(at, at + 2), 16));

const LIFTED_CHROMA = 0.12;

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export const alpha = (color: string, opacity: number): string => {
  const value = Math.round(clamp01(opacity) * 255);
  return `${solid(color)}${value.toString(16).padStart(2, '0')}`;
};

type Lab = { l: number; a: number; b: number };

const toLinear = (value: number) => {
  const unit = value / 255;
  return unit <= 0.04045 ? unit / 12.92 : ((unit + 0.055) / 1.055) ** 2.4;
};

const fromLinear = (value: number) => {
  const unit = value <= 0.0031308 ? value * 12.92 : 1.055 * value ** (1 / 2.4) - 0.055;
  return Math.round(clamp01(unit) * 255);
};

const toLab = (color: string): Lab => {
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

const fromLab = ({ l, a, b }: Lab): string => {
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
  const t = clamp01(amount);
  return fromLab({
    l: start.l + (end.l - start.l) * t,
    a: start.a + (end.a - start.a) * t,
    b: start.b + (end.b - start.b) * t,
  });
};

export const mixHue = (from: string, to: string, amount: number): string => {
  const start = toLab(from);
  const end = toLab(to);
  const t = clamp01(amount);
  const startChroma = Math.hypot(start.a, start.b);
  const endChroma = Math.hypot(end.a, end.b);
  if (Math.min(startChroma, endChroma) < 0.03) {
    return mixLab(from, to, t);
  }
  const startHue = Math.atan2(start.b, start.a);
  let turn = Math.atan2(end.b, end.a) - startHue;
  turn = Math.atan2(Math.sin(turn), Math.cos(turn));
  const hue = startHue + turn * t;
  const chroma = startChroma + (endChroma - startChroma) * t;
  return fromLab({
    l: start.l + (end.l - start.l) * t,
    a: Math.cos(hue) * chroma,
    b: Math.sin(hue) * chroma,
  });
};

const luminance = (color: string): number => {
  const [r = 0, g = 0, b = 0] = channels(color).map(toLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (a: string, b: string) => {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return ((light ?? 0) + 0.05) / ((dark ?? 0) + 0.05);
};

export const legibleOn = (color: string, background: string, ratio: number): string => {
  const lighten = luminance(background) < 0.4;
  const base = toLab(color);
  const target = lighten ? 1 : 0;
  const chroma = Math.hypot(base.a, base.b);
  const boost = chroma > 0.01 ? Math.max(1, Math.min(2.4, LIFTED_CHROMA / chroma)) : 1;
  for (let step = 0; step <= 20; step++) {
    const t = step / 20;
    const keep = 1 + (boost - 1) * Math.min(1, t * 2);
    const candidate = fromLab({
      l: base.l + (target - base.l) * t,
      a: base.a * keep,
      b: base.b * keep,
    });
    if (contrast(candidate, background) >= ratio) {
      return candidate;
    }
  }
  return lighten ? '#ffffff' : '#000000';
};

export const inkOn = (fill: string, dark: string, light: string): string =>
  contrast(dark, fill) >= contrast(light, fill) ? dark : light;

export const softInkOn = (fill: string, dark: string, light: string): string => {
  const balance = Math.log(contrast(dark, fill) / contrast(light, fill));
  return mixLab(light, dark, clamp01(0.5 + balance * 1.5));
};

const CLOSE_HUE = 0.9;

export const apartFrom = (low: string, primary: string): string => {
  const a = toLab(low);
  const b = toLab(primary);
  const chroma = Math.min(Math.hypot(a.a, a.b), Math.hypot(b.a, b.b));
  const turn = Math.abs(
    Math.atan2(
      Math.sin(Math.atan2(a.b, a.a) - Math.atan2(b.b, b.a)),
      Math.cos(Math.atan2(a.b, a.a) - Math.atan2(b.b, b.a)),
    ),
  );
  const closeness = clamp01(1 - turn / CLOSE_HUE) * clamp01((chroma - 0.02) / 0.04);
  const keep = 1 - 0.8 * closeness;
  return fromLab({ l: a.l, a: a.a * keep, b: a.b * keep });
};
