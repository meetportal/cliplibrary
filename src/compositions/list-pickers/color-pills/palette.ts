import type { ColorPillsProps } from '@/schemas';
import { contrast, fitGamut, fromLab, type Lab, toLab } from '../../kit/lab-color';

const LIGHTNESS_RANGE = { low: 0.28, high: 0.86 } as const;
const DARK_PRIMARY = { from: 0.5, to: 0.36, lift: 0.54 } as const;

const TEXT_CONTRAST = 3;
const INK_CONTRAST = 4.5;
const CHROMA_FLOOR = 0.15;
const FLOOR_TURN = 30;
const CURSOR_SEPARATION = 0.18;
const CURSOR_STEPS = 40;
const CURSOR_GROUND_GAP = 0.3;
const TINT_DEPTH = 0.09;
const TINT_CHROMA = 0.06;
const GLOW_SEPARATION = 0.28;

const RADIANS = Math.PI / 180;

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export const withAlpha = (color: string, alpha: number): string => {
  const level = Math.round(clamp01(alpha) * 255);
  return `${color.slice(0, 7)}${level.toString(16).padStart(2, '0')}`;
};

const distance = (left: Lab, right: Lab) =>
  Math.hypot(left.l - right.l, left.a - right.a, left.b - right.b);

const shift = (primary: string, hue: number, shade: number, vividness: number): string => {
  if (hue === 0 && shade === 0 && vividness === 1) {
    return primary.slice(0, 7);
  }
  const base = toLab(primary);
  const turn = Math.min(1, Math.abs(hue) / FLOOR_TURN);
  const own = Math.hypot(base.a, base.b);
  const floor = Math.max(own, CHROMA_FLOOR);
  const chroma = (own + (floor - own) * turn) * vividness;
  const angle = Math.atan2(base.b, base.a) + hue * RADIANS;
  const darkness = clamp01((DARK_PRIMARY.from - base.l) / (DARK_PRIMARY.from - DARK_PRIMARY.to));
  const lifted = Math.max(base.l + shade, DARK_PRIMARY.lift * darkness * turn);
  const lightness = Math.max(LIGHTNESS_RANGE.low, Math.min(LIGHTNESS_RANGE.high, lifted));
  return fromLab(
    fitGamut({ l: lightness, a: chroma * Math.cos(angle), b: chroma * Math.sin(angle) }),
  );
};

const inkToward = (fill: string, target: number): string => {
  const start = toLab(fill);
  let best = fill;
  for (let step = 1; step <= 24; step++) {
    const t = step / 24;
    const candidate = fromLab({
      l: start.l + (target - start.l) * t,
      a: start.a * (1 - t * 0.5),
      b: start.b * (1 - t * 0.5),
    });
    best = candidate;
    if (contrast(candidate, fill) >= INK_CONTRAST) {
      return candidate;
    }
  }
  return best;
};

const inkOn = (fill: string, text: string): string => {
  if (contrast(text, fill) >= TEXT_CONTRAST) {
    return text;
  }
  const dark = inkToward(fill, 0);
  const light = inkToward(fill, 1);
  const darkReaches = contrast(dark, fill) >= INK_CONTRAST;
  const lightReaches = contrast(light, fill) >= INK_CONTRAST;
  if (darkReaches !== lightReaches) {
    return darkReaches ? dark : light;
  }
  return contrast(dark, fill) >= contrast(light, fill) ? dark : light;
};

export type PillTone = { fill: string; ink: string; glow: string };

const glowOf = (fill: string, background: string): string => {
  const color = toLab(fill);
  const ground = toLab(background);
  const light = ground.l > 0.5;
  const l = light
    ? Math.min(color.l, ground.l - GLOW_SEPARATION)
    : Math.max(color.l, ground.l + GLOW_SEPARATION);
  return fromLab(fitGamut({ l, a: color.a, b: color.b }));
};

export const pillTones = (props: ColorPillsProps): PillTone[] =>
  props.pills.map((pill) => {
    const fill = shift(
      props.colors.primary,
      pill.hue * props.palette.spread,
      pill.shade,
      pill.vividness,
    );
    return {
      fill,
      ink: inkOn(fill, props.colors.text),
      glow: glowOf(fill, props.colors.background),
    };
  });

export const cursorColor = (props: ColorPillsProps, tones: readonly PillTone[]): string => {
  const cursor = toLab(props.colors.secondary);
  const ground = toLab(props.colors.background);
  const fills = tones.map((tone) => toLab(tone.fill));
  const nearest = (color: Lab) => Math.min(...fills.map((fill) => distance(color, fill)));
  if (nearest(cursor) >= CURSOR_SEPARATION) {
    return props.colors.secondary.slice(0, 7);
  }
  const options = Array.from({ length: CURSOR_STEPS + 1 }, (_, step) =>
    fitGamut({ l: step / CURSOR_STEPS, a: cursor.a, b: cursor.b }),
  ).filter((option) => Math.abs(option.l - ground.l) >= CURSOR_GROUND_GAP);
  const best = options.reduce(
    (chosen, option) => (nearest(option) > nearest(chosen) ? option : chosen),
    cursor,
  );
  return fromLab(best);
};

const tintFrom = (background: Lab, source: string): string => {
  const color = toLab(source);
  const angle = Math.atan2(color.b, color.a);
  const direction = background.l > 0.5 ? -1 : 1;
  return fromLab(
    fitGamut({
      l: background.l + direction * TINT_DEPTH,
      a: background.a + TINT_CHROMA * Math.cos(angle),
      b: background.b + TINT_CHROMA * Math.sin(angle),
    }),
  );
};

export const glowTints = (props: ColorPillsProps, tones: readonly PillTone[]) => {
  const ground = toLab(props.colors.background);
  const cool = tones[Math.min(3, tones.length - 1)]?.fill ?? props.colors.primary;
  return {
    first: tintFrom(ground, cool),
    second: tintFrom(ground, props.colors.primary),
  };
};
