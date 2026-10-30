import type { FootageTracking } from '@/footage/footage-spec';
import { fitEdge, type Line, type Sample } from './fit-line';

export type Frame = { data: Uint8Array; width: number; height: number };

export type SpreadLines = {
  fold?: Line | undefined;
  leftSide?: Line | undefined;
  rightSide?: Line | undefined;
  leftTop?: Line | undefined;
  rightTop?: Line | undefined;
  leftBottom?: Line | undefined;
  rightBottom?: Line | undefined;
};

const PAPER_LUMA = 160;
const PAPER_CHROMA = 20;
const RUN = 5;
const DARK_LUMA = 80;
const MIN_SAMPLES = 24;
const FOLD_STEP = 8;
const FOLD_GAP = 14;
const MIN_SPAN = 90;
const DOOR_MARGIN = 8;
const SIDE_CLEARANCE = 60;

const luma = (frame: Frame, x: number, y: number) => {
  const index = (y * frame.width + x) * 3;
  return (
    0.2126 * (frame.data[index] ?? 0) +
    0.7152 * (frame.data[index + 1] ?? 0) +
    0.0722 * (frame.data[index + 2] ?? 0)
  );
};

const isPaper = (frame: Frame, x: number, y: number) => {
  const index = (y * frame.width + x) * 3;
  const red = frame.data[index] ?? 0;
  const green = frame.data[index + 1] ?? 0;
  const blue = frame.data[index + 2] ?? 0;
  const chroma = Math.max(red, green, blue) - Math.min(red, green, blue);
  return luma(frame, x, y) > PAPER_LUMA && chroma < PAPER_CHROMA;
};

const subpixelEdge = (read: (offset: number) => number, start: number, step: 1 | -1): number => {
  const middle = (read(start - step * 4) + read(start + step * 4)) / 2;
  for (let offset = -4; offset < 4; offset += 1) {
    const here = start + step * offset;
    const a = read(here);
    const b = read(here + step);
    if (a <= middle && b > middle) {
      return here + step * ((middle - a) / (b - a));
    }
  }
  return start;
};

const firstRun = (
  from: number,
  to: number,
  step: 1 | -1,
  paperAt: (position: number) => boolean,
): number | undefined => {
  for (
    let position = from;
    step > 0 ? position <= to - RUN : position >= to + RUN;
    position += step
  ) {
    let run = 0;
    while (run < RUN && paperAt(position + step * run)) {
      run += 1;
    }
    if (run === RUN) {
      return position;
    }
  }
  return undefined;
};

const columnSamples = (
  frame: Frame,
  box: FootageTracking['search'],
  columns: number[],
  fromTop: boolean,
): Sample[] =>
  columns.flatMap((x) => {
    const step = fromTop ? 1 : -1;
    const [start, end] = fromTop ? [box[1], box[3]] : [box[3], box[1]];
    const hit = firstRun(start, end, step, (y) => isPaper(frame, x, y));
    if (hit === undefined) {
      return [];
    }
    return [{ along: x, across: subpixelEdge((y) => luma(frame, x, y), hit, step) }];
  });

const rowSamples = (
  frame: Frame,
  box: FootageTracking['search'],
  rows: number[],
  fromLeft: boolean,
): Sample[] =>
  rows.flatMap((y) => {
    const step = fromLeft ? 1 : -1;
    const [start, end] = fromLeft ? [box[0], box[2]] : [box[2], box[0]];
    const hit = firstRun(start, end, step, (x) => isPaper(frame, x, y));
    if (hit === undefined) {
      return [];
    }
    return [{ along: y, across: subpixelEdge((x) => luma(frame, x, y), hit, step) }];
  });

const range = (from: number, to: number) =>
  Array.from(
    { length: Math.max(0, Math.floor(to) - Math.ceil(from) + 1) },
    (_, index) => Math.ceil(from) + index,
  );

export const doorEdges = (frame: Frame, tracking: FootageTracking): [number, number] => {
  const [top, bottom] = tracking.doorBand;
  const [left, right] = tracking.doorway;
  const center = (left + right) / 2;
  const bandLuma = (x: number) => {
    const values = range(top, bottom).map((y) => luma(frame, x, y));
    values.sort((a, b) => a - b);
    return values[Math.floor(values.length / 2)] ?? 255;
  };
  const columns = range(left, right).map((x) => ({ x, dark: bandLuma(x) < DARK_LUMA }));
  const darkColumns = columns.filter((column) => column.dark);
  if (darkColumns.length === 0) {
    return [center, center];
  }
  const nearest = darkColumns.reduce((best, column) =>
    Math.abs(column.x - center) < Math.abs(best.x - center) ? column : best,
  );
  let low = nearest.x;
  while (low > left && bandLuma(low - 1) < DARK_LUMA) {
    low -= 1;
  }
  let high = nearest.x;
  while (high < right && bandLuma(high + 1) < DARK_LUMA) {
    high += 1;
  }
  return [low - 0.5, high + 0.5];
};

const foldSamples = (frame: Frame, rows: number[], from: number, to: number): Sample[] =>
  rows.flatMap((y) => {
    const smoothed = (x: number) =>
      (luma(frame, x, y - 1) + luma(frame, x, y) + luma(frame, x, y + 1)) / 3;
    const step = (x: number) => Math.abs(smoothed(x - 3) - smoothed(x + 3));
    let best = from;
    for (let x = from; x <= to; x += 1) {
      if (step(x) > step(best)) {
        best = x;
      }
    }
    if (step(best) < FOLD_STEP) {
      return [];
    }
    const [before, at, after] = [step(best - 1), step(best), step(best + 1)];
    const curvature = before - 2 * at + after;
    const shift = curvature === 0 ? 0 : (0.5 * (before - after)) / curvature;
    return [{ along: y, across: best + shift }];
  });

const spanOf = (samples: Sample[]) =>
  samples.length === 0
    ? 0
    : Math.max(...samples.map((sample) => sample.along)) -
      Math.min(...samples.map((sample) => sample.along));

const fitSpan = (samples: Sample[]) =>
  spanOf(samples) < MIN_SPAN ? undefined : fitEdge(samples, MIN_SAMPLES);

export const spreadLines = (
  frame: Frame,
  tracking: FootageTracking,
  doors: [number, number],
): SpreadLines => {
  const search = tracking.search;
  const left = Math.max(search[0], Math.ceil(doors[0] + DOOR_MARGIN));
  const right = Math.min(search[2], Math.floor(doors[1] - DOOR_MARGIN));
  if (right - left < MIN_SPAN) {
    return {};
  }
  const box: FootageTracking['search'] = [left, search[1], right, search[3]];
  const lit = (position: number) =>
    (left === search[0] || position > left + SIDE_CLEARANCE) &&
    (right === search[2] || position < right - SIDE_CLEARANCE);
  const litColumns = range(left, right).filter(lit);
  const bottomAll = columnSamples(frame, box, litColumns, false);
  const topAll = columnSamples(frame, box, litColumns, true);
  if (bottomAll.length < MIN_SAMPLES || topAll.length < MIN_SAMPLES) {
    return {};
  }
  const paperTop = Math.min(...topAll.map((sample) => sample.across));
  const paperBottom = Math.max(...bottomAll.map((sample) => sample.across));
  const height = paperBottom - paperTop;
  const [foldFrom, foldTo] = tracking.foldBand;
  const fold =
    left <= foldFrom && right >= foldTo
      ? fitEdge(
          foldSamples(
            frame,
            range(paperTop + height * 0.15, paperBottom - height * 0.15),
            foldFrom,
            foldTo,
          ),
          MIN_SAMPLES,
        )
      : undefined;
  const foldAt = (y: number) =>
    fold === undefined ? (foldFrom + foldTo) / 2 : fold.slope * y + fold.offset;
  const xs = bottomAll.map((sample) => sample.along);
  const inset = (Math.max(...xs) - Math.min(...xs)) * 0.04;
  const leftOf = (sample: Sample) =>
    sample.along > Math.min(...xs) + inset && sample.along < foldAt(sample.across) - FOLD_GAP;
  const rightOf = (sample: Sample) =>
    sample.along < Math.max(...xs) - inset && sample.along > foldAt(sample.across) + FOLD_GAP;
  const sideRows = range(paperTop + height * 0.1, paperBottom - height * 0.18);
  const leftSide = rowSamples(frame, box, sideRows, true).filter((sample) => lit(sample.across));
  const rightSide = rowSamples(frame, box, sideRows, false).filter((sample) => lit(sample.across));
  return {
    fold,
    leftTop: fitSpan(topAll.filter(leftOf)),
    rightTop: fitSpan(topAll.filter(rightOf)),
    leftBottom: fitSpan(bottomAll.filter(leftOf)),
    rightBottom: fitSpan(bottomAll.filter(rightOf)),
    leftSide: leftSide.length > sideRows.length * 0.9 ? fitEdge(leftSide, MIN_SAMPLES) : undefined,
    rightSide:
      rightSide.length > sideRows.length * 0.9 ? fitEdge(rightSide, MIN_SAMPLES) : undefined,
  };
};

export const meanLuma = (frame: Frame, corners: [number, number][]): number => {
  const xs = corners.map(([x]) => x);
  const ys = corners.map(([, y]) => y);
  const [left, right] = [Math.min(...xs), Math.max(...xs)];
  const [top, bottom] = [Math.min(...ys), Math.max(...ys)];
  const inset = 0.25;
  let total = 0;
  let count = 0;
  for (const y of range(top + (bottom - top) * inset, bottom - (bottom - top) * inset)) {
    for (const x of range(left + (right - left) * inset, right - (right - left) * inset)) {
      if (isPaper(frame, x, y)) {
        total += luma(frame, x, y);
        count += 1;
      }
    }
  }
  return count === 0 ? 0 : total / count;
};
