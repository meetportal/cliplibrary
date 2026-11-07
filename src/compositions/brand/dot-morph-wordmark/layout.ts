import type { DotMorphWordmarkProps } from '@/schemas';
import { REFERENCE_SIZE, type TextMetrics } from './fonts';

const SIDE_MARGIN = 84;
const ROW_SPACING = 2.4;
const ROW_SPAN = 820;
const STOP_GAP = 0.06;
const STOP_SHARE = 0.2;
const SETTLED_SHARE = { short: 0.82, long: 0.92, from: 12, to: 28 } as const;
const LOGO_PER_CAP = 2.2;
const LOGO_PER_NAME = 0.75;
const LOGO_MIN = { width: 360, height: 150 } as const;

export type Letter = {
  char: string;
  openX: number;
  finalX: number;
  width: number;
  group: number;
  order: number;
};

type Group = { center: number; left: number; right: number; size: number };

export type LogoBox = { left: number; top: number; width: number; height: number; inset: number };

export type Wordmark = {
  logo: LogoBox | null;
  size: number;
  ascent: number;
  descent: number;
  baseline: number;
  capHeight: number;
  xHeight: number;
  letters: Letter[];
  groups: Group[];
  dotCount: number;
  dotSize: number;
  landSize: number;
  rowY: number;
  rowX: number[];
  center: { x: number; y: number };
  stop: { openX: number; finalX: number; diameter: number } | null;
};

const logoSize = (mark: DotMorphWordmarkProps['mark'], aspect: number) => {
  const inset = mark.plate ? mark.padding : 0;
  const innerWidth = Math.max(
    1,
    Math.min(mark.width - inset * 2, (mark.height - inset * 2) * aspect),
  );
  return { width: innerWidth + inset * 2, height: innerWidth / aspect + inset * 2, inset };
};

export const withoutFullStop = (name: string) => name.trim().replace(/\.$/, '').trimEnd();

const fitSize = (props: DotMorphWordmarkProps, metrics: TextMetrics, available: number) => {
  const count = metrics.glyphs.length;
  const stopPart = props.name.fullStop ? STOP_GAP + STOP_SHARE : 0;
  const perPixel =
    metrics.width / REFERENCE_SIZE + props.name.tracking * Math.max(0, count - 1) + stopPart;
  return perPixel <= 0 ? props.name.size : Math.min(props.name.size, available / perPixel);
};

const splitGroups = (visible: number, dotCount: number) =>
  Array.from({ length: visible }, (_, index) => Math.floor((index * dotCount) / visible));

export const buildWordmark = (
  props: DotMorphWordmarkProps,
  metrics: TextMetrics,
  frame: { width: number; height: number },
  logoAspect: number | null,
): Wordmark => {
  const available = frame.width - SIDE_MARGIN * 2;
  const longness = Math.min(
    1,
    Math.max(
      0,
      (metrics.glyphs.length - SETTLED_SHARE.from) / (SETTLED_SHARE.to - SETTLED_SHARE.from),
    ),
  );
  const share = SETTLED_SHARE.short + (SETTLED_SHARE.long - SETTLED_SHARE.short) * longness;
  const size = fitSize(props, metrics, available * share);
  const k = size / REFERENCE_SIZE;
  const count = metrics.glyphs.length;
  const gaps = Math.max(0, count - 1);
  const stopDiameter = props.name.fullStop && count > 0 ? size * STOP_SHARE : 0;
  const stopRoom = stopDiameter > 0 ? size * STOP_GAP + stopDiameter : 0;
  const finalWidth = metrics.width * k + props.name.tracking * size * gaps + stopRoom;
  const roomToOpen = gaps === 0 ? 0 : (available - finalWidth) / (size * gaps);
  const open =
    props.timing.tighten > 0
      ? Math.max(
          props.name.tracking,
          Math.min(props.name.openTracking, props.name.tracking + roomToOpen),
        )
      : props.name.tracking;
  const openWidth = finalWidth + (open - props.name.tracking) * size * gaps;
  const cx = frame.width / 2;
  const capHeight = metrics.capHeight * k;
  const slot = {
    ...props.mark,
    width: Math.min(props.mark.width, Math.max(LOGO_MIN.width, finalWidth * LOGO_PER_NAME)),
    height: Math.min(props.mark.height, Math.max(LOGO_MIN.height, capHeight * LOGO_PER_CAP)),
  };
  const logoBox = props.mark.show && logoAspect !== null ? logoSize(slot, logoAspect) : null;
  const above = logoBox === null ? 0 : logoBox.height + props.mark.gap;
  const middle = frame.height / 2 + props.layout.offsetY;
  const baseline = Math.round(middle + (above + capHeight) / 2);
  const logo =
    logoBox === null
      ? null
      : {
          ...logoBox,
          left: Math.round(cx - logoBox.width / 2),
          top: Math.round(middle - (above + capHeight) / 2),
        };
  const finalLeft = cx - finalWidth / 2;
  const openLeft = cx - openWidth / 2;
  const visible = metrics.glyphs.filter((glyph) => glyph.char.trim() !== '').length;
  const dotCount = Math.max(1, Math.min(Math.round(props.dots.count), visible || props.dots.count));
  const groupOf = splitGroups(visible, dotCount);
  let seen = 0;
  const letters: Letter[] = metrics.glyphs.flatMap((glyph, index) => {
    if (glyph.char.trim() === '') {
      return [];
    }
    const group = groupOf[seen] ?? 0;
    const order = seen - groupOf.indexOf(group);
    seen += 1;
    return [
      {
        char: glyph.char,
        openX: Math.round(openLeft + glyph.x * k + open * size * index),
        finalX: Math.round(finalLeft + glyph.x * k + props.name.tracking * size * index),
        width: glyph.width * k,
        group,
        order,
      },
    ];
  });
  const dotSize = props.dots.size;
  const spacing = dotCount > 1 ? Math.min(dotSize * ROW_SPACING, ROW_SPAN / (dotCount - 1)) : 0;
  const rowX = Array.from(
    { length: dotCount },
    (_, index) => cx + (index - (dotCount - 1) / 2) * spacing,
  );
  const groups: Group[] = rowX.map((x, group) => {
    const members = letters.filter((letter) => letter.group === group);
    if (members.length === 0) {
      return { center: x, left: x, right: x, size: 0 };
    }
    const left = Math.min(...members.map((letter) => letter.openX));
    const right = Math.max(...members.map((letter) => letter.openX + letter.width));
    return { center: (left + right) / 2, left, right, size: members.length };
  });
  const lastGlyph = metrics.glyphs.at(-1);
  const textEnd = (left: number, tracking: number) =>
    lastGlyph === undefined
      ? left
      : left + (lastGlyph.x + lastGlyph.width) * k + tracking * size * gaps;
  return {
    logo,
    size,
    ascent: metrics.ascent * k,
    descent: metrics.descent * k,
    baseline,
    capHeight,
    xHeight: metrics.xHeight * k,
    letters,
    groups,
    dotCount,
    dotSize,
    landSize: Math.min(dotSize, Math.max(18, capHeight * 0.95)),
    rowY: baseline - dotSize / 2,
    rowX,
    center: { x: cx, y: baseline - capHeight / 2 - dotSize * 0.4 },
    stop:
      stopDiameter > 0
        ? {
            openX: textEnd(openLeft, open) + size * STOP_GAP + stopDiameter / 2,
            finalX: textEnd(finalLeft, props.name.tracking) + size * STOP_GAP + stopDiameter / 2,
            diameter: stopDiameter,
          }
        : null,
  };
};
