import { Easing } from 'remotion';
import type { ColorPillsProps } from '@/schemas';
import { ramp } from '../../kit/motion';

const ENTRY_LEAD = 14;
const CURSOR_ENTRY_SPAN = 0.9;
const CURSOR_EXIT_SPAN = 1.3;
const CREEP = 0.2;
const BREATHS = 3;
const BREATH_DEPTH = 0.45;

const inOut = Easing.inOut(Easing.cubic);
const PUSH_FLOOR = 0.15;
const push = (t: number) => inOut(t) * (1 - PUSH_FLOOR) + t * PUSH_FLOOR;
const out = Easing.out(Easing.cubic);

export type Timeline = {
  count: number;
  duration: number;
  timing: ColorPillsProps['timing'];
};

const entranceStart = (line: Timeline, index: number) => index * line.timing.stagger - ENTRY_LEAD;

export const entranceProgress = (line: Timeline, index: number, frame: number) => {
  const start = entranceStart(line, index);
  return ramp(frame, start, start + line.timing.entrance, out);
};

export const entranceFade = (line: Timeline, index: number, frame: number) => {
  const start = entranceStart(line, index);
  return ramp(frame, start, start + line.timing.entrance, inOut);
};

const arrival = (line: Timeline, index: number) =>
  line.timing.cursorAt + line.timing.move + index * line.timing.every;

export const cursorPosition = (line: Timeline, frame: number): number => {
  const { cursorAt, move, every } = line.timing;
  const glide = Math.min(move, every - 2);
  const first = arrival(line, 0);
  if (frame < first) {
    return -CURSOR_ENTRY_SPAN * (1 - ramp(frame, cursorAt, first, out));
  }
  const last = line.count - 1;
  const lastArrival = arrival(line, last);
  if (frame >= lastArrival) {
    const leave = lastArrival + every - glide;
    return (
      last + CURSOR_EXIT_SPAN * ramp(frame, leave, leave + glide * 1.4, Easing.in(Easing.cubic))
    );
  }
  const step = Math.floor((frame - first) / every);
  const moveStart = arrival(line, step) + every - glide;
  const stepped = step + ramp(frame, moveStart, moveStart + glide, inOut);
  const steady = (frame - first) / every;
  return stepped + (steady - stepped) * CREEP;
};

export const cursorOpacity = (line: Timeline, frame: number): number => {
  const { cursorAt, every, move } = line.timing;
  const fadeIn = ramp(frame, cursorAt - move / 2, cursorAt + move, Easing.inOut(Easing.sin));
  const glide = Math.min(move, every - 2);
  const leave = arrival(line, line.count - 1) + every - glide;
  const fadeOut = ramp(frame, leave + glide * 0.4, leave + glide * 1.4, inOut);
  return fadeIn * (1 - fadeOut);
};

export const hoverAmount = (line: Timeline, index: number, frame: number): number => {
  const { every, move } = line.timing;
  const glide = Math.min(move, every - 2);
  const reached = arrival(line, index);
  const leave = reached + every - glide;
  return (
    ramp(frame, reached - glide, reached, push) * (1 - ramp(frame, leave, leave + glide, push))
  );
};

export const pixelPath = (ideal: (frame: number) => number, frame: number): number => {
  let position = Math.round(ideal(0));
  for (let at = 1; at <= frame; at++) {
    const target = ideal(at);
    const distance = target - position;
    if (Math.abs(distance) >= 0.5) {
      const speed = Math.max(1, Math.round(Math.abs(target - ideal(at - 1))));
      position += Math.sign(distance) * Math.min(speed, Math.round(Math.abs(distance)));
    }
  }
  return position;
};

export const breath = (line: Timeline, index: number, frame: number): number =>
  1 -
  BREATH_DEPTH *
    (0.5 + 0.5 * Math.sin((frame / line.duration) * Math.PI * 2 * BREATHS - index * 1.05));
