import type { MiniaturePanoramaProps, TimeOfDay } from '@/schemas';
import { glide } from '../../promo/timing';

type Rgb = readonly [number, number, number];

const HOLD_PHASE: Record<TimeOfDay, number> = { day: 0, dusk: 1, night: 2 };

const LIGHT_FADE = 0.5;

const STARS_FROM = 1.3;

const STARS_FADE = 0.55;

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

export const smoothstep = (value: number): number => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};

const parsed = new Map<string, Rgb>();

const parse = (color: string): Rgb => {
  const cached = parsed.get(color);
  if (cached !== undefined) {
    return cached;
  }
  const match = /^rgb\((\d+(?:\.\d+)?),(\d+(?:\.\d+)?),(\d+(?:\.\d+)?)\)$/.exec(color);
  const rgb: Rgb =
    match === null
      ? [
          Number.parseInt(color.slice(1, 3), 16),
          Number.parseInt(color.slice(3, 5), 16),
          Number.parseInt(color.slice(5, 7), 16),
        ]
      : [Number(match[1]), Number(match[2]), Number(match[3])];
  parsed.set(color, rgb);
  return rgb;
};

export const mix = (from: string, to: string, amount: number): string => {
  const t = clamp01(amount);
  const a = parse(from);
  const b = parse(to);
  const channel = (index: 0 | 1 | 2) => (a[index] + (b[index] - a[index]) * t).toFixed(1);
  return `rgb(${channel(0)},${channel(1)},${channel(2)})`;
};

export const acrossDay = (day: string, dusk: string, night: string, phase: number): string =>
  phase <= 1 ? mix(day, dusk, phase) : mix(dusk, night, phase - 1);

export const dayPhase = (frame: number, timelapse: MiniaturePanoramaProps['timelapse']): number => {
  if (!timelapse.enabled) {
    return HOLD_PHASE[timelapse.hold];
  }
  const dusk = Math.max(timelapse.dusk, timelapse.start + 1);
  const night = Math.max(timelapse.night, dusk + 1);
  if (frame <= dusk) {
    return glide(clamp01((frame - timelapse.start) / (dusk - timelapse.start)));
  }
  return 1 + glide(clamp01((frame - dusk) / (night - dusk)));
};

export type Shade = (color: string, weight?: number) => string;

export const makeShade = (phase: number, shade: MiniaturePanoramaProps['shade']): Shade => {
  const dusk = phase <= 1 ? phase : 2 - phase;
  const night = clamp01(phase - 1);
  return (color, weight = 1) =>
    mix(
      mix(color, shade.duskTint, dusk * shade.duskStrength * weight),
      shade.nightTint,
      night * shade.nightStrength * weight,
    );
};

export const lightAmount = (phase: number, onAt: number): number =>
  smoothstep((phase - onAt) / LIGHT_FADE);

export const starAmount = (phase: number): number => smoothstep((phase - STARS_FROM) / STARS_FADE);

export const nightAmount = (phase: number): number => clamp01(phase - 1);
