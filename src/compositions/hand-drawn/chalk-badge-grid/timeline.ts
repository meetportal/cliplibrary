import { Easing } from 'remotion';
import { clamp01 } from '../../kit/motion';

export type BadgeState = {
  shape: number;
  write: number;
  unwrite: number;
  ornament: number;
  live: number;
  pop: number;
};

export type GridTiming = {
  drawFrames: number;
  stagger: number;
  eraseAtEnd: boolean;
  total: number;
};

const SLOT_COUNT = 12;
const TAIL = 6;

const span = (value: number, from: number, to: number) => clamp01((value - from) / (to - from));

const smooth = Easing.inOut(Easing.sin);
const settle = Easing.out(Easing.cubic);

const SETTLE_FRAMES = 18;
const LAST_ERASED = SLOT_COUNT - 2;

const startOf = (slot: number, timing: GridTiming) =>
  slot === 0 ? -(timing.drawFrames + SETTLE_FRAMES) : slot * timing.stagger;

const eraseOrder = (slot: number) => (slot === 1 ? LAST_ERASED : slot - 2);

const eraseFramesFor = (drawFrames: number) => drawFrames;

export const badgeState = (frame: number, slot: number, timing: GridTiming): BadgeState => {
  const start = startOf(slot, timing);
  const erases = timing.eraseAtEnd && slot !== 0;
  const draw = clamp01((frame - start) / timing.drawFrames);
  const eraseFrames = eraseFramesFor(timing.drawFrames);
  const lastStart = timing.total - TAIL - eraseFrames;
  const eraseStart = lastStart - (LAST_ERASED - eraseOrder(slot)) * timing.stagger;
  const erase = erases ? clamp01((frame - eraseStart) / eraseFrames) : 0;
  const shapeIn = smooth(span(draw, 0, 0.64));
  const shapeOut = smooth(span(erase, 0.36, 1));
  const ornamentIn = smooth(span(draw, 0.52, 1));
  const ornamentOut = smooth(span(erase, 0, 0.5));
  const settled = clamp01((frame - start - timing.drawFrames) / SETTLE_FRAMES);
  const leaving = erases ? clamp01((eraseStart - frame) / 12) : 1;
  return {
    shape: shapeIn * (1 - shapeOut),
    write: smooth(span(draw, 0.28, 0.86)),
    unwrite: smooth(span(erase, 0, 0.72)),
    ornament: ornamentIn * (1 - ornamentOut),
    live: smooth(settled) * smooth(leaving),
    pop: settle(span(draw, 0, 0.5)) * (1 - shapeOut),
  };
};
