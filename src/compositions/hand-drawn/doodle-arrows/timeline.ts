import { Easing } from 'remotion';
import { ramp } from '../../kit/motion';

export const PEN = Easing.inOut(Easing.quad);
export const PEN_START = Easing.bezier(0.33, 0.1, 0.4, 1);
export const SOFT = Easing.inOut(Easing.sin);

const HEAD_FRAMES = 8;
const WRITE_SPAN = 30;
const UNDERLINE_FRAMES = 18;
const LOCKUP_SETTLE = 36;
const ERASE_LEAD = 36;
const ERASE_FRAMES = 20;
export const TEXT_ERASE_FRAMES = 22;
const PUSH_REST = 20;
const PUSH_PEAK = 150;

export type Timeline = {
  wavyEnd: number;
  straightStart: number;
  straightEnd: number;
  writeStart: number;
  writeSpan: number;
  underlineStart: number;
  underlineEnd: number;
  eraseStart: number;
  eraseFrames: number;
  end: number;
};

export const timelineFor = (drawFrames: number, durationInFrames: number): Timeline => {
  const writeStart = Math.round(drawFrames * 0.9);
  const underlineStart = writeStart + WRITE_SPAN - 4;
  return {
    wavyEnd: drawFrames + HEAD_FRAMES,
    straightStart: Math.round(drawFrames * 0.38),
    straightEnd: Math.round(drawFrames * 1.2) + HEAD_FRAMES,
    writeStart,
    writeSpan: WRITE_SPAN,
    underlineStart,
    underlineEnd: underlineStart + UNDERLINE_FRAMES,
    eraseStart: durationInFrames - ERASE_LEAD,
    eraseFrames: ERASE_FRAMES,
    end: durationInFrames - 1,
  };
};

export const erasing = (
  frame: number,
  timeline: Timeline,
  delay: number,
  enabled: boolean,
  frames = timeline.eraseFrames,
) =>
  enabled
    ? ramp(frame, timeline.eraseStart + delay, timeline.eraseStart + delay + frames, SOFT)
    : 0;

export const lockupLift = (frame: number, timeline: Timeline, rise: number, erase: boolean) => {
  const settled = ramp(frame, 0, LOCKUP_SETTLE, SOFT);
  const sunk = erase ? ramp(frame, timeline.eraseStart + 2, timeline.end, SOFT) : 0;
  return rise * (1 - settled + sunk);
};

export const pushAt = (frame: number, durationInFrames: number) => {
  const wrapped = frame < PUSH_REST ? frame + durationInFrames : frame;
  if (wrapped <= PUSH_PEAK) {
    return ramp(wrapped, PUSH_REST, PUSH_PEAK, SOFT);
  }
  return 1 - ramp(wrapped, PUSH_PEAK, PUSH_REST + durationInFrames, SOFT);
};
