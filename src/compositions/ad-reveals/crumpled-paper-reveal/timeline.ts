import { Easing } from 'remotion';
import { lerp, ramp } from '../../kit/motion';

export const BEATS = {
  crumpleStart: 1,
  crumpleEnd: 43,
  openStart: 44,
  openEnd: 106,
  pullBackEnd: 52,
  pushStart: 96,
  copyOut: [7, 23],
  headlineIn: [84, 104],
  logoIn: [90, 108],
  taglineIn: [96, 116],
  nameIn: [102, 122],
} as const;

const inOut = Easing.inOut(Easing.cubic);
const gentle = Easing.inOut(Easing.sin);
const open = Easing.bezier(0.25, 0.04, 0.4, 1);

export const crumpleAt = (frame: number): number =>
  ramp(frame, BEATS.crumpleStart, BEATS.crumpleEnd, Easing.inOut(Easing.quad)) -
  ramp(frame, BEATS.openStart, BEATS.openEnd, open);

export const squeezeAt = (frame: number): number =>
  ramp(frame, BEATS.crumpleStart + 10, BEATS.crumpleEnd, inOut) -
  ramp(frame, BEATS.openStart - 4, BEATS.openStart + 22, inOut);

export const turnAt = (frame: number, spin: number): number => {
  const into = ramp(frame, BEATS.crumpleStart + 4, BEATS.openStart + 6, gentle);
  const back = ramp(frame, BEATS.openStart - 2, BEATS.openEnd - 6, inOut);
  return spin * into * (1 - back);
};

export const centerAt = (frame: number) => {
  const into = ramp(frame, BEATS.crumpleStart + 8, BEATS.openStart + 4, gentle);
  const back = ramp(frame, BEATS.openStart, BEATS.openEnd - 4, inOut);
  const amount = into * (1 - back);
  return { x: lerp(540, 516, amount), y: lerp(960, 1010, amount) };
};

const CLOSE = 1.12;

export type Camera = { scale: number; wall: number };

export const cameraAt = (frame: number, push: number, durationInFrames: number): Camera => {
  const rest = CLOSE / (1 + push);
  const pullBack = ramp(frame, 0, BEATS.pullBackEnd, gentle);
  const pushIn = ramp(frame, BEATS.pushStart, durationInFrames - 1, Easing.inOut(Easing.quad));
  const scale = lerp(rest, CLOSE, 1 - pullBack + pushIn);
  return { scale, wall: 1 + 0.5 * (scale - rest) };
};

export type CopyState = { opacity: number; lift: number };

export const copyAt = (frame: number, window: readonly [number, number]): CopyState => {
  const out = ramp(frame, BEATS.copyOut[0], BEATS.copyOut[1], Easing.inOut(Easing.quad));
  const back = ramp(frame, window[0], window[1], Easing.inOut(Easing.quad));
  return { opacity: 1 - out + back, lift: out * (1 - back) };
};

export const printScaleAt = (frame: number, fold: (crumple: number) => number): number =>
  1 - 0.6 * fold(crumpleAt(frame));
