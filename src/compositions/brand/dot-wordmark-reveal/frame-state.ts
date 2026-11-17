import { Easing } from 'remotion';
import { mixLab } from '../../kit/lab-color';
import { lerp, ramp } from '../../kit/motion';
import { type Blob, caretAt, fillAt, type Stage } from './geometry';
import type { LetterState } from './letters';
import { rollAt, sweepAt, trailFade } from './roll';
import { riseIn } from './timeline';

export type Writer = { x0: number; x1: number; y: number; reveals: number[] };

const LETTER_RISE = 0.16;
const LETTER_SWEEP = 0.9;

const pulseScale = (frame: number, start: number, end: number, amount: number) => {
  if (frame < start || frame >= end || amount <= 0) {
    return 1;
  }
  const length = Math.max(1, end - start);
  const cycles = Math.max(1, Math.round(length / 30));
  const wave = Math.sin((Math.PI * cycles * (frame - start)) / length) ** 2;
  return 1 + 0.3 * amount * wave;
};

const letterStates = (stage: Stage, writer: Writer, frame: number): LetterState[] => {
  const { schedule, lockup } = stage;
  const count = lockup.letters.length;
  const rise = Math.round(lockup.nameSize * LETTER_RISE);
  return lockup.letters.map((_, at) => {
    if (frame < schedule.caretIn) {
      return { opacity: 0, offset: 0, shift: 0 };
    }
    const reveal = writer.reveals[at] ?? schedule.writeEnd;
    const sweep = sweepAt(schedule, frame, at, count);
    return {
      opacity: ramp(frame, reveal, reveal + 6, Easing.inOut(Easing.sin)) * (1 - sweep.fade),
      offset: riseIn(frame, reveal, 10, rise),
      shift: sweep.move * lockup.nameSize * LETTER_SWEEP,
    };
  });
};

const plateState = (stage: Stage, frame: number, fill: Blob, hasLogo: boolean) => {
  const { schedule, lockup, palette } = stage;
  const color = hasLogo ? palette.surface : palette.primary;
  const turn = {
    dx: fill.cx - lockup.tile.cx,
    dy: fill.cy - lockup.tile.cy,
    rotation: fill.rotation,
  };
  if (frame >= schedule.swellStart) {
    const swell = ramp(frame, schedule.swellStart, schedule.swellEnd, Easing.inOut(Easing.cubic));
    return {
      box: lockup.plate,
      color,
      scale: lerp(0.85, 1, swell) * fill.scale,
      opacity: swell,
      logo: ramp(frame, schedule.logoStart, schedule.logoStart + 12, Easing.inOut(Easing.cubic)),
      ...(frame >= schedule.foldEnd ? turn : { dx: 0, dy: 0, rotation: 0 }),
    };
  }
  if (frame >= schedule.collapseEnd) {
    return null;
  }
  const shrink = Math.min(fill.w / lockup.tile.w, fill.h / lockup.tile.h);
  return {
    box: lockup.plate,
    color,
    opacity: 1,
    scale: Math.max(0, Math.min(1, (shrink - 0.12) / 0.88)),
    logo: 1,
    ...turn,
  };
};

const onTile = (stage: Stage, fill: Blob) => {
  const { lockup } = stage;
  const ox = ((lockup.accent.cx - lockup.tile.cx) * fill.w * fill.scale) / lockup.tile.w;
  const oy = ((lockup.accent.cy - lockup.tile.cy) * fill.h * fill.scale) / lockup.tile.h;
  const angle = (fill.rotation * Math.PI) / 180;
  return {
    x: fill.cx + ox * Math.cos(angle) - oy * Math.sin(angle),
    y: fill.cy + ox * Math.sin(angle) + oy * Math.cos(angle),
  };
};

const accentState = (stage: Stage, frame: number, pulse: number, fill: Blob) => {
  const { schedule, lockup } = stage;
  if (frame < schedule.accentStart) {
    const gone = ramp(
      frame,
      schedule.collapseStart,
      schedule.collapseStart + 12,
      Easing.in(Easing.cubic),
    );
    return { ...onTile(stage, fill), scale: 1 - gone };
  }
  const place =
    frame >= schedule.foldEnd ? onTile(stage, fill) : { x: lockup.accent.cx, y: lockup.accent.cy };
  return {
    ...place,
    scale:
      ramp(frame, schedule.accentStart, schedule.accentStart + 10, Easing.inOut(Easing.cubic)) *
      pulseScale(frame, schedule.foldEnd + 2, schedule.exitStart, pulse) *
      fill.scale,
  };
};

const ringState = (stage: Stage, frame: number, pulse: number) => {
  const { schedule, lockup } = stage;
  if (frame < schedule.foldEnd - 6 || pulse <= 0) {
    return null;
  }
  const ring = ramp(frame, schedule.foldEnd - 6, schedule.foldEnd + 26, Easing.out(Easing.quad));
  const strength = Math.min(1, pulse * 2);
  const width = Math.max(2, 7 * (1 - ring) * strength);
  const grow = 64 * ring;
  if (ring >= 1) {
    return null;
  }
  return {
    width,
    color: mixLab(stage.palette.ring, stage.palette.background, Math.max(ring ** 2, 1 - strength)),
    box: {
      ...lockup.tile,
      w: lockup.tile.w + grow * 2,
      h: lockup.tile.h + grow * 2,
      r: lockup.tile.r + grow,
    },
  };
};

const glowAt = (stage: Stage, frame: number) => {
  const { schedule } = stage;
  if (frame < schedule.collapseEnd) {
    return 1 - ramp(frame, schedule.collapseStart, schedule.collapseEnd);
  }
  return ramp(frame, schedule.growStart, schedule.writeStart, Easing.inOut(Easing.sin));
};

export const frameState = (
  stage: Stage,
  writer: Writer,
  frame: number,
  pulse: number,
  hasLogo: boolean,
) => {
  const fill = fillAt(stage, frame);
  const roll = rollAt(stage.lockup.tile, stage.frameWidth, stage.schedule, frame);
  return {
    fill,
    letters: letterStates(stage, writer, frame),
    caret: caretAt(stage, frame, writer.x0, writer.x1, writer.y),
    plate: plateState(stage, frame, fill, hasLogo),
    accent: accentState(stage, frame, pulse, fill),
    ring: ringState(stage, frame, pulse),
    trail: fill.shift === 0 ? 0 : roll.speed,
    trailFade: trailFade(stage.schedule, frame),
    glow: glowAt(stage, frame),
    glowShift: (stage.frameHeight * frame) / (stage.schedule.last + 1),
  };
};
