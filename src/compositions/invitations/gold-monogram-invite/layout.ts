import type { GoldMonogramInviteProps } from '@/schemas';
import type { Face, SerifFaces } from './fonts';
import { type FittedLines, fitLine, fitNames, type Measurer, wrapLines } from './measure';

export const EYEBROW_TRACKING = 0.32;

export const DATE_TRACKING = 0.14;

export type Row =
  | { kind: 'eyebrow'; order: number; top: number; text: string; size: number }
  | { kind: 'names'; order: number; top: number; fitted: FittedLines }
  | { kind: 'divider'; order: number; top: number; width: number }
  | { kind: 'line'; order: number; top: number; fitted: FittedLines }
  | { kind: 'date'; order: number; top: number; text: string; size: number }
  | { kind: 'venue'; order: number; top: number; fitted: FittedLines }
  | { kind: 'logo'; order: number; top: number; height: number };

export type Column = { centerX: number; width: number };

export type Stack = { rows: Row[]; height: number };

export const NAMES_LEADING = 1.04;
export const LINE_LEADING = 1.3;
export const VENUE_LEADING = 1.32;

type Draft = { row: Row; height: number; after: number };

export const buildStack = (
  props: GoldMonogramInviteProps,
  measure: Measurer,
  script: Face,
  serif: SerifFaces,
  column: Column,
  logoHeight: number | null,
): Stack => {
  const width = column.width;
  const drafts: Draft[] = [];
  const add = (row: Row, height: number, after: number) => drafts.push({ row, height, after });
  const eyebrow = props.eyebrow.trim().toUpperCase();
  if (eyebrow !== '') {
    const size = fitLine(
      measure,
      eyebrow,
      serif.body,
      EYEBROW_TRACKING,
      props.type.dateSize * 0.62,
      width,
    );
    add({ kind: 'eyebrow', order: 0, top: 0, text: eyebrow, size }, size * 1.1, 14);
  }
  const names = fitNames(
    measure,
    props.partnerOne,
    props.joiner,
    props.partnerTwo,
    script,
    props.type.namesSize,
    width,
  );
  if (names.lines.length > 0) {
    add(
      { kind: 'names', order: 1, top: 0, fitted: names },
      names.size * (1.0 + (names.lines.length - 1) * NAMES_LEADING),
      18,
    );
  }
  add({ kind: 'divider', order: 2, top: 0, width: Math.min(width * 0.62, 420) }, 26, 26);
  const line = wrapLines(
    measure,
    props.invitationLine,
    serif.body,
    0,
    props.type.lineSize,
    width,
    2,
  );
  if (line.lines.length > 0) {
    add(
      { kind: 'line', order: 3, top: 0, fitted: line },
      line.size * LINE_LEADING * line.lines.length,
      22,
    );
  }
  const date = props.eventDate.trim().toUpperCase();
  if (date !== '') {
    const size = Math.max(
      props.type.dateSize * 0.5,
      fitLine(measure, date, serif.strong, DATE_TRACKING, props.type.dateSize, width),
    );
    add({ kind: 'date', order: 4, top: 0, text: date, size }, size * 1.15, 12);
  }
  const venue = wrapLines(
    measure,
    props.venue,
    serif.body,
    0.02,
    props.type.dateSize * 0.8,
    width,
    2,
  );
  if (venue.lines.length > 0) {
    add(
      { kind: 'venue', order: 5, top: 0, fitted: venue },
      venue.size * VENUE_LEADING * venue.lines.length,
      34,
    );
  }
  if (logoHeight !== null) {
    add({ kind: 'logo', order: 6, top: 0, height: logoHeight }, logoHeight, 0);
  }
  let cursor = 0;
  const rows = drafts.map((draft, index) => {
    const row = { ...draft.row, top: cursor };
    cursor += draft.height + (index === drafts.length - 1 ? 0 : draft.after);
    return row;
  });
  return { rows, height: cursor };
};

export const placeStack = (stack: Stack, top: number): Row[] =>
  stack.rows.map((row) => ({ ...row, top: Math.round(row.top + top) }));
