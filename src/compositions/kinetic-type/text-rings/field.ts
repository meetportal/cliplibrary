import type { TextRingsProps } from '@/schemas';
import type { PhraseMetrics } from './fonts';

const TAU = Math.PI * 2;
const HALF_LINE = 0.62;
const MAX_GROW = 1.12;
const SPACING_MARGIN = 1.04;
const LAST_RING_AGE = 0.4;
const MIN_INTERVAL = 4;

export type RingKind = 'name' | 'tagline';

export type PhraseLayout = {
  kind: RingKind;
  metrics: PhraseMetrics;
  separator: PhraseMetrics;
  tracking: number;
  repeats: number;
  size: number;
  wordEm: number;
  unitEm: number;
};

export const layoutPhrase = (
  kind: RingKind,
  metrics: PhraseMetrics,
  separator: PhraseMetrics,
  tracking: number,
  gap: number,
  textSize: number,
): PhraseLayout => {
  const chars = [...metrics.text].length;
  const wordEm = metrics.width + tracking * chars;
  const separatorEm =
    separator.text === '' ? 0 : separator.width + tracking * [...separator.text].length;
  const unitEm = Math.max(0.2, wordEm + separatorEm + 2 * gap);
  const repeats = Math.max(1, Math.ceil(TAU / (textSize * unitEm * MAX_GROW)));
  return {
    kind,
    metrics,
    separator,
    tracking,
    repeats,
    size: TAU / (repeats * unitEm),
    wordEm,
    unitEm,
  };
};

type Clock = {
  tau: (frame: number) => number;
  frameAt: (tau: number) => number;
  end: number;
};

const settleClock = ({ settleAt, settleFrames }: TextRingsProps['timing']): Clock => {
  const span = Math.max(1, settleFrames);
  const end = settleAt + span / 3;
  return {
    end,
    tau: (frame) => {
      if (frame <= settleAt) {
        return frame;
      }
      const u = Math.min(1, (frame - settleAt) / span);
      return settleAt + (span * (1 - (1 - u) ** 3)) / 3;
    },
    frameAt: (tau) => {
      if (tau <= settleAt) {
        return tau;
      }
      const share = Math.min(1, (3 * (tau - settleAt)) / span);
      return settleAt + span * (1 - Math.cbrt(1 - share));
    },
  };
};

type RingPlan = {
  index: number;
  phrase: PhraseLayout;
  born: number;
  bornFrame: number;
  direction: number;
};

export type FieldPlan = {
  start: number;
  growth: number;
  clock: Clock;
  rings: RingPlan[];
};

export const planField = (
  props: TextRingsProps,
  phrases: { name: PhraseLayout | null; tagline: PhraseLayout | null },
  markEdge: number,
): FieldPlan | null => {
  const name = phrases.name ?? phrases.tagline;
  const tagline = phrases.tagline ?? phrases.name;
  if (name === null || tagline === null) {
    return null;
  }
  const { rings, spin, timing } = props;
  const widest = Math.max(name.size, tagline.size) * HALF_LINE;
  const spacing = Math.max(rings.spacing, ((1 + widest) / (1 - widest)) * SPACING_MARGIN);
  const start = (markEdge + rings.gap) / (1 - widest);
  const clock = settleClock(timing);
  const count = Math.round(rings.count);
  const interval = Math.max(
    MIN_INTERVAL,
    (clock.end - timing.firstRing) / Math.max(1, count - 1 + LAST_RING_AGE),
  );
  const turning = spin.clockwise ? 1 : -1;
  return {
    start,
    growth: Math.log(spacing) / interval,
    clock,
    rings: Array.from({ length: count }, (_, index) => {
      const born = timing.firstRing + index * interval;
      return {
        index,
        phrase: index % 2 === 0 ? name : tagline,
        born,
        bornFrame: clock.frameAt(born),
        direction: spin.alternate && index % 2 === 1 ? -turning : turning,
      };
    }),
  };
};

export type RingState = {
  plan: RingPlan;
  radius: number;
  angle: number;
  age: number;
};

const ringRadius = (field: FieldPlan, ring: RingPlan, frame: number) =>
  field.start * Math.exp(field.growth * Math.max(0, field.clock.tau(frame) - ring.born));

export const ringStates = (
  field: FieldPlan,
  props: TextRingsProps,
  frame: number,
  edge: number,
): RingState[] =>
  field.rings.flatMap((ring) => {
    if (frame < ring.bornFrame) {
      return [];
    }
    const radius = ringRadius(field, ring, frame);
    if (radius * (1 - ring.phrase.size * HALF_LINE) > edge) {
      return [];
    }
    let turned = 0;
    for (let step = Math.ceil(ring.bornFrame); step <= frame; step++) {
      turned += props.spin.speed / ringRadius(field, ring, step);
    }
    return [
      {
        plan: ring,
        radius,
        angle: ring.index * props.spin.offset + (ring.direction * turned * 360) / TAU,
        age: frame - ring.bornFrame,
      },
    ];
  });
