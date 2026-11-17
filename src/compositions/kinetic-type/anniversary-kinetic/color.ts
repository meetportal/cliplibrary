import { fitGamut, fromLab, toLab } from '../../kit/lab-color';

const HEX = /^#[0-9a-f]{6}$/i;

const channels = (hex: string): number[] =>
  [1, 3, 5].map((at) => Number.parseInt(hex.slice(at, at + 2), 16));

const linear = (value: number) => {
  const unit = value / 255;
  return unit <= 0.03928 ? unit / 12.92 : ((unit + 0.055) / 1.055) ** 2.4;
};

const luminance = (hex: string) => {
  const [red = 0, green = 0, blue = 0] = channels(hex);
  return 0.2126 * linear(red) + 0.7152 * linear(green) + 0.0722 * linear(blue);
};

const contrast = (first: string, second: string) => {
  const a = luminance(first);
  const b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
};

const solid = (color: string) => (HEX.test(color.slice(0, 7)) ? color.slice(0, 7) : '#000000');

export const mix = (from: string, to: string, amount: number): string => {
  const start = channels(solid(from));
  const end = channels(solid(to));
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

export const inkOn = (fill: string, first: string, second: string) =>
  contrast(solid(first), solid(fill)) >= contrast(solid(second), solid(fill)) ? first : second;

export const readable = (color: string, background: string, toward: string, floor = 3) => {
  for (let step = 0; step <= 20; step++) {
    const candidate = step === 0 ? solid(color) : mix(color, toward, step / 20);
    if (contrast(candidate, solid(background)) >= floor) {
      return candidate;
    }
  }
  return solid(toward);
};

export const mixLch = (from: string, to: string, amount: number): string => {
  const start = toLab(solid(from));
  const end = toLab(solid(to));
  const t = Math.max(0, Math.min(1, amount));
  const chroma = (lab: { a: number; b: number }) => Math.hypot(lab.a, lab.b);
  const startHue = Math.atan2(start.b, start.a);
  let turn = Math.atan2(end.b, end.a) - startHue;
  if (turn > Math.PI) {
    turn -= 2 * Math.PI;
  } else if (turn < -Math.PI) {
    turn += 2 * Math.PI;
  }
  const hue = startHue + turn * t;
  const c = chroma(start) + (chroma(end) - chroma(start)) * t;
  return fromLab(
    fitGamut({ l: start.l + (end.l - start.l) * t, a: c * Math.cos(hue), b: c * Math.sin(hue) }),
  );
};
