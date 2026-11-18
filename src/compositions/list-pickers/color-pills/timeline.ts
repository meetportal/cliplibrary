import { Easing } from 'remotion';
import type { ColorPillsProps } from '@/schemas';
import { ramp } from '../../kit/motion';

const BREATHS = 3;
const BREATH_DEPTH = 0.45;
const ENTRY_ROWS = 2;
const EXIT_ROWS = 2;
const LEAD_SCALE = 1.25;
const DWELL = 2;
const FADE_SHARE = 0.4;
const REACH = 0.678;
const REACH_POWER = 1.603;
const SETTLE_LEAD = 20;
const CURSOR_FADE = [0.04, 0.24] as const;
const CURSOR_ARRIVE = 9;

const glide = Easing.inOut(Easing.cubic);
const rise = Easing.bezier(0.22, 0, 0.12, 1);
const soft = Easing.inOut(Easing.sin);

export type Timeline = {
  count: number;
  duration: number;
  timing: ColorPillsProps['timing'];
};

type Walk = {
  home: number;
  every: number;
  move: number;
  lead: number;
  leave: number;
  dipStart: number;
};

const walkOf = (line: Timeline): Walk => {
  const { cursorAt, every, move, exit } = line.timing;
  const dipStart = line.duration - 1 - exit;
  const lead = Math.round(move * LEAD_SCALE);
  const home = cursorAt + lead;
  const latestLeave = dipStart - lead + DWELL;
  const span = latestLeave - home;
  const rest = Math.max(DWELL, every - move);
  const stretched = (span - rest) / Math.max(1, line.count - 1);
  const fit = (span + move) / Math.max(1, line.count);
  const step = stretched > every ? stretched : Math.max(DWELL + 4, Math.min(every, fit));
  const glideFrames = stretched > every ? step - rest : Math.min(move, step - DWELL);
  const leave = home + (line.count - 1) * step + step - glideFrames;
  return {
    home,
    every: step,
    move: glideFrames,
    lead: Math.round(Math.min(glideFrames, move) * LEAD_SCALE),
    leave,
    dipStart,
  };
};

const entranceStart = (line: Timeline, index: number) => (index - 1) * line.timing.stagger;

export const entranceProgress = (line: Timeline, index: number, frame: number) => {
  if (index === 0) {
    return 1;
  }
  const start = entranceStart(line, index);
  return ramp(frame, start, start + line.timing.entrance, rise);
};

export const entranceFade = (line: Timeline, index: number, frame: number) => {
  if (index === 0) {
    return 1;
  }
  const start = entranceStart(line, index);
  return ramp(frame, start, start + Math.max(3, line.timing.entrance * FADE_SHARE), soft);
};

const CRUISE_AFTER = 1.2;

const travel = (at: number, length: number, move: number): number => {
  if (at <= 0) {
    return 0;
  }
  if (at >= length) {
    return 1;
  }
  if (length <= move * CRUISE_AFTER) {
    return glide(at / length);
  }
  const ease = Math.min(length / 2, move / 2);
  const speed = 1 / (length - ease);
  const speedUp = (t: number) =>
    speed * (t / 2 - (ease / (2 * Math.PI)) * Math.sin((Math.PI * t) / ease));
  if (at < ease) {
    return speedUp(at);
  }
  if (at > length - ease) {
    return 1 - speedUp(length - at);
  }
  return speed * (ease / 2 + at - ease);
};

export const focusAt = (line: Timeline, frame: number): number => {
  const walk = walkOf(line);
  const { cursorAt } = line.timing;
  if (frame < walk.home) {
    return -ENTRY_ROWS * (1 - ramp(frame, cursorAt, walk.home, glide));
  }
  const last = line.count - 1;
  if (frame >= walk.leave) {
    return last + EXIT_ROWS * ramp(frame, walk.leave, walk.leave + walk.lead, glide);
  }
  const step = Math.min(last - 1, Math.floor((frame - walk.home) / walk.every));
  const start = walk.home + step * walk.every + walk.every - walk.move;
  return step + travel(frame - start, walk.move, line.timing.move);
};

const REACH_FLOOR = Math.exp(-((ENTRY_ROWS / REACH) ** REACH_POWER));

export const touchOf = (focus: number, index: number): number => {
  const distance = Math.abs(focus - index);
  if (distance >= ENTRY_ROWS) {
    return 0;
  }
  const near = Math.exp(-((distance / REACH) ** REACH_POWER));
  return Math.max(0, (near - REACH_FLOOR) / (1 - REACH_FLOOR));
};

export const cursorPresence = (line: Timeline, frame: number): number => {
  const walk = walkOf(line);
  const arrive = ramp(frame, walk.home - CURSOR_ARRIVE, walk.home - 1, soft);
  const focus = focusAt(line, frame);
  const last = line.count - 1;
  const depart = ramp(focus, last + CURSOR_FADE[0], last + CURSOR_FADE[1], soft);
  return arrive * (1 - depart);
};

export const cursorDrop = (line: Timeline, frame: number): number => {
  const walk = walkOf(line);
  return 1 - ramp(frame, walk.home - CURSOR_ARRIVE, walk.home, glide);
};

export const dipProgress = (line: Timeline, frame: number): number => {
  const { dipStart } = walkOf(line);
  return line.timing.exit > 0 ? ramp(frame, dipStart, line.duration - 1, soft) : 0;
};

export const settleProgress = (line: Timeline, frame: number): number => {
  const { dipStart } = walkOf(line);
  return line.timing.exit > 0 ? ramp(frame, dipStart - SETTLE_LEAD, line.duration - 1, soft) : 0;
};

export const breath = (line: Timeline, index: number, frame: number): number =>
  1 -
  BREATH_DEPTH *
    (0.5 + 0.5 * Math.sin((frame / line.duration) * Math.PI * 2 * BREATHS - index * 1.05));
