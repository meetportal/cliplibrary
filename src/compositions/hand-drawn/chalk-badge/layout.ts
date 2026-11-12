import type { ChalkBadgeProps } from '@/schemas';
import { CAPTION_FACE, type Measurer, SCRIPT_FACES } from './fonts';
import type { LogoState } from './use-logo';

export type Point = { x: number; y: number };

export type Sparkle = Point & { r: number };

type Box = { x: number; y: number; w: number; h: number };

export type BadgeLayout = {
  size: number;
  left: number;
  right: number;
  baseline: number;
  swoosh: string;
  sparkles: [Sparkle, Sparkle];
  wordSpan: [number, number];
  badgeSpan: [number, number];
  caption: { size: number; y: number; width: number };
  plate: Box | null;
  logo: Box | null;
};

export const WIPE = { x: 0.97, y: 0.243 } as const;

const UNIT = Math.hypot(WIPE.x, WIPE.y);

export const project = (x: number, y: number) => (WIPE.x * x + WIPE.y * y) / UNIT;

const CAPTION_MAX = 1640;
const LOGO_MAX_WIDTH = 520;
const SIDE_MARGIN = 110;
const MIN_SPARKLE = 26;

const swooshPath = (left: number, right: number, b: number, u: number, loop: boolean) => {
  const p = (x: number, y: number) => `${x.toFixed(1)} ${y.toFixed(1)}`;
  const start = `M ${p(left - 0.5 * u, b + 0.2 * u)}`;
  const run = `C ${p(left - 0.05 * u, b + 0.11 * u)} ${p(right - 0.3 * u, b + 0.17 * u)} ${p(right + 0.3 * u, b + 0.05 * u)}`;
  const curl = [
    `C ${p(right + 0.45 * u, b + 0.02 * u)} ${p(right + 0.52 * u, b - 0.15 * u)} ${p(right + 0.42 * u, b - 0.19 * u)}`,
    `C ${p(right + 0.32 * u, b - 0.23 * u)} ${p(right + 0.24 * u, b - 0.06 * u)} ${p(right + 0.38 * u, b + 0.08 * u)}`,
    `C ${p(right + 0.5 * u, b + 0.19 * u)} ${p(right + 0.74 * u, b + 0.17 * u)} ${p(right + 1 * u, b + 0.13 * u)}`,
  ];
  const tail = `C ${p(right + 0.55 * u, b)} ${p(right + 0.76 * u, b + 0.13 * u)} ${p(right + 1 * u, b + 0.12 * u)}`;
  return [start, run, ...(loop ? curl : [tail])].join(' ');
};

const logoBoxes = (props: ChalkBadgeProps, logo: LogoState, frame: Point) => {
  if (!props.lockup.show || logo === null) {
    return { plate: null, logo: null };
  }
  const tall = props.lockup.height * Math.min(1, 1.6 / Math.sqrt(logo.aspect));
  const h = Math.min(tall, LOGO_MAX_WIDTH / logo.aspect);
  const w = h * logo.aspect;
  const pad = props.lockup.showPlate ? Math.round(10 + 0.14 * h) : 0;
  const bottom = frame.y - props.lockup.bottom;
  const plate = {
    x: frame.x / 2 - w / 2 - pad,
    y: bottom - h - pad * 2,
    w: w + pad * 2,
    h: h + pad * 2,
  };
  return { plate, logo: { x: plate.x + pad, y: plate.y + pad, w, h } };
};

export const buildLayout = (
  props: ChalkBadgeProps,
  measure: Measurer,
  logo: LogoState,
  frame: Point,
): BadgeLayout => {
  const face = SCRIPT_FACES[props.word.font];
  const perSize = Math.max(0.01, measure(props.companyName, face));
  const fitWidth = Math.min(props.word.maxWidth, frame.x - 2 * SIDE_MARGIN - 1.5 * props.word.size);
  const size = Math.min(props.word.size, fitWidth / perSize);
  const width = perSize * size;
  const groupWidth = width + 1.5 * size;
  const left = frame.x / 2 - groupWidth / 2 + 0.5 * size;
  const right = left + width;
  const lift = props.lockup.show && logo !== null ? 46 : 0;
  const baseline = frame.y / 2 + 0.24 * size - lift + props.word.rise;
  const u = size;
  const scale = props.sparkles.size;
  const sparkles: [Sparkle, Sparkle] = [
    { x: right + 0.64 * u, y: baseline - 0.79 * u, r: Math.max(MIN_SPARKLE, 0.17 * u) * scale },
    {
      x: right + 0.88 * u,
      y: baseline - 0.53 * u,
      r: Math.max(MIN_SPARKLE / 2, 0.085 * u) * scale,
    },
  ];
  const wordSpan: [number, number] = [
    project(left - 0.15 * u, baseline - 0.95 * u),
    project(right + 0.25 * u, baseline + 0.4 * u),
  ];
  const badgeSpan: [number, number] = [
    project(left - 0.6 * u, baseline - 1 * u),
    project(right + 1.1 * u, baseline + 0.4 * u),
  ];
  const captionPer = Math.max(0.01, measure(props.tagline.toUpperCase(), CAPTION_FACE));
  const trackingPer = props.caption.tracking * Math.max(0, [...props.tagline].length - 1);
  const captionSize = Math.min(props.caption.size, CAPTION_MAX / (captionPer + trackingPer));
  return {
    size,
    left,
    right,
    baseline,
    swoosh: swooshPath(left, right, baseline, u, props.swoosh.loop),
    sparkles,
    wordSpan,
    badgeSpan,
    caption: {
      size: captionSize,
      y: props.caption.top,
      width: (captionPer + trackingPer) * captionSize,
    },
    ...logoBoxes(props, logo, frame),
  };
};
