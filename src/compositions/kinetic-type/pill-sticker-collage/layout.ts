import type { PillStickerCollageProps } from '@/schemas';
import type { Measure } from './fonts';

export type StickerStyle = 'primary' | 'surface' | 'outline' | 'outline-accent';

export type BadgeKind = 'arrow' | 'burst' | 'hash' | 'arrow-down';

type StickerContent =
  | { kind: 'word'; text: string; fontSize: number }
  | { kind: 'badge'; badge: BadgeKind }
  | { kind: 'logo' };

export type Sticker = {
  key: string;
  content: StickerContent;
  style: StickerStyle;
  disc: boolean;
  x: number;
  y: number;
  w: number;
  h: number;
  rotate: number;
  at: number;
  row: number;
  exitAt: number | null;
  ring: number;
  accent: boolean;
};

type Item = Omit<Sticker, 'x' | 'y' | 'rotate' | 'at' | 'row' | 'exitAt' | 'ring' | 'accent'>;

export type Frame = { width: number; height: number };

export const MARGIN = 44;
export const PAN = 1;
const MIN_ROWS = 3;
const LEAD_IN = 3;
const BRAND_LATEST = 220;
const BADGES: readonly BadgeKind[] = ['arrow', 'burst', 'hash', 'arrow-down'];
const PILL_STYLES: readonly StickerStyle[] = [
  'primary',
  'surface',
  'outline',
  'outline-accent',
  'surface',
  'primary',
  'outline-accent',
  'outline',
];
const DISC_STYLES: readonly StickerStyle[] = ['surface', 'outline', 'primary'];
const TILTS = [-7, 5, -3, 8, -9, 2, 6, -5, 9, -2, 4, -8];
const JITTER = [0, -2, 1, 2, -1, 0, 2, -2, 1, -1];
const SCATTER = [-1, 1, -0.6, 0.9, -1, 0.5, 1, -0.8];

const cycle = <T>(list: readonly T[], index: number): T => list[index % list.length] as T;

export const splitWords = (text: string): string[] => text.trim().split(/\s+/).filter(Boolean);

const wordItem = (
  text: string,
  index: number,
  size: number,
  height: number,
  maxWidth: number,
  measure: Measure,
): Item => {
  const textWidth = measure(text) * size;
  const disc = [...text].length <= 2;
  if (disc) {
    const diameter = Math.round(Math.max(height * 1.4, textWidth + size * 0.7));
    const fontSize = diameter > maxWidth ? (size * (maxWidth - size * 0.7)) / textWidth : size;
    const side = Math.min(diameter, maxWidth);
    return {
      key: `word-${index}`,
      content: { kind: 'word', text, fontSize },
      style: cycle(DISC_STYLES, index),
      disc,
      w: side,
      h: side,
    };
  }
  const pad = size * 0.55;
  const natural = Math.max(height * 1.3, textWidth + pad * 2);
  const w = Math.round(Math.min(natural, maxWidth));
  const fontSize = natural > maxWidth ? (size * (maxWidth - pad * 2)) / textWidth : size;
  return {
    key: `word-${index}`,
    content: { kind: 'word', text, fontSize },
    style: cycle(PILL_STYLES, index),
    disc,
    w,
    h: height,
  };
};

const withBadges = (words: Item[], count: number, height: number): Item[] => {
  const side = Math.round(height * 1.18);
  const slots = Array.from({ length: count }, (_, at) =>
    Math.round(((at + 1) * words.length) / (count + 1)),
  );
  const items: Item[] = [];
  words.forEach((word, at) => {
    items.push(word);
    slots.forEach((slot, badge) => {
      if (Math.max(1, slot) === at + 1) {
        items.push({
          key: `badge-${badge}`,
          content: { kind: 'badge', badge: cycle(BADGES, badge) },
          style: 'surface',
          disc: true,
          w: side,
          h: side,
        });
      }
    });
  });
  if (words.length === 0) {
    return slots.map((_, badge) => ({
      key: `badge-${badge}`,
      content: { kind: 'badge', badge: cycle(BADGES, badge) },
      style: 'surface',
      disc: true,
      w: side,
      h: side,
    }));
  }
  return items;
};

const rowCount = (items: Item[], maxWidth: number, gap: number): number => {
  let rows = 0;
  let width = 0;
  for (const item of items) {
    if (rows === 0 || width + gap + item.w > maxWidth) {
      rows += 1;
      width = item.w;
    } else {
      width += gap + item.w;
    }
  }
  return Math.max(rows, Math.min(MIN_ROWS, items.length));
};

const rowSpan = (row: Item[], gap: number) =>
  row.reduce((sum, item) => sum + item.w, 0) + gap * Math.max(0, row.length - 1);

const fillLastRow = (rows: Item[][], maxWidth: number, gap: number): Item[][] => {
  const last = rows.at(-1);
  const before = rows.at(-2);
  const moving = before?.[before.length - 1];
  if (last === undefined || before === undefined || moving === undefined) {
    return rows;
  }
  if (last.length > 1 || before.length < 2 || rowSpan([moving, ...last], gap) > maxWidth) {
    return rows;
  }
  return [...rows.slice(0, -2), before.slice(0, -1), [moving, ...last]];
};

const intoRows = (items: Item[], maxWidth: number, gap: number): Item[][] => {
  const wanted = rowCount(items, maxWidth, gap);
  const total = items.reduce((sum, item) => sum + item.w + gap, 0);
  const rows: Item[][] = [];
  let used = 0;
  items.forEach((item, at) => {
    const left = items.length - at;
    const open = wanted - rows.length;
    const last = rows.at(-1);
    const width = last === undefined ? 0 : last.reduce((sum, one) => sum + one.w + gap, 0);
    const share = (total * rows.length) / wanted;
    const mustBreak = left <= open;
    const fits = last !== undefined && width + gap + item.w <= maxWidth;
    const wantsBreak = used + (item.w + gap) / 2 > share && open > 0;
    if (last === undefined || mustBreak || !fits || wantsBreak) {
      rows.push([item]);
    } else {
      last.push(item);
    }
    used += item.w + gap;
  });
  return fillLastRow(rows, maxWidth, gap);
};

export type Collage = {
  stickers: Sticker[];
  knots: { at: number; rise: number }[];
  lastRow: number;
  brandAt: number;
};

const LAST_ROW_SLACK = 0.35;

const breakRows = (
  items: Item[],
  maxWidth: number,
  gap: number,
  limitFor: (first: number) => number,
) => {
  let width = maxWidth;
  let rows = intoRows(items, width, gap);
  for (let attempt = 0; attempt < 6; attempt++) {
    const last = rows.at(-1) ?? [];
    const first = items.length - last.length;
    const height = last.reduce((tallest, item) => Math.max(tallest, item.h), 0);
    const limit = limitFor(first) - height * LAST_ROW_SLACK;
    if (rowSpan(last, gap) <= limit || last.length <= 1) {
      return rows;
    }
    width = Math.max(height, Math.min(width, limit));
    rows = intoRows(items, width, gap);
  }
  return rows;
};

export const planCollage = (
  props: PillStickerCollageProps,
  words: string[],
  measure: Measure,
  frame: Frame,
  frames: number,
): Collage => {
  const { stickers: look, timing } = props;
  const size = props.type.wordSize;
  const height = Math.round(size * 1.5);
  const gap = Math.round(size * 0.16);
  const dy = height * look.rowSpacing;
  const reach = frame.height / 2 - MARGIN - height * 0.5 - height * 0.35;
  const lag = Math.min(2.2, Math.max(0.5, reach / dy));
  const sideRoom = frame.width / 2 - MARGIN - timing.interval * 3 * PAN;
  const rowWidth = Math.max(560, Math.min(look.rowWidth, sideRoom * 2));
  const wordItems = words.map((word, at) => wordItem(word, at, size, height, rowWidth, measure));
  const items = withBadges(wordItems, look.badges, height);
  const count = items.length;
  const interval = Math.min(
    timing.interval,
    Math.max(6, Math.floor((BRAND_LATEST - timing.brandPause) / Math.max(1, count))),
  );
  const rows = breakRows(
    items,
    rowWidth,
    gap,
    (first) => frame.width - MARGIN * 2 - PAN * (frames - 1 - (first * interval - LEAD_IN)),
  );
  const stickers: Sticker[] = [];
  const knots: Collage['knots'] = [];
  let index = 0;
  rows.forEach((row, rowIndex) => {
    const total = rowSpan(row, gap);
    const slack = Math.max(0, sideRoom - total / 2 - gap);
    const rowStart = index * interval - LEAD_IN;
    let left =
      rowStart * PAN - total / 2 + cycle(SCATTER, rowIndex) * Math.min(look.scatter, slack);
    row.forEach((item, column) => {
      const long = !item.disc && item.w > item.h * 3;
      const tilt = (cycle(TILTS, index) * look.tilt) / 9;
      const at = index * interval - LEAD_IN;
      stickers.push({
        ...item,
        x: Math.round(left + item.w / 2),
        y: Math.round(-rowIndex * dy + cycle(JITTER, index) * height * 0.06),
        rotate: long ? tilt * 0.65 : tilt,
        at,
        row: rowIndex,
        exitAt: null,
        ring: 0,
        accent: false,
      });
      if (column === 0) {
        knots.push({ at: at + (interval * (row.length - 1)) / 2, rise: (rowIndex - lag) * dy });
      }
      left += item.w + gap;
      index += 1;
    });
  });
  const brandAt = Math.min(BRAND_LATEST, count * interval - LEAD_IN + timing.brandPause);
  return { stickers, knots, lastRow: rows.length - 1, brandAt };
};
