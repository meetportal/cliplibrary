import { Easing } from 'remotion';
import type { EchoStackProps } from '@/schemas';
import { clamp01 } from '../../kit/motion';

const MIN_HOLD = 45;
const FADE_SHARE = 0.45;
const PULSE_EXTRA = 12;
const SHORT_RISE = 0.5;

type Motion = EchoStackProps['motion'];

const arrive = Easing.out(Easing.cubic);
const appear = Easing.out(Easing.quad);
const leave = Easing.in(Easing.quad);

const progress = (frame: number, start: number, frames: number) =>
  clamp01((frame - start) / Math.max(1, frames));

const bump = (t: number) => (t <= 0 || t >= 1 ? 0 : (1 - Math.cos(2 * Math.PI * t)) / 2);

const wrap = (value: number, length: number) => ((value % length) + length) % length;

export type Plan = {
  hero: number;
  enter: number[];
  exit: number[];
  holdStart: number;
  exitBase: number;
  driftTop: number;
  aloneStart: number;
  aloneLength: number;
  driftBottom: number;
  duration: number;
};

export const buildPlan = (
  lines: number,
  motion: Motion,
  duration: number,
  endShare: number,
): Plan => {
  const hero = Math.floor((lines - 1) / 2);
  const rank = (at: number) => (at === hero ? hero - 1 : at < hero ? at : at - 1);
  const last = Math.max(0, lines - 2);
  const enter = Array.from(
    { length: lines },
    (_, at) => motion.startDelay + rank(at) * motion.stagger,
  );
  const holdStart = motion.startDelay + last * motion.stagger + motion.riseFrames;
  const outLength = last * motion.stagger + motion.exitFrames;
  const latest = duration - 1 - outLength;
  const wanted = duration - 1 - Math.round(motion.endHold * endShare) - outLength;
  const exitBase = Math.min(latest, Math.max(holdStart + MIN_HOLD, wanted));
  const exit = enter.map((_, at) => exitBase + rank(at) * motion.stagger);
  return {
    hero,
    enter,
    exit,
    holdStart,
    exitBase,
    driftBottom: (motion.startDelay + holdStart) / 2,
    driftTop: exitBase + outLength / 2,
    aloneStart: exitBase + outLength,
    aloneLength: Math.max(1, duration - exitBase - outLength + motion.startDelay),
    duration,
  };
};

export type EchoState = { visible: boolean; opacity: number; shift: number; blur: number };

export const echoState = (
  frame: number,
  at: number,
  plan: Plan,
  motion: Motion,
  room: number,
): EchoState => {
  const enter = plan.enter[at] ?? 0;
  const exit = plan.exit[at] ?? plan.duration;
  if (frame < enter || frame >= exit + motion.exitFrames) {
    return { visible: false, opacity: 0, shift: 0, blur: 0 };
  }
  const lift = Math.min(motion.rise, room);
  const riseShare = motion.rise > 0 ? Math.max(SHORT_RISE, lift / motion.rise) : 1;
  const rising = arrive(progress(frame, enter, motion.riseFrames * riseShare));
  const shown = appear(progress(frame, enter, motion.riseFrames * FADE_SHARE));
  const gone = leave(progress(frame, exit, motion.exitFrames));
  return {
    visible: true,
    opacity: shown * (1 - gone),
    shift: lift * (1 - rising) + Math.min(motion.exitDrop, room) * gone,
    blur: motion.exitBlur * gone,
  };
};

export const heroScale = (
  frame: number,
  plan: Plan,
  motion: Motion,
  band: { pulse: number; breath: number },
) => {
  const length = motion.riseFrames + PULSE_EXTRA;
  const start = plan.driftBottom - length / 2;
  const end = plan.driftTop - length / 2;
  const alone = wrap(frame - plan.aloneStart, plan.duration) / plan.aloneLength;
  return (
    1 +
    band.pulse * (bump(progress(frame, start, length)) + bump(progress(frame, end, length))) +
    band.breath * bump(alone)
  );
};

export const driftAt = (frame: number, plan: Plan, amount: number) => {
  const rising = Math.max(1, plan.driftTop - plan.driftBottom);
  const falling = Math.max(1, plan.duration - rising);
  const since = wrap(frame - plan.driftBottom, plan.duration);
  return since <= rising
    ? amount * Math.cos((Math.PI * since) / rising)
    : -amount * Math.cos((Math.PI * (since - rising)) / falling);
};
