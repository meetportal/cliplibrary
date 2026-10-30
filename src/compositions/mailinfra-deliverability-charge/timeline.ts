import type { MailinfraDeliverabilityChargeProps } from '@/schemas';
import { land, launch, settle, smooth, turn, tween } from '../promo/timing';

type Timing = MailinfraDeliverabilityChargeProps['timing'];

export interface Beats {
  chargeStart: number;
  fullAt: number;
  unplugAt: number;
  drainEnd: number;
  shiftEnd: number;
}

export const beatsOf = (timing: Timing, shiftFrames: number): Beats => {
  const chargeStart = timing.chargeStart;
  const fullAt = Math.max(timing.fullAt, chargeStart + 12);
  const unplugAt = Math.max(timing.unplugAt, fullAt + 8);
  return {
    chargeStart,
    fullAt,
    unplugAt,
    drainEnd: unplugAt + timing.drainFrames,
    shiftEnd: chargeStart + shiftFrames,
  };
};

export const chargeAt = (frame: number, beats: Beats): number =>
  frame < beats.unplugAt
    ? tween(frame, [beats.chargeStart, beats.fullAt], [0, 1], turn)
    : tween(frame, [beats.unplugAt, beats.drainEnd], [1, 0], smooth);

export const glowAt = (frame: number, beats: Beats): number =>
  frame < beats.unplugAt
    ? tween(frame, [beats.chargeStart, beats.shiftEnd], [0, 1], smooth)
    : tween(frame, [beats.unplugAt, beats.drainEnd], [1, 0], smooth);

export const burstAt = (frame: number, beats: Beats, pulseFrames: number): number =>
  tween(frame, [beats.fullAt - 8, beats.fullAt + 6], [0, 1]) *
  (1 - tween(frame, [beats.fullAt + 6, beats.fullAt + 6 + pulseFrames], [0, 1]));

export const pulseAt = (frame: number, beats: Beats, pulseFrames: number, delay = 0): number =>
  tween(frame, [beats.fullAt + delay, beats.fullAt + delay + pulseFrames], [0, 1], settle);

const SEAT_SPEED = 4;

export interface PlugTiming {
  start: number;
  landed: number;
  release: number;
  gone: number;
}

export const plugTiming = (timing: Timing, beats: Beats, order: number): PlugTiming => {
  const start = timing.plugIn + order * timing.stagger;
  const release = beats.unplugAt + order * Math.round(timing.stagger * 0.5);
  return {
    start,
    landed: start + timing.plugFrames,
    release,
    gone: release + timing.unplugFrames,
  };
};

export const plugTravel = (frame: number, plug: PlugTiming, length: number): number =>
  frame < plug.release
    ? land(frame, [plug.start, plug.landed], [0, length], SEAT_SPEED)
    : launch(frame, [plug.release, plug.gone], [length, 0], SEAT_SPEED);

export const sparkLife = (frame: number, plug: PlugTiming): number =>
  tween(frame, [plug.landed, plug.landed + 10], [0, 1]) *
  (1 - tween(frame, [plug.release - 10, plug.release], [0, 1]));

export const clickAt = (frame: number, plug: PlugTiming): number =>
  tween(frame, [plug.landed - 2, plug.landed + 2], [0, 1]) *
  (1 - tween(frame, [plug.landed + 2, plug.landed + 26], [0, 1], settle));
