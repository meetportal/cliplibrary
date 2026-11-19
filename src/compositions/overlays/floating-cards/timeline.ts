import { Easing } from 'remotion';
import type { FloatingCardsProps } from '@/schemas';
import { clamp01 } from '../../kit/motion';

const FADE_SHARE = 0.55;
const PHASE_START = 0.286;
const PHASE_STEP = 0.25;
const DRIFT_SHARE = 0.3;
const SWAY_DRIFT = 0.2;
const START_SCALE = 0.96;
const SINK_SHARE = 0.6;

const arrive = Easing.out(Easing.cubic);
const appear = Easing.inOut(Easing.quad);
const dipCurve = Easing.inOut(Easing.quad);
const sinkCurve = Easing.in(Easing.cubic);

export type CardMotion = {
  x: number;
  y: number;
  angle: number;
  scale: number;
  opacity: number;
  lift: number;
};

export const dipProgress = (props: FloatingCardsProps, frame: number, duration: number) => {
  const length = props.timing.exit;
  return length <= 0 ? 0 : dipCurve(clamp01((frame - (duration - length)) / length));
};

export const cardMotion = (
  props: FloatingCardsProps,
  index: number,
  frame: number,
  duration: number,
): CardMotion => {
  const { timing, float } = props;
  const start = index * timing.stagger - timing.lead;
  const progress = clamp01((frame - start) / timing.entrance);
  const settled = arrive(progress);
  const shown = appear(clamp01((frame - start) / (timing.entrance * FADE_SHARE)));
  const away = 1 - settled;
  const turn = 2 * Math.PI * (frame / float.cycle - (PHASE_START - PHASE_STEP * index));
  const bob = -Math.cos(turn);
  const leave = props.showBackground ? 0 : dipProgress(props, frame, duration);
  const sink = sinkCurve(leave) * timing.rise * SINK_SHARE;
  return {
    x: away * timing.rise * DRIFT_SHARE + Math.sin(turn) * float.height * SWAY_DRIFT,
    y: away * timing.rise + bob * float.height + sink,
    angle: Math.sin(turn + Math.PI / 3) * float.sway,
    scale: START_SCALE + (1 - START_SCALE) * settled,
    opacity: shown * (1 - leave),
    lift: (1 - bob) / 2,
  };
};
