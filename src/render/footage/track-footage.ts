import { writeFileSync } from 'node:fs';
import { FOOTAGE } from '@/footage';
import type { FootageSpec } from '@/footage/footage-spec';
import { crossRowColumn, type Line, type Point } from './fit-line';
import { plateFile, trackFile } from './footage-paths';
import { doorEdges, type Frame, meanLuma, type SpreadLines, spreadLines } from './page-fit';

const LINE_KEYS = [
  'fold',
  'leftSide',
  'rightSide',
  'leftTop',
  'rightTop',
  'leftBottom',
  'rightBottom',
] as const;

const SMOOTHING = [1, 2, 3, 2, 1];

type Measured = { doors: [number, number]; lines: SpreadLines; frame: Frame };

const readFrames = async function* (spec: FootageSpec): AsyncGenerator<Frame> {
  const size = spec.width * spec.height * 3;
  const decoder = Bun.spawn(
    [
      'ffmpeg',
      '-v',
      'error',
      '-i',
      plateFile(spec),
      '-vf',
      `crop=${spec.width}:${spec.height}:0:0`,
      '-f',
      'rawvideo',
      '-pix_fmt',
      'rgb24',
      '-',
    ],
    { stdout: 'pipe' },
  );
  const reader = decoder.stdout.getReader();
  let pending = new Uint8Array(0);
  for (let next = await reader.read(); !next.done; next = await reader.read()) {
    const chunk = next.value;
    const joined = new Uint8Array(pending.length + chunk.length);
    joined.set(pending);
    joined.set(chunk, pending.length);
    let offset = 0;
    while (joined.length - offset >= size) {
      yield { data: joined.slice(offset, offset + size), width: spec.width, height: spec.height };
      offset += size;
    }
    pending = joined.slice(offset);
  }
  await decoder.exited;
};

const nearestWith = <T>(values: (T | undefined)[], index: number): T | undefined => {
  for (let distance = 0; distance < values.length; distance += 1) {
    const before = values[index - distance];
    if (before !== undefined) {
      return before;
    }
    const after = values[index + distance];
    if (after !== undefined) {
      return after;
    }
  }
  return undefined;
};

const midpoint = (a: Point, b: Point): Point => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];

const corners = (lines: Required<{ [K in keyof SpreadLines]: Line }>) => {
  const foldTop = midpoint(
    crossRowColumn(lines.leftTop, lines.fold),
    crossRowColumn(lines.rightTop, lines.fold),
  );
  const foldBottom = midpoint(
    crossRowColumn(lines.leftBottom, lines.fold),
    crossRowColumn(lines.rightBottom, lines.fold),
  );
  return {
    left: [
      crossRowColumn(lines.leftTop, lines.leftSide),
      foldTop,
      foldBottom,
      crossRowColumn(lines.leftBottom, lines.leftSide),
    ],
    right: [
      foldTop,
      crossRowColumn(lines.rightTop, lines.rightSide),
      crossRowColumn(lines.rightBottom, lines.rightSide),
      foldBottom,
    ],
  };
};

const smooth = (series: Point[][], index: number): Point[] =>
  (series[index] ?? []).map((_, corner) => {
    let weight = 0;
    const sum: Point = [0, 0];
    SMOOTHING.forEach((w, offset) => {
      const point = series[index + offset - 2]?.[corner];
      if (point !== undefined) {
        sum[0] += point[0] * w;
        sum[1] += point[1] * w;
        weight += w;
      }
    });
    return [sum[0] / weight, sum[1] / weight];
  });

const round = (value: number) => Math.round(value * 100) / 100;

const track = async (spec: FootageSpec) => {
  const measured: Measured[] = [];
  for await (const frame of readFrames(spec)) {
    const doors = doorEdges(frame, spec.tracking);
    measured.push({ doors, lines: spreadLines(frame, spec.tracking, doors), frame });
    if (measured.length % 24 === 0) {
      console.info(`Tracked ${measured.length} frames`);
    }
  }
  const filled = measured.map((_, index) => {
    const lines = Object.fromEntries(
      LINE_KEYS.map((key) => [
        key,
        nearestWith(
          measured.map((entry) => entry.lines[key]),
          index,
        ),
      ]),
    );
    if (LINE_KEYS.some((key) => lines[key] === undefined)) {
      throw new Error(`No measurement of every page edge near frame ${index}`);
    }
    return corners(lines as Required<{ [K in keyof SpreadLines]: Line }>);
  });
  const leftSeries = filled.map((entry) => entry.left as Point[]);
  const rightSeries = filled.map((entry) => entry.right as Point[]);
  const pages = measured.map((entry, index) => {
    const left = smooth(leftSeries, index);
    const right = smooth(rightSeries, index);
    const visible = entry.doors[1] - entry.doors[0] > 40;
    return {
      left,
      right,
      luma: visible
        ? [meanLuma(entry.frame, left), meanLuma(entry.frame, right)]
        : [undefined, undefined],
    };
  });
  const brightest = Math.max(...pages.flatMap((page) => page.luma.filter((v) => v !== undefined)));
  const frames = pages.map((page, index) => {
    const light = [0, 1].map((side) => {
      const value = nearestWith(
        pages.map((entry) => (entry.luma[side] ? entry.luma[side] : undefined)),
        index,
      );
      return round((value ?? brightest) / brightest);
    });
    return {
      doors: measured[index]?.doors.map(round),
      left: page.left.map((point) => point.map(round)),
      right: page.right.map((point) => point.map(round)),
      light,
    };
  });
  const output = { width: spec.width, height: spec.height, fps: spec.fps, frames };
  writeFileSync(trackFile(spec), `${JSON.stringify(output)}\n`);
  console.info(`Wrote ${trackFile(spec)} (${frames.length} frames)`);
};

const chosen = FOOTAGE.find((entry) => entry.id === process.argv[2]);
if (chosen === undefined) {
  console.error(`Usage: bun run footage:track <${FOOTAGE.map((entry) => entry.id).join('|')}>`);
  process.exit(1);
}
await track(chosen);
