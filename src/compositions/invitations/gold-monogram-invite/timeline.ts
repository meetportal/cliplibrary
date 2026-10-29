import { accelerate, settle, smooth, tween } from '../../promo/timing';

export const QUOTE = {
  fadeIn: [0, 20] as [number, number],
  firstStart: 18,
  firstOut: [224, 248] as [number, number],
  secondStart: 258,
  paperLead: 352,
  paperScript: [392, 468] as [number, number],
  end: [548, 612] as [number, number],
};

export const TITLE = {
  enter: [540, 612] as [number, number],
  backdrop: [556, 626] as [number, number],
  flourish: [560, 650] as [number, number],
  eyebrow: 622,
  tail: 640,
  exit: [722, 756] as [number, number],
};

export const STAGE = {
  enter: [752, 812] as [number, number],
  push: [752, 1040] as [number, number],
  lift: [870, 1000] as [number, number],
  burstsFrom: 905,
  sparklersFrom: 960,
  plaque: 1000,
  glint: [1070, 1124] as [number, number],
  exit: [1196, 1234] as [number, number],
};

export const LOTUS = {
  streak: [1222, 1306] as [number, number],
  mandala: [1250, 1306] as [number, number],
  dancer: [1252, 1312] as [number, number],
  text: 1304,
  exit: [1420, 1452] as [number, number],
};

export const RING = {
  vine: [1452, 1512] as [number, number],
  text: 1462,
  ring: [1496, 1546] as [number, number],
  couple: [1504, 1556] as [number, number],
  wipe: [1616, 1664] as [number, number],
};

export const BAND = {
  open: [1660, 1700] as [number, number],
  content: 1700,
  contentOut: [1792, 1816] as [number, number],
  save: [1808, 1850] as [number, number],
};

export const fadeIn = (frame: number, start: number, length = 30): number =>
  tween(frame, [start, start + length], [0, 1], settle);

export const fadeOut = (frame: number, [from, to]: [number, number]): number =>
  tween(frame, [from, to], [1, 0], smooth);

export const visible = (
  frame: number,
  start: number,
  length: number,
  out: [number, number],
): number => Math.min(fadeIn(frame, start, length), fadeOut(frame, out));

export const blurIn = (frame: number, start: number, length = 30, radius = 10): number =>
  tween(frame, [start, start + length], [radius, 0], settle);

export const blurOut = (frame: number, [from, to]: [number, number], radius = 10): number =>
  tween(frame, [from, to], [0, radius], accelerate);

export const progress = (frame: number, [from, to]: [number, number], easing = smooth): number =>
  tween(frame, [from, to], [0, 1], easing);
