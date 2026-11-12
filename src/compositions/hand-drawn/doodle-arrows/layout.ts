import { HAND_FACE, type Measure, NAME_FACE } from './fonts';

export const NOTE_LEFT = 1060;
const NOTE_WIDTH = 740;
export const HEADLINE_LEADING = 0.94;
const LOGO_MAX_WIDTH = 300;
const LOGO_GAP = 26;
export const PLATE_PAD = 12;

const TIP_Y = 304;
const FIRST_LINE_LIFT = 0.95;
const MIN_HEADLINE = 56;
const UNDERLINE_ROOM = 0.56;
const PLAIN_ROOM = 0.14;
const LOCKUP_GAP = 30;
const LOCKUP_FLOOR = 600;
const MIN_NAME = 16;
const SHORT_HEADLINE = 12;
const SHORT_BOOST = 1.3;

export type LogoSize = { width: number; height: number } | null;

export type NoteLayout = {
  size: number;
  lines: string[];
  headlineTop: number;
  underlineY: number;
  lockupTop: number;
  rowHeight: number;
  nameSize: number;
  nameLeft: number;
  logo: LogoSize;
};

const splitTwo = (words: readonly string[], widthOf: (text: string) => number): string[] => {
  let best = [words.join(' ')];
  let bestWidth = Number.POSITIVE_INFINITY;
  for (let at = 1; at < words.length; at++) {
    const lines = [words.slice(0, at).join(' '), words.slice(at).join(' ')];
    const widest = Math.max(...lines.map(widthOf));
    if (widest < bestWidth - 0.0001) {
      best = lines;
      bestWidth = widest;
    }
  }
  return best;
};

const linesFor = (words: readonly string[], widthOf: (text: string) => number, limit: number) => {
  const single = words.join(' ');
  if (widthOf(single) <= limit) {
    return [single];
  }
  return splitTwo(words, widthOf);
};

export const logoSize = (aspect: number | null, height: number, plate: boolean): LogoSize => {
  if (aspect === null || aspect <= 0) {
    return null;
  }
  const h = Math.min(height, LOGO_MAX_WIDTH / aspect);
  const pad = plate ? PLATE_PAD * 2 : 0;
  return { width: h * aspect + pad, height: h + pad };
};

export const layoutNote = (input: {
  headline: string;
  name: string;
  measure: Measure;
  headlineSize: number;
  nameSize: number;
  logo: LogoSize;
  underline: boolean;
}): NoteLayout => {
  const words = input.headline.split(/\s+/).filter((word) => word !== '');
  const widthOf = (text: string) => input.measure(text, HAND_FACE);
  const logoHeight = input.logo?.height ?? 0;
  const nameLeft = input.logo === null ? 0 : input.logo.width + LOGO_GAP;
  const nameWidth = input.measure(input.name, NAME_FACE);
  const nameSize = Math.max(
    MIN_NAME,
    nameWidth <= 0 ? input.nameSize : Math.min(input.nameSize, (NOTE_WIDTH - nameLeft) / nameWidth),
  );
  const rowHeight = Math.max(logoHeight, nameSize * 1.25);
  const place = (size: number) => {
    const lines = words.length === 0 ? [] : linesFor(words, widthOf, NOTE_WIDTH / size);
    const headlineTop = Math.round(TIP_Y - FIRST_LINE_LIFT * size);
    const bottom = headlineTop + lines.length * size * HEADLINE_LEADING;
    const room = (input.underline && lines.length > 0 ? UNDERLINE_ROOM : PLAIN_ROOM) * size;
    const lockupTop = Math.round(bottom + room + LOCKUP_GAP);
    const fits =
      lines.every((line) => widthOf(line) * size <= NOTE_WIDTH) &&
      lockupTop + rowHeight <= LOCKUP_FLOOR;
    return {
      fits,
      layout: {
        size,
        lines,
        headlineTop,
        underlineY: Math.round(bottom + size * 0.28),
        lockupTop,
        rowHeight,
        nameSize,
        nameLeft,
        logo: input.logo,
      },
    };
  };
  const short = [...input.headline.trim()].length <= SHORT_HEADLINE;
  let fitted = Math.round(input.headlineSize * (short ? SHORT_BOOST : 1));
  let attempt = place(fitted);
  while (!attempt.fits && fitted > MIN_HEADLINE) {
    fitted -= 2;
    attempt = place(fitted);
  }
  return attempt.layout;
};
