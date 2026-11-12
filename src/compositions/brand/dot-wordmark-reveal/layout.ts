import type { DotWordmarkRevealProps } from '@/schemas';
import type { LogoBox } from '../../kit/use-logo-box';
import type { Measured } from './fonts';

export type Box = { cx: number; cy: number; w: number; h: number; r: number };

type WordSpot = {
  text: string;
  left: number;
  top: number;
  width: number;
  cx: number;
  row: number;
  lineRight: number;
};

export type LineLayout = { size: number; lineHeight: number; words: WordSpot[] };

type Letter = { text: string; left: number; width: number };

export type Lockup = {
  tile: Box;
  plate: Box;
  logo: { width: number; height: number } | null;
  nameSize: number;
  nameTop: number;
  nameLeft: number;
  nameRight: number;
  letters: Letter[];
  accent: { cx: number; cy: number; size: number };
};

const LINE_WIDTH = 920;
const NAME_WIDTH = 880;
const LOGO_MAX_WIDTH = 700;
const LINE_HEIGHT = 1.25;
const MIN_LINE_SIZE = 24;

const span = (widths: readonly number[], space: number, from: number, to: number) =>
  widths.slice(from, to).reduce((sum, one) => sum + one, 0) + Math.max(0, to - from - 1) * space;

const balance = (widths: readonly number[], space: number, lines: number[][]) => {
  if (lines.length !== 2) {
    return lines;
  }
  let best = 1;
  let bestWidth = Number.POSITIVE_INFINITY;
  for (let cut = 1; cut < widths.length; cut++) {
    const widest = Math.max(span(widths, space, 0, cut), span(widths, space, cut, widths.length));
    if (widest < bestWidth) {
      bestWidth = widest;
      best = cut;
    }
  }
  const all = widths.map((_, at) => at);
  return [all.slice(0, best), all.slice(best)];
};

const wrap = (widths: readonly number[], space: number, size: number) =>
  balance(widths, space, greedy(widths, space, size));

const greedy = (widths: readonly number[], space: number, size: number) => {
  const lines: number[][] = [];
  let current: number[] = [];
  let width = 0;
  widths.forEach((one, at) => {
    const next = current.length === 0 ? one * size : width + (space + one) * size;
    if (current.length > 0 && next > LINE_WIDTH) {
      lines.push(current);
      current = [at];
      width = one * size;
    } else {
      current.push(at);
      width = next;
    }
  });
  if (current.length > 0) {
    lines.push(current);
  }
  return lines;
};

export const layoutLine = (
  words: readonly string[],
  measured: Measured,
  startSize: number,
  centerY: number,
  frameWidth: number,
  pillHeight: number,
): LineLayout => {
  let size = startSize;
  let lines = wrap(measured.words, measured.space, size);
  const fits = () => lines.length <= 2 && measured.words.every((one) => one * size <= LINE_WIDTH);
  while (!fits() && size > MIN_LINE_SIZE) {
    size -= 2;
    lines = wrap(measured.words, measured.space, size);
  }
  const lineHeight = Math.round(size * LINE_HEIGHT);
  const rowGap = pillHeight + Math.round(size * 0.4);
  const rowStep = lineHeight + rowGap;
  const blockTop = Math.round(centerY - (lines.length * rowStep - rowGap) / 2);
  const spots: WordSpot[] = [];
  lines.forEach((line, row) => {
    const lineWidth =
      line.reduce((sum, at) => sum + (measured.words[at] ?? 0) * size, 0) +
      (line.length - 1) * measured.space * size;
    let left = (frameWidth - lineWidth) / 2;
    for (const at of line) {
      const width = (measured.words[at] ?? 0) * size;
      spots.push({
        text: words[at] ?? '',
        left: Math.round(left),
        top: blockTop + row * rowStep,
        width,
        cx: left + width / 2,
        row,
        lineRight: (frameWidth + lineWidth) / 2,
      });
      left += width + measured.space * size;
    }
  });
  return { size, lineHeight, words: spots };
};

const logoSize = (box: LogoBox, size: number) => {
  const height = size / box.aspect ** 0.35;
  const width = height * box.aspect;
  return width > LOGO_MAX_WIDTH
    ? { width: LOGO_MAX_WIDTH, height: LOGO_MAX_WIDTH / box.aspect }
    : { width, height };
};

export const layoutLockup = (
  props: DotWordmarkRevealProps,
  logoBox: LogoBox | null,
  letters: readonly string[],
  measured: Measured,
  faceTracking: number,
  frameWidth: number,
  centerY: number,
): Lockup => {
  const tracking = props.name.tracking + faceTracking;
  const perSize = measured.name.reduce((sum, one) => sum + one + tracking, 0) - tracking;
  const nameSize =
    perSize > 0
      ? Math.max(24, Math.min(props.name.size, Math.floor(NAME_WIDTH / perSize)))
      : props.name.size;
  const logo = logoBox === null ? null : logoSize(logoBox, props.tile.logoSize);
  const bare = Math.round(props.tile.logoSize * 0.4);
  const plateW = logo === null ? bare : Math.round(logo.width + props.tile.padding * 2);
  const plateH = logo === null ? bare : Math.round(logo.height + props.tile.padding * 2);
  const tileW = plateW + props.tile.border * 2;
  const tileH = plateH + props.tile.border * 2;
  const plateR = (Math.min(plateW, plateH) / 2) * (props.tile.roundness / 100);
  const total = tileH + props.layout.gap + nameSize;
  const tileTop = Math.round(centerY - total / 2);
  const tileCy = tileTop + tileH / 2;
  const nameTop = tileTop + tileH + props.layout.gap;
  const nameWidth = perSize * nameSize;
  const nameLeft = Math.round((frameWidth - nameWidth) / 2);
  let left = nameLeft;
  const placed = letters.map((text, at) => {
    const width = (measured.name[at] ?? 0) * nameSize;
    const letter = { text, left, width };
    left += width + tracking * nameSize;
    return letter;
  });
  const accentSize = props.dot.accentSize;
  const inset = props.tile.border / 2 + plateR * 0.29;
  return {
    tile: { cx: frameWidth / 2, cy: tileCy, w: tileW, h: tileH, r: plateR + props.tile.border },
    plate: { cx: frameWidth / 2, cy: tileCy, w: plateW, h: plateH, r: plateR },
    logo,
    nameSize,
    nameTop,
    nameLeft,
    nameRight: nameLeft + nameWidth,
    letters: placed,
    accent: {
      cx: frameWidth / 2 + tileW / 2 - inset,
      cy: tileCy + tileH / 2 - inset,
      size: accentSize,
    },
  };
};
