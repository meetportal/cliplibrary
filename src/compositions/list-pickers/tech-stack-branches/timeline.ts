import { Easing } from 'remotion';
import type { TechStackBranchesProps } from '@/schemas';
import { clamp01, ramp } from '../../kit/motion';

const SWING = Easing.bezier(0.4, 0, 0.25, 1);
const SPIN = Easing.bezier(0.3, 0.35, 0.2, 1);

const PULSE_FRAMES = 14;
const PULSE_LEAD = 3;
const END_REACH = 0.36;
const MIN_CREEP = 1;
const SPIN_DRIFT = 0.8;

type Step = {
  start: number;
  swing: number;
  size: number;
  drift: number;
  steadyFrom: number;
  steadyTo: number;
  ease: (t: number) => number;
};

export type Timeline = {
  steps: Step[];
  last: { start: number; swing: number; land: number; creep: number };
  interval: number;
  lead: number;
  centre: number;
  spacing: number;
  landings: number[];
};

const moveCount = (props: TechStackBranchesProps, duration: number) =>
  Math.max(
    1,
    Math.floor((duration - props.timing.intro + props.timing.swing) / props.timing.interval) - 1,
  );

export const buildTimeline = (props: TechStackBranchesProps, duration: number): Timeline => {
  const { timing, wheel } = props;
  const interval = timing.interval;
  const moves = moveCount(props, duration);
  const count = props.items.length;
  const lead = timing.returnToFirst ? ((-moves % count) + count) % count : 0;
  const swing = Math.min(timing.swing, interval * 0.5);
  const first = timing.intro + interval - swing;
  const steps: Step[] = [
    {
      start: 0,
      swing: timing.intro,
      size: timing.spin,
      drift: Math.min(timing.spin * SPIN_DRIFT, (timing.drift * first) / interval),
      steadyFrom: 0,
      steadyTo: first,
      ease: SPIN,
    },
    ...Array.from({ length: moves - 1 }, (_, at) => {
      const start = first + at * interval;
      return {
        start,
        swing,
        size: 1,
        drift: timing.drift,
        steadyFrom: start,
        steadyTo: start + interval,
        ease: SWING,
      };
    }),
  ];
  const lastStart = first + (moves - 1) * interval;
  const hold = Math.max(1, duration - 1 - (lastStart + swing));
  const holdSpeed = (timing.drift * wheel.spacing) / interval;
  const creep = Math.max(
    MIN_CREEP,
    Math.floor(Math.min(holdSpeed, (END_REACH * wheel.spacing) / hold)),
  );
  return {
    steps,
    last: {
      start: lastStart,
      swing,
      land: (lead + moves) * wheel.spacing - (creep * hold) / 2,
      creep,
    },
    interval,
    lead,
    centre: (timing.drift * (1 - swing / interval)) / 2,
    spacing: wheel.spacing,
    landings: [
      timing.intro,
      ...steps.slice(1).map((step) => step.start + step.swing),
      lastStart + swing,
    ],
  };
};

const stepAt = (frame: number, step: Step) => {
  const eased = ramp(frame, step.start, step.start + step.swing, step.ease);
  const steady = clamp01((frame - step.steadyFrom) / (step.steadyTo - step.steadyFrom));
  return (step.size - step.drift) * eased + step.drift * steady;
};

const heldOffset = (frame: number, line: Timeline) => {
  const raw = line.steps.reduce(
    (sum, step) => sum + stepAt(frame, step),
    line.lead - (line.steps[0]?.size ?? 0),
  );
  return (raw + line.centre) * line.spacing;
};

export const wheelOffset = (frame: number, line: Timeline): number => {
  const { last } = line;
  if (frame < last.start) {
    return heldOffset(frame, line);
  }
  const start = heldOffset(last.start, line);
  const glide = last.creep * (frame - last.start);
  const jump = last.land - start - last.creep * last.swing;
  return start + glide + jump * ramp(frame, last.start, last.start + last.swing, SWING);
};

export const pulseAt = (frame: number, line: Timeline): number | null => {
  for (const landing of line.landings) {
    const start = landing - PULSE_LEAD - PULSE_FRAMES * 0.5;
    if (frame >= start && frame <= start + PULSE_FRAMES) {
      return (frame - start) / PULSE_FRAMES;
    }
  }
  return null;
};
