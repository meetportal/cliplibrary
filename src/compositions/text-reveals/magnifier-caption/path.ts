import type { MagnifierCaptionProps } from '@/schemas';

export type Point = { x: number; y: number };

type Pose = { lx: number; ly: number; angle: number; fx: number; fy: number };

export type Key = { time: number; pose: Pose; speed: number; orbit?: number };

const TARGET_PATH: readonly Point[] = [
  { x: -205, y: -564 },
  { x: 189, y: -757 },
  { x: 446, y: -401 },
  { x: 772, y: -109 },
  { x: 539, y: 263 },
  { x: 390, y: 675 },
  { x: -42, y: 599 },
  { x: -480, y: 615 },
  { x: -571, y: 185 },
  { x: -330, y: -100 },
];

const LENS_PATH: readonly { x: number; y: number; angle: number }[] = [
  { x: -53, y: -96, angle: 10 },
  { x: 65, y: -120, angle: 34 },
  { x: 65, y: -76, angle: 24 },
  { x: -19, y: -48, angle: 8 },
  { x: 42, y: -70, angle: 18 },
  { x: 32, y: 0, angle: 15 },
  { x: 96, y: -38, angle: 26 },
  { x: 32, y: -46, angle: 10 },
  { x: 15, y: -7, angle: 4 },
  { x: -9, y: 52, angle: -8 },
];

const LAST_FRAME = 449;
const MIN_INTERVAL = 8;
const MAX_INTERVAL = 60;
const HOLD_SPEED = 2;
const LENS_DRIFT = 50;
const ORBIT_RADIUS = 60;
const ORBIT_AFTER = 90;
const ORBIT_SPEED = 1.6;

export const targetPoint = (index: number, spread: number): Point => {
  const base = TARGET_PATH[index % TARGET_PATH.length] ?? { x: 0, y: 0 };
  const lap = Math.floor(index / TARGET_PATH.length);
  return { x: base.x * spread, y: (base.y + lap * 1900) * spread };
};

const restPose = (lens: MagnifierCaptionProps['lens']): Pose => ({
  lx: lens.x,
  ly: lens.y,
  angle: lens.tilt,
  fx: 0,
  fy: 0,
});

export type LensRoom = { top: number; bottom: number };

const HANDLE_REACH = 31;

const wordPose = (index: number, props: MagnifierCaptionProps, room: LensRoom): Pose => {
  const { lens } = props;
  const delta = LENS_PATH[index % LENS_PATH.length] ?? { x: 0, y: 0, angle: 0 };
  const focus = targetPoint(index, props.cells.spread);
  const angle = lens.tilt + delta.angle * lens.sway;
  const below =
    lens.handle > 0
      ? (lens.radius + lens.rimWidth / 2 + HANDLE_REACH + lens.handle) *
        Math.cos((angle * Math.PI) / 180)
      : lens.radius;
  const lowest = Math.max(lens.y, room.bottom - below);
  const highest = Math.min(lens.y, room.top + lens.radius);
  const ly = lens.y + delta.y * lens.sway;
  return {
    lx: lens.x + delta.x * lens.sway,
    ly: Math.min(lowest, Math.max(highest, ly)),
    angle,
    fx: focus.x,
    fy: focus.y,
  };
};

export const wordTimes = (count: number, timing: MagnifierCaptionProps['timing']): number[] => {
  const first = Math.min(timing.firstWord, LAST_FRAME - 120);
  const span = Math.max(timing.lastWord - first, MIN_INTERVAL * (count - 1));
  const interval = count > 1 ? Math.min(MAX_INTERVAL, span / (count - 1)) : 0;
  return Array.from({ length: count }, (_, index) => first + index * interval);
};

export const pathKeys = (props: MagnifierCaptionProps, count: number, room: LensRoom): Key[] => {
  const { timing, lens } = props;
  const rest = restPose(lens);
  const times = wordTimes(count, timing);
  const keys: Key[] = [{ time: 0, pose: rest, speed: timing.glide }];
  times.forEach((time, index) => {
    keys.push({ time, pose: wordPose(index, props, room), speed: timing.glide });
  });
  const last = keys.at(-1) ?? keys[0];
  const settle = Math.min(
    LAST_FRAME - 6,
    Math.max(timing.returnAt, (last?.time ?? 0) + 30) + timing.returnFrames,
  );
  const leave = Math.max((last?.time ?? 0) + 20, Math.min(timing.returnAt, settle - 20));
  if (count > 0 && last !== undefined) {
    const held = last.pose;
    const span = Math.max(1, leave - last.time);
    const toward = { x: rest.lx - held.lx, y: rest.ly - held.ly };
    const length = Math.hypot(toward.x, toward.y);
    const step = Math.min(length, LENS_DRIFT) / Math.max(1, length);
    const lensMove = { x: toward.x * step, y: toward.y * step };
    const homeward = { x: rest.lx - (held.lx - held.fx), y: rest.ly - (held.ly - held.fy) };
    const homeLength = Math.hypot(homeward.x, homeward.y);
    const along =
      homeLength > 1 ? { x: homeward.x / homeLength, y: homeward.y / homeLength } : { x: 0, y: 1 };
    const slide = Math.min(
      lens.radius * 0.42,
      Math.max(0, HOLD_SPEED * span - Math.hypot(lensMove.x, lensMove.y)),
    );
    keys[keys.length - 1] = {
      ...last,
      pose: { ...held, fx: held.fx + (along.x * slide) / 2, fy: held.fy + (along.y * slide) / 2 },
    };
    keys.push({
      time: leave,
      pose: {
        ...held,
        lx: held.lx + lensMove.x,
        ly: held.ly + lensMove.y,
        fx: held.fx - (along.x * slide) / 2,
        fy: held.fy - (along.y * slide) / 2,
      },
      speed: (Math.hypot(lensMove.x, lensMove.y) + slide) / span,
      orbit: Math.min(ORBIT_RADIUS, Math.max(0, (span - ORBIT_AFTER) / 4)),
    });
  }
  keys.push({ time: Math.max(settle, leave + 12), pose: rest, speed: 0 });
  return keys;
};

const subtract = (a: Pose, b: Pose): Pose => ({
  lx: a.lx - b.lx,
  ly: a.ly - b.ly,
  angle: a.angle - b.angle,
  fx: a.fx - b.fx,
  fy: a.fy - b.fy,
});

const scale = (a: Pose, by: number): Pose => ({
  lx: a.lx * by,
  ly: a.ly * by,
  angle: a.angle * by,
  fx: a.fx * by,
  fy: a.fy * by,
});

const travel = (step: Pose): number =>
  Math.max(Math.hypot(step.lx - step.fx, step.ly - step.fy), Math.hypot(step.lx, step.ly));

const tangents = (keys: readonly Key[]): Pose[] =>
  keys.map((key, index) => {
    const before = keys[index - 1]?.pose ?? key.pose;
    const after = keys[index + 1]?.pose ?? key.pose;
    const raw = scale(subtract(after, before), index === 0 || index === keys.length - 1 ? 1 : 0.5);
    const limit = Math.min(
      index > 0 ? travel(subtract(key.pose, before)) : Number.POSITIVE_INFINITY,
      index < keys.length - 1 ? travel(subtract(after, key.pose)) : Number.POSITIVE_INFINITY,
    );
    const size = travel(raw);
    return size > limit && size > 0 ? scale(raw, limit / size) : raw;
  });

const hermite = (u: number, start: number, end: number): number =>
  (start + end - 2) * u ** 3 + (3 - 2 * start - end) * u ** 2 + start * u;

const blend = (a: Pose, b: Pose, ta: Pose, tb: Pose, s: number): Pose => {
  const h00 = 2 * s ** 3 - 3 * s ** 2 + 1;
  const h10 = s ** 3 - 2 * s ** 2 + s;
  const h01 = -2 * s ** 3 + 3 * s ** 2;
  const h11 = s ** 3 - s ** 2;
  const at = (field: keyof Pose) =>
    h00 * a[field] + h10 * ta[field] + h01 * b[field] + h11 * tb[field];
  return { lx: at('lx'), ly: at('ly'), angle: at('angle'), fx: at('fx'), fy: at('fy') };
};

const ARC_SAMPLES = 64;

const withOrbit = (pose: Pose, radius: number, elapsed: number, length: number): Pose => {
  if (radius <= 0) {
    return pose;
  }
  const turn = (elapsed * ORBIT_SPEED) / radius;
  const weight = Math.sin((Math.PI * elapsed) / length) ** 2;
  const x = radius * Math.sin(turn) * weight;
  const y = -radius * 0.35 * (1 - Math.cos(turn)) * weight;
  return { ...pose, lx: pose.lx + x, ly: pose.ly + y, fx: pose.fx, fy: pose.fy };
};

const travelPoint = (pose: Pose) => ({ x: pose.lx - pose.fx, y: pose.ly - pose.fy });

const arcMarks = (curve: (at: number) => Pose): number[] => {
  const marks = [0];
  let previous = curve(0);
  for (let step = 1; step <= ARC_SAMPLES; step++) {
    const next = curve(step / ARC_SAMPLES);
    const a = travelPoint(previous);
    const b = travelPoint(next);
    const moved = Math.max(
      Math.hypot(b.x - a.x, b.y - a.y),
      Math.hypot(next.lx - previous.lx, next.ly - previous.ly),
    );
    marks.push((marks.at(-1) ?? 0) + moved);
    previous = next;
  }
  return marks;
};

const sAtDistance = (marks: readonly number[], distance: number): number => {
  for (let step = 1; step < marks.length; step++) {
    const end = marks[step] ?? 0;
    if (end >= distance) {
      const start = marks[step - 1] ?? 0;
      const within = end > start ? (distance - start) / (end - start) : 0;
      return (step - 1 + within) / ARC_SAMPLES;
    }
  }
  return 1;
};

export type PathState = { lens: Point & { angle: number }; offset: Point };

export const pathState = (frame: number, keys: readonly Key[], sway: number): PathState => {
  const slopes = tangents(keys);
  const lastIndex = keys.length - 1;
  let pose = keys[lastIndex]?.pose ?? { lx: 540, ly: 960, angle: 0, fx: 0, fy: 0 };
  for (let index = 0; index < lastIndex; index++) {
    const from = keys[index];
    const to = keys[index + 1];
    const fromSlope = slopes[index];
    const toSlope = slopes[index + 1];
    if (!(from && to && fromSlope && toSlope) || frame > to.time) {
      continue;
    }
    const length = Math.max(1, to.time - from.time);
    const curve = (at: number) => blend(from.pose, to.pose, fromSlope, toSlope, at);
    const marks = arcMarks(curve);
    const distance = marks.at(-1) ?? 0;
    const pace = (key: Key) => Math.min(2.5, (key.speed * length) / Math.max(1, distance));
    const u = Math.max(0, Math.min(1, (frame - from.time) / length));
    const s = sAtDistance(marks, hermite(u, pace(from), pace(to)) * distance);
    pose = withOrbit(curve(s), to.orbit ?? 0, frame - from.time, length);
    break;
  }
  const swayFrame = Math.min(frame, keys[lastIndex]?.time ?? frame);
  const lens = {
    x: pose.lx + Math.sin(swayFrame / 71) * 3 * sway,
    y: pose.ly + Math.cos(swayFrame / 59) * 3 * sway,
    angle: pose.angle + Math.sin(swayFrame / 53) * 1.2 * sway,
  };
  return { lens, offset: { x: lens.x - pose.fx, y: lens.y - pose.fy } };
};

export const keyBounds = (keys: readonly Key[]) => {
  const xs = keys.flatMap(({ pose }) => [pose.fx - pose.lx, pose.fx - pose.lx + 1080]);
  const ys = keys.flatMap(({ pose }) => [pose.fy - pose.ly, pose.fy - pose.ly + 1920]);
  return {
    left: Math.min(...xs),
    right: Math.max(...xs),
    top: Math.min(...ys),
    bottom: Math.max(...ys),
  };
};
