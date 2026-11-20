import { type Collage, PAN } from './layout';

export type Point = { x: number; y: number };

type Knot = Collage['knots'][number];

const riseAt = (knots: Knot[], time: number): number => {
  const first = knots[0];
  const last = knots.at(-1);
  if (first === undefined || last === undefined) {
    return 0;
  }
  if (time >= last.at) {
    return last.rise;
  }
  const second = knots[1];
  if (time <= first.at) {
    if (second === undefined || second.at <= first.at) {
      return first.rise;
    }
    return first.rise + ((second.rise - first.rise) * (time - first.at)) / (second.at - first.at);
  }
  for (let at = 1; at < knots.length; at++) {
    const from = knots[at - 1];
    const to = knots[at];
    if (from !== undefined && to !== undefined && time <= to.at) {
      const span = Math.max(1e-6, to.at - from.at);
      return from.rise + ((to.rise - from.rise) * (time - from.at)) / span;
    }
  }
  return last.rise;
};

const smoothed = (knots: Knot[], frame: number, half: number): number => {
  const samples = Math.max(1, Math.round(half * 2));
  let sum = 0;
  for (let at = 0; at <= samples; at++) {
    sum += riseAt(knots, frame - half + (at * half * 2) / samples);
  }
  return sum / (samples + 1);
};

export const planCamera = (
  collage: Collage,
  cameraY: number,
  settleFrames: number,
  frames: number,
): Point[] => {
  const target = -cameraY;
  const knots: Knot[] = [
    ...collage.knots
      .filter((knot) => knot.at < collage.brandAt)
      .map((knot) => ({ at: knot.at, rise: Math.min(knot.rise, target) })),
    { at: collage.brandAt, rise: target },
  ];
  const half = settleFrames / 2;
  const ideal = Array.from({ length: frames }, (_, frame) => smoothed(knots, frame, half));
  const out: Point[] = [];
  let current = Math.min(target, Math.round(ideal[0] ?? target));
  for (let frame = 0; frame < frames; frame++) {
    if (frame > 0) {
      const speed = Math.max(1, Math.round((ideal[frame] ?? 0) - (ideal[frame - 1] ?? 0)));
      current = Math.min(target, current + speed);
    }
    out.push({ x: frame * PAN, y: -current });
  }
  return out;
};
