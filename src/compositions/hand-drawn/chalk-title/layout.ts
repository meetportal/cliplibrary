import type { ChalkTitleProps } from '@/schemas';
import { AMPERSAND_FACES, BYLINE_FACE, type Measurer, SCRIPT_FACES } from './fonts';

export const WIPE = { x: 1, y: 0.25 };
const UNIT = Math.hypot(WIPE.x, WIPE.y);

export const project = (x: number, y: number) => (x * WIPE.x + y * WIPE.y) / UNIT;

export type Box = { x0: number; y0: number; x1: number; y1: number };
type Span = [number, number];
export type Sparkle = { x: number; y: number; r: number };
export type Piece = {
  text: string;
  x: number;
  baseline: number;
  size: number;
  box: Box;
  span: Span;
};

export type TitleLayout = {
  start: Piece;
  amp: Piece;
  end: Piece;
  byline: Piece | null;
  sparkles: Sparkle[];
  all: Span;
  wordSize: number;
};

const MARGIN = 110;
const BYLINE_WIDTH = 1500;

const spanOf = (box: Box): Span => {
  const values = [
    project(box.x0, box.y0),
    project(box.x1, box.y0),
    project(box.x0, box.y1),
    project(box.x1, box.y1),
  ];
  return [Math.min(...values), Math.max(...values)];
};

const shift = (piece: Piece, dy: number): Piece => {
  const box = { ...piece.box, y0: piece.box.y0 + dy, y1: piece.box.y1 + dy };
  return { ...piece, baseline: piece.baseline + dy, box, span: spanOf(box) };
};

export const buildLayout = (
  props: ChalkTitleProps,
  measure: Measurer,
  frame: { x: number; y: number },
): TitleLayout => {
  const script = SCRIPT_FACES[props.title.font];
  const ampFace = AMPERSAND_FACES[props.ampersand.font];
  const startInk = measure(props.titleStart, script);
  const endInk = measure(props.titleEnd, script);
  const ampInk = measure('&', ampFace);
  const baseAmp = props.ampersand.size;
  const gap = props.title.gap;
  const room = (ampPx: number) =>
    frame.x / 2 - MARGIN - gap - (ampPx * (ampInk.right - ampInk.left)) / 2;
  const widest = Math.max(startInk.right - startInk.left, endInk.right - endInk.left, 0.01);
  const fit = Math.min(1, room(baseAmp) / (props.title.size * widest));
  const wordSize = props.title.size * fit;
  const ampSize = baseAmp * (0.6 + 0.4 * fit);
  const cx = frame.x / 2;
  const ampWidth = ampSize * (ampInk.right - ampInk.left);
  const ampX = cx - ampWidth / 2 - ampSize * ampInk.left;
  const ampBaseline = 0;
  const ampTop = ampBaseline - ampSize * ampInk.ascent;
  const ampBottom = ampBaseline + ampSize * ampInk.descent;
  const middle = (ampTop + ampBottom) / 2;
  const wordBaseline = middle + 0.3 * wordSize;
  const startRight = cx - ampWidth / 2 - gap;
  const startX = startRight - wordSize * startInk.right;
  const endX = cx + ampWidth / 2 + gap - wordSize * endInk.left;
  const endBaseline = wordBaseline - props.title.raiseEnd;
  const piece = (
    text: string,
    x: number,
    baseline: number,
    size: number,
    ink: ReturnType<Measurer>,
  ): Piece => {
    const box = {
      x0: x + size * ink.left,
      y0: baseline - size * ink.ascent,
      x1: x + size * ink.right,
      y1: baseline + size * ink.descent,
    };
    return { text, x, baseline, size, box, span: spanOf(box) };
  };
  const start = piece(props.titleStart, startX, wordBaseline, wordSize, startInk);
  const amp = piece('&', ampX, ampBaseline, ampSize, ampInk);
  const end = piece(props.titleEnd, endX, endBaseline, wordSize, endInk);
  const r = 0.1 * ampSize * props.sparkles.size;
  const sparkY = amp.box.y0 - 0.14 * ampSize - r;
  const sparkX = cx + 0.04 * ampSize;
  const sparkles: Sparkle[] = props.sparkles.show
    ? [
        { x: sparkX - 2.1 * r, y: sparkY + 0.75 * r, r: 0.55 * r },
        { x: sparkX, y: sparkY, r },
        { x: sparkX + 2 * r, y: sparkY + 0.85 * r, r: 0.45 * r },
      ]
    : [];
  const titleBottom = Math.max(start.box.y1, amp.box.y1, end.box.y1);
  const bylineText = props.byline.uppercase ? props.caption.toUpperCase() : props.caption;
  const bylineInk = measure(bylineText, BYLINE_FACE);
  const tracked = (size: number) =>
    size * (bylineInk.advance + props.byline.tracking * Math.max(0, [...bylineText].length - 1));
  const bylineSize =
    props.byline.size * Math.min(1, BYLINE_WIDTH / Math.max(1, tracked(props.byline.size)));
  const bylineBaseline = titleBottom + props.byline.gap * (0.6 + 0.4 * fit);
  const byline =
    props.byline.show && bylineText.trim().length > 0
      ? piece(bylineText, cx - tracked(bylineSize) / 2, bylineBaseline, bylineSize, {
          ...bylineInk,
          left: 0,
          right: tracked(bylineSize) / bylineSize,
        })
      : null;
  const top = Math.min(amp.box.y0, start.box.y0, end.box.y0, ...sparkles.map((s) => s.y - s.r));
  const bottom = byline === null ? titleBottom : byline.box.y1;
  const dy = frame.y / 2 + props.title.offsetY - (top + bottom) / 2;
  const placed = {
    start: shift(start, dy),
    amp: shift(amp, dy),
    end: shift(end, dy),
    byline: byline === null ? null : shift(byline, dy),
  };
  const spans = [placed.start, placed.amp, placed.end, placed.byline]
    .filter((p): p is Piece => p !== null)
    .map((p) => p.span);
  const sparkleSpans = sparkles.map((s) => project(s.x, s.y + dy));
  return {
    ...placed,
    sparkles: sparkles.map((s) => ({ ...s, y: s.y + dy })),
    all: [
      Math.min(...spans.map((s) => s[0]), ...sparkleSpans),
      Math.max(...spans.map((s) => s[1]), ...sparkleSpans),
    ],
    wordSize,
  };
};
