import type { Domino } from './chain';

export const FLAT = Math.PI / 2;

type Point = readonly [number, number];

export const slabCorners = (domino: Domino, angle: number): Point[] => {
  const sin = Math.sin(angle);
  const cos = Math.cos(angle);
  const at = (v: number, u: number): Point => [domino.pivot + u * sin + v * cos, u * cos - v * sin];
  return [
    at(0, 0),
    at(-domino.thickness, 0),
    at(-domino.thickness, domino.length),
    at(0, domino.length),
  ];
};

const separated = (first: Point[], second: Point[]): boolean => {
  for (const shape of [first, second]) {
    for (let index = 0; index < shape.length; index++) {
      const [ax, ay] = shape[index] ?? [0, 0];
      const [bx, by] = shape[(index + 1) % shape.length] ?? [0, 0];
      const nx = by - ay;
      const ny = ax - bx;
      const project = (points: Point[]) => points.map(([x, y]) => x * nx + y * ny);
      const a = project(first);
      const b = project(second);
      const tolerance = 0.02 * Math.hypot(nx, ny);
      if (
        Math.max(...a) <= Math.min(...b) + tolerance ||
        Math.max(...b) <= Math.min(...a) + tolerance
      ) {
        return true;
      }
    }
  }
  return false;
};

const STEP = Math.PI / 180;

export const restAngle = (domino: Domino, next: Domino, nextAngle: number): number => {
  const blocker = slabCorners(next, nextAngle);
  const blocked = (angle: number) => !separated(slabCorners(domino, angle), blocker);
  let free = 0;
  for (let angle = STEP; angle < FLAT + STEP / 2; angle += STEP) {
    const tried = Math.min(angle, FLAT);
    if (blocked(tried)) {
      let low = free;
      let high = tried;
      for (let round = 0; round < 22; round++) {
        const middle = (low + high) / 2;
        if (blocked(middle)) {
          high = middle;
        } else {
          low = middle;
        }
      }
      return low;
    }
    free = tried;
  }
  return FLAT;
};

const SUBSTEPS = 16;
const NUDGE = 0.03;
const LIMIT = 400;

type Fall = { angle: number; speed: number; time: number };

const integrate = (spin: number, gravity: number, frames: number, target: number): Fall => {
  let angle = 0;
  let speed = spin;
  const dt = 1 / SUBSTEPS;
  const steps = Math.round(frames * SUBSTEPS);
  for (let step = 0; step < steps; step++) {
    const nextSpeed = speed + gravity * Math.sin(angle + NUDGE) * dt;
    const nextAngle = angle + nextSpeed * dt;
    if (nextAngle >= target) {
      const share = (target - angle) / Math.max(1e-9, nextAngle - angle);
      return { angle: target, speed: nextSpeed, time: (step + share) * dt };
    }
    angle = nextAngle;
    speed = nextSpeed;
  }
  return { angle, speed, time: Number.POSITIVE_INFINITY };
};

export type Topple = {
  spin: number;
  gravity: number;
  frames: number;
  target: number;
  impact: number;
};

export const solveTopple = (spin: number, target: number, frames: number): Topple => {
  const safeSpin = Math.min(spin, (0.9 * target) / frames);
  const arrival = (pull: number) => integrate(safeSpin, pull, LIMIT, target).time;
  let low = 0;
  let high = 0.001;
  while (arrival(high) > frames && high < 1e3) {
    high *= 2;
  }
  for (let round = 0; round < 40; round++) {
    const middle = (low + high) / 2;
    if (arrival(middle) > frames) {
      low = middle;
    } else {
      high = middle;
    }
  }
  const gravity = high;
  const fall = integrate(safeSpin, gravity, LIMIT, target);
  return {
    spin: safeSpin,
    gravity,
    frames,
    target,
    impact: fall.speed * (fall.time / frames),
  };
};

export const toppleAngle = (topple: Topple, elapsed: number): number => {
  if (elapsed <= 0) {
    return 0;
  }
  if (elapsed >= topple.frames) {
    return topple.target;
  }
  const arrival = integrate(topple.spin, topple.gravity, LIMIT, topple.target).time;
  const scaled = (elapsed * arrival) / topple.frames;
  return integrate(topple.spin, topple.gravity, scaled, topple.target).angle;
};

export const toppleSpeed = (topple: Topple): number => topple.impact;
