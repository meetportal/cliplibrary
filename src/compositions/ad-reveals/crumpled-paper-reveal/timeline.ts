import { Easing } from 'remotion';
import { clamp01, lerp, ramp } from '../../kit/motion';

export const BEATS = {
  crumpleStart: 6,
  crumpleEnd: 48,
  openStart: 66,
  openEnd: 114,
  headlineIn: [84, 104],
  logoIn: [90, 108],
  taglineIn: [96, 116],
  nameIn: [102, 122],
} as const;

const inOut = Easing.inOut(Easing.cubic);
const open = Easing.bezier(0.18, 0.72, 0.28, 1);

export const crumpleAt = (frame: number): number => {
  if (frame < BEATS.openStart) {
    return ramp(frame, BEATS.crumpleStart, BEATS.crumpleEnd, inOut);
  }
  return 1 - ramp(frame, BEATS.openStart, BEATS.openEnd, open);
};

export const squeezeAt = (frame: number): number =>
  ramp(frame, BEATS.crumpleStart + 10, BEATS.crumpleEnd, inOut) -
  ramp(frame, BEATS.openStart - 4, BEATS.openStart + 20, inOut);

export const turnAt = (frame: number, spin: number): number => {
  const into = ramp(frame, BEATS.crumpleStart + 8, BEATS.openStart, inOut);
  const back = ramp(frame, BEATS.openStart, BEATS.openStart + 30, Easing.out(Easing.cubic));
  return spin * into * (1 - back);
};

export const centerAt = (frame: number) => {
  const into = ramp(frame, BEATS.crumpleStart + 10, BEATS.crumpleEnd, inOut);
  const back = ramp(frame, BEATS.openStart, BEATS.openStart + 32, Easing.out(Easing.cubic));
  const amount = into * (1 - back);
  return { x: lerp(540, 516, amount), y: lerp(960, 1010, amount) };
};

export const copyAt = (frame: number, window: readonly [number, number]): number => {
  const out = 1 - clamp01((crumpleAt(frame) - 0.02) / 0.26);
  const back = ramp(frame, window[0], window[1], Easing.inOut(Easing.quad));
  return frame < BEATS.openStart ? out : back;
};

export const printScaleAt = (frame: number, fold: (crumple: number) => number): number =>
  frame < BEATS.openStart ? 1 - 0.6 * fold(crumpleAt(frame)) : 1;
