import { Easing } from 'remotion';
import { mixLab } from '../../kit/lab-color';
import { lerp, ramp } from '../../kit/motion';
import { type Blob, caretAt, fillAt, type Stage } from './geometry';
import type { LetterState } from './letters';
import { pixelRise } from './timeline';

export type Writer = { x0: number; x1: number; y: number; reveals: number[] };

const pulseScale = (frame: number, start: number, last: number, amount: number) => {
  if (frame < start || amount <= 0) {
    return 1;
  }
  const length = Math.max(1, last - start);
  const cycles = Math.max(1, Math.round(length / 30));
  const wave = Math.sin((Math.PI * cycles * (frame - start)) / length) ** 2;
  return 1 + 0.3 * amount * wave;
};

const letterStates = (stage: Stage, writer: Writer, frame: number): LetterState[] => {
  const { schedule, lockup } = stage;
  const stagger = Math.min(1, 10 / Math.max(1, lockup.letters.length));
  return lockup.letters.map((_, at) => {
    if (frame < schedule.caretIn) {
      const start = schedule.collapseStart + at * stagger;
      const q = ramp(frame, start, start + 8, Easing.in(Easing.quad));
      return { opacity: 1 - q, offset: Math.round(20 * q * q) };
    }
    const reveal = writer.reveals[at] ?? schedule.writeEnd;
    return { opacity: ramp(frame, reveal, reveal + 5), offset: pixelRise(frame, reveal, 6, 24) };
  });
};

const plateState = (stage: Stage, frame: number, fill: Blob, hasLogo: boolean) => {
  const { schedule, lockup, palette } = stage;
  const color = hasLogo ? palette.surface : palette.primary;
  if (frame >= schedule.swellStart) {
    const swell = ramp(frame, schedule.swellStart, schedule.swellEnd, Easing.inOut(Easing.cubic));
    return {
      box: lockup.plate,
      color,
      scale: lerp(0.85, 1, swell),
      opacity: swell,
      logo: ramp(frame, schedule.logoStart, schedule.logoStart + 10, Easing.inOut(Easing.cubic)),
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
    return {
      x: fill.cx + ((lockup.accent.cx - lockup.tile.cx) * fill.w) / lockup.tile.w,
      y: fill.cy + ((lockup.accent.cy - lockup.tile.cy) * fill.h) / lockup.tile.h,
      scale: 1 - gone,
    };
  }
  return {
    x: lockup.accent.cx,
    y: lockup.accent.cy,
    scale:
      ramp(frame, schedule.accentStart, schedule.accentStart + 10, Easing.inOut(Easing.cubic)) *
      pulseScale(frame, schedule.foldEnd + 2, schedule.last, pulse),
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

export const frameState = (
  stage: Stage,
  writer: Writer,
  frame: number,
  pulse: number,
  hasLogo: boolean,
) => {
  const fill = fillAt(stage, frame);
  return {
    fill,
    letters: letterStates(stage, writer, frame),
    caret: caretAt(stage, frame, writer.x0, writer.x1, writer.y),
    plate: plateState(stage, frame, fill, hasLogo),
    accent: accentState(stage, frame, pulse, fill),
    ring: ringState(stage, frame, pulse),
    lineFade: 1 - ramp(frame, stage.schedule.dropStart, stage.schedule.dropStart + 10),
    glow:
      frame < stage.schedule.collapseEnd
        ? 1 - ramp(frame, stage.schedule.collapseStart, stage.schedule.collapseEnd)
        : frame >= stage.schedule.growStart
          ? 1
          : 0,
    glowShift: (stage.frameHeight * frame) / (stage.schedule.last + 1),
  };
};
