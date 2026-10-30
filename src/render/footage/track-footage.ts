import { writeFileSync } from 'node:fs';
import { FOOTAGE } from '@/footage';
import type { FootageSpec, FootageTracking } from '@/footage/footage-spec';
import { plateFrameOrder } from './assemble-plate';
import { doorEdges } from './door-edges';
import { plateFile, trackFile } from './footage-paths';
import {
  alignCorners,
  type Corners,
  type Grid,
  halve,
  makeGrid,
  type Plane,
  sampleTemplate,
  toPlane,
} from './plane-track';

const GRID = makeGrid(40, 56, 0.05);
const DOOR_MARGIN = 6;
const HOLD_BELOW = 0.25;
const FULL_ABOVE = 0.92;
const STEADY_SIGMA = 3;
const STEADY_REACH = 8;
const STEADY_LIMIT = 4;

type Pose = { left: Corners; right: Corners };

const readPlanes = async (spec: FootageSpec): Promise<Plane[]> => {
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
  const planes: Plane[] = [];
  const reader = decoder.stdout.getReader();
  let pending = new Uint8Array(0);
  for (let next = await reader.read(); !next.done; next = await reader.read()) {
    const joined = new Uint8Array(pending.length + next.value.length);
    joined.set(pending);
    joined.set(next.value, pending.length);
    let offset = 0;
    while (joined.length - offset >= size) {
      planes.push(toPlane(joined.subarray(offset, offset + size), spec.width, spec.height));
      offset += size;
    }
    pending = joined.slice(offset);
  }
  await decoder.exited;
  return planes;
};

type Level = { plane: Plane; scale: number };

const levels = (plane: Plane): Level[] => [
  { plane: halve(plane), scale: 0.5 },
  { plane, scale: 1 },
];

const templates = (anchor: Plane, corners: Corners, grid: Grid) =>
  levels(anchor).map(({ plane, scale }) => sampleTemplate(plane, corners, grid, scale));

const alignPage = (
  plane: Plane,
  start: Corners,
  pageTemplates: Float64Array[],
  doors: [number, number],
): Corners => {
  const allowed = (x: number) => x > doors[0] + DOOR_MARGIN && x < doors[1] - DOOR_MARGIN;
  const xs = start.map(([x]) => x);
  const [low, high] = [Math.min(...xs), Math.max(...xs)];
  const shown =
    (Math.min(high, doors[1] - DOOR_MARGIN) - Math.max(low, doors[0] + DOOR_MARGIN)) / (high - low);
  if (shown < HOLD_BELOW) {
    return start;
  }
  const motion = shown < FULL_ABOVE ? 'shift' : 'full';
  let corners = start;
  for (const [index, { plane: level, scale }] of levels(plane).entries()) {
    const template = pageTemplates[index];
    if (template !== undefined) {
      corners = alignCorners(
        corners,
        { plane: level, template, grid: GRID, scale, allowed },
        motion,
      );
    }
  }
  return corners;
};

const shareFold = ({ left, right }: Pose): Pose => {
  const top: [number, number] = [(left[1][0] + right[0][0]) / 2, (left[1][1] + right[0][1]) / 2];
  const bottom: [number, number] = [(left[2][0] + right[3][0]) / 2, (left[2][1] + right[3][1]) / 2];
  return { left: [left[0], top, bottom, left[3]], right: [top, right[1], right[2], bottom] };
};

const trackRun = (
  planes: Plane[],
  frames: number[],
  anchorIndex: number,
  tracking: FootageTracking,
  doors: [number, number][],
): Map<number, Pose> => {
  const anchorPlane = planes[anchorIndex];
  if (anchorPlane === undefined) {
    throw new Error(`Missing anchor frame ${anchorIndex}`);
  }
  const anchorPose: Pose = { left: tracking.anchor.left, right: tracking.anchor.right };
  const leftTemplates = templates(anchorPlane, anchorPose.left, GRID);
  const rightTemplates = templates(anchorPlane, anchorPose.right, GRID);
  const poses = new Map<number, Pose>([[anchorIndex, anchorPose]]);
  const walk = (order: number[]) => {
    let previous = anchorPose;
    for (const index of order) {
      const plane = planes[index];
      const gap = doors[index] ?? [0, plane?.width ?? 0];
      if (plane !== undefined) {
        previous = shareFold({
          left: alignPage(plane, previous.left, leftTemplates, gap),
          right: alignPage(plane, previous.right, rightTemplates, gap),
        });
        poses.set(index, previous);
      }
    }
  };
  walk(frames.filter((index) => index > anchorIndex));
  walk(frames.filter((index) => index < anchorIndex).reverse());
  return poses;
};

const runsOf = (spec: FootageSpec) => {
  const order = plateFrameOrder(spec);
  const runs: { shot: string; frames: number[]; sources: number[] }[] = [];
  order.forEach(({ shot, frame }, index) => {
    const last = runs.at(-1);
    if (last !== undefined && last.shot === shot) {
      last.frames.push(index);
      last.sources.push(frame);
    } else {
      runs.push({ shot, frames: [index], sources: [frame] });
    }
  });
  return runs;
};

const round = (value: number) => Math.round(value * 100) / 100;

const center = ({ left, right }: Pose): [number, number] => {
  const points = [...left, ...right];
  return [
    points.reduce((sum, [x]) => sum + x, 0) / points.length,
    points.reduce((sum, [, y]) => sum + y, 0) / points.length,
  ];
};

const steadyOffsets = (poses: Pose[], runs: { frames: number[] }[]): [number, number][] => {
  const offsets: [number, number][] = poses.map(() => [0, 0]);
  for (const { frames } of runs) {
    const centers = frames.map((index) => center(poses[index] as Pose));
    frames.forEach((index, at) => {
      let weight = 0;
      const sum: [number, number] = [0, 0];
      for (let offset = -STEADY_REACH; offset <= STEADY_REACH; offset += 1) {
        const point = centers[at + offset];
        if (point !== undefined) {
          const w = Math.exp(-(offset * offset) / (2 * STEADY_SIGMA * STEADY_SIGMA));
          sum[0] += point[0] * w;
          sum[1] += point[1] * w;
          weight += w;
        }
      }
      const own = centers[at] ?? [0, 0];
      const clamp = (value: number) => Math.max(-STEADY_LIMIT, Math.min(STEADY_LIMIT, value));
      offsets[index] = [clamp(sum[0] / weight - own[0]), clamp(sum[1] / weight - own[1])];
    });
  }
  return offsets;
};

const track = async (spec: FootageSpec) => {
  const planes = await readPlanes(spec);
  const doors: [number, number][] = new Array(planes.length).fill([0, spec.width]);
  const poses = new Map<number, Pose>();
  for (const run of runsOf(spec)) {
    const shot = spec.shots.find((entry) => entry.name === run.shot);
    if (shot === undefined) {
      throw new Error(`The plate uses an unknown shot ${run.shot}`);
    }
    for (const index of run.frames) {
      const plane = planes[index];
      if (shot.tracking.doors !== undefined && plane !== undefined) {
        doors[index] = doorEdges(plane, shot.tracking.doors);
      }
    }
    const nearest = run.sources.reduce(
      (best, source, at) =>
        Math.abs(source - shot.tracking.anchor.frame) <
        Math.abs((run.sources[best] ?? 0) - shot.tracking.anchor.frame)
          ? at
          : best,
      0,
    );
    const anchorIndex = run.frames[nearest] ?? 0;
    for (const [index, pose] of trackRun(planes, run.frames, anchorIndex, shot.tracking, doors)) {
      poses.set(index, pose);
    }
    console.info(`Tracked ${run.frames.length} frames of ${run.shot}`);
  }
  const ordered = planes.map((_, index) => {
    const pose = poses.get(index);
    if (pose === undefined) {
      throw new Error(`No pose for frame ${index}`);
    }
    return pose;
  });
  const steady = steadyOffsets(
    ordered,
    runsOf(spec).filter(
      ({ shot }) => spec.shots.find((entry) => entry.name === shot)?.tracking.doors === undefined,
    ),
  );
  const frames = ordered.map((pose, index) => ({
    doors: (doors[index] ?? [0, spec.width]).map(round),
    left: pose.left.map((point) => point.map(round)),
    right: pose.right.map((point) => point.map(round)),
    steady: (steady[index] ?? [0, 0]).map(round),
  }));
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
