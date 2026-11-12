import { Easing } from 'remotion';
import { ramp } from '../../kit/motion';

export type Stroke = { write: number; erase: number };

const WRITE = Easing.linear;
const ERASE = Easing.inOut(Easing.sin);

export const span = (
  from: number,
  to: number,
  stroke: Stroke,
  eraseWindow: readonly [number, number] = [from, to],
): Stroke => {
  const part = (value: number, start: number, end: number) =>
    Math.max(0, Math.min(1, (value - start) / (end - start)));
  return {
    write: part(stroke.write, from, to),
    erase: part(stroke.erase, eraseWindow[0], eraseWindow[1]),
  };
};

export const TEXT_FIRST: readonly [number, number] = [0, 0.55];
export const FILL_LAST: readonly [number, number] = [0.05, 1];
export const MARKS_SLOW: readonly [number, number] = [0, 1];

export const isShown = (stroke: Stroke) => stroke.write > 0.001 && stroke.erase < 0.999;

const chalk = (
  frame: number,
  start: number,
  draw: number,
  eraseStart: number | null,
  erase: number,
): Stroke => ({
  write: ramp(frame, start, start + draw, WRITE),
  erase: eraseStart === null ? 0 : ramp(frame, eraseStart, eraseStart + erase, ERASE),
});

const OPENER = {
  left: { start: -6, draw: 22 },
  amp: { start: 6, draw: 20 },
  right: { start: 14, draw: 22 },
  sparkles: { start: 22, draw: 12 },
  eraseStart: 49,
  erase: 18,
  eraseStagger: 3,
};

export const openerStrokes = (frame: number) => {
  const at = (index: number) => OPENER.eraseStart + index * OPENER.eraseStagger;
  const { left, amp, right, sparkles } = OPENER;
  return {
    left: chalk(frame, left.start, left.draw, at(0), OPENER.erase),
    amp: chalk(frame, amp.start, amp.draw, at(1), OPENER.erase),
    sparkles: chalk(frame, sparkles.start, sparkles.draw, at(1), OPENER.erase),
    right: chalk(frame, right.start, right.draw, at(2), OPENER.erase),
  };
};

export const GRID = {
  start: 64,
  stagger: 6,
  draw: 26,
  eraseStart: 142,
  eraseStagger: 2,
  erase: 16,
};

export const gridStroke = (frame: number, index: number): Stroke =>
  chalk(
    frame,
    GRID.start + index * GRID.stagger,
    GRID.draw,
    GRID.eraseStart + index * GRID.eraseStagger,
    GRID.erase,
  );

export const SPOTLIGHT = { start: 164, slot: 51, draw: 22, hold: 20, erase: 12 };

export const spotlightStroke = (frame: number, index: number): Stroke => {
  const start = SPOTLIGHT.start + index * SPOTLIGHT.slot;
  return chalk(
    frame,
    start,
    SPOTLIGHT.draw,
    start + SPOTLIGHT.draw + SPOTLIGHT.hold,
    SPOTLIGHT.erase,
  );
};

const END = {
  logo: { start: 320, draw: 22 },
  lineOne: { start: 322, draw: 28 },
  lineTwo: { start: 332, draw: 30 },
  tagline: { start: 346, draw: 24 },
  website: { start: 352, draw: 28 },
  underline: { start: 370, draw: 16 },
  eraseStart: 437,
  eraseStagger: 0,
  erase: 12,
};

const CAPTION = { start: 62, draw: 30 };

export type EndKey = 'logo' | 'lineOne' | 'lineTwo' | 'tagline' | 'website' | 'underline';

const END_ORDER: readonly EndKey[] = [
  'logo',
  'lineOne',
  'lineTwo',
  'tagline',
  'website',
  'underline',
];

export const endStroke = (frame: number, key: EndKey, eraseAtEnd: boolean): Stroke =>
  chalk(
    frame,
    END[key].start,
    END[key].draw,
    eraseAtEnd ? END.eraseStart + END_ORDER.indexOf(key) * END.eraseStagger : null,
    END.erase,
  );

export const captionStroke = (frame: number): Stroke =>
  chalk(frame, CAPTION.start, CAPTION.draw, END.logo.start - 4, 18);
