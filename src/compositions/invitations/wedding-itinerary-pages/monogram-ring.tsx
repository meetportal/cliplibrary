import { useVideoConfig } from 'remotion';
import { settle, smooth, TAU, tween } from '../../promo/timing';
import { leaf, polygon, polyline } from './cut-shapes';

const START_ANGLE = -Math.PI * 0.62;

const SWEEP = TAU * 1.06;

const SAMPLES = 280;

const SPRIGS = [0.3, 0.8] as const;

const SPRIG_SPAN = 0.34;

const LEAVES_PER_SPRIG = 5;

const angleAt = (u: number): number => START_ANGLE + u * SWEEP;

const radiusAt = (u: number, radius: number): number => {
  const angle = angleAt(u);
  return (
    radius * (1 + 0.012 * Math.sin(3 * angle + 0.6) + 0.007 * Math.sin(5 * angle + 1.3) - 0.034 * u)
  );
};

const pointAt = (cx: number, cy: number, angle: number, r: number): [number, number] => [
  cx + Math.cos(angle) * r,
  cy + Math.sin(angle) * r,
];

const ringPath = (
  cx: number,
  cy: number,
  radius: number,
  width: number,
  progress: number,
): string => {
  const count = Math.max(2, Math.ceil(progress * SAMPLES));
  const outer: [number, number][] = [];
  const inner: [number, number][] = [];
  for (let step = 0; step <= count; step++) {
    const u = (step / count) * progress;
    const half = (width / 2) * Math.sin(Math.PI * u) ** 0.35;
    const r = radiusAt(u, radius);
    outer.push(pointAt(cx, cy, angleAt(u), r + half));
    inner.push(pointAt(cx, cy, angleAt(u), r - half));
  }
  return polygon([...outer, ...inner.reverse()]);
};

const Sprig = ({
  cx,
  cy,
  radius,
  width,
  at,
  color,
  start,
  frame,
}: {
  cx: number;
  cy: number;
  radius: number;
  width: number;
  at: number;
  color: string;
  start: number;
  frame: number;
}) => {
  const stemRadius = radius + width + 14;
  const center = angleAt(at);
  const stemGrow = tween(frame, [start, start + 18], [0, 1], smooth);
  if (stemGrow <= 0) {
    return null;
  }
  const stem = Array.from({ length: 16 }, (_, index) =>
    pointAt(cx, cy, center + SPRIG_SPAN * ((index / 15) * stemGrow - 0.5), stemRadius),
  );
  const leaves = Array.from({ length: LEAVES_PER_SPRIG }, (_, index) => {
    const along = center + SPRIG_SPAN * ((index + 0.5) / LEAVES_PER_SPRIG - 0.5);
    const grow = tween(frame, [start + 4 + index * 3, start + 22 + index * 3], [0, 1], settle);
    const side = index % 2 === 0 ? 0.62 : -0.62;
    const [x, y] = pointAt(cx, cy, along, stemRadius);
    return grow > 0 ? (
      <path
        key={index}
        d={leaf(x, y, along + side, 36 * grow, 9 * grow)}
        fill={color}
        opacity={grow}
      />
    ) : null;
  });
  return (
    <>
      <path d={polyline(stem)} fill="none" stroke={color} strokeWidth={1.6} />
      {leaves}
    </>
  );
};

export const MonogramRing = ({
  cy,
  radius,
  width,
  leaves,
  ringColor,
  leafColor,
  start,
  drawFrames,
  frame,
}: {
  cy: number;
  radius: number;
  width: number;
  leaves: boolean;
  ringColor: string;
  leafColor: string;
  start: number;
  drawFrames: number;
  frame: number;
}) => {
  const { width: frameWidth, height } = useVideoConfig();
  const cx = frameWidth / 2;
  const progress = tween(frame, [start, start + drawFrames], [0, 1], smooth);
  if (progress <= 0) {
    return null;
  }
  return (
    <svg
      width={frameWidth}
      height={height}
      viewBox={`0 0 ${frameWidth} ${height}`}
      style={{ position: 'absolute', inset: 0 }}
      aria-hidden="true"
    >
      <path d={ringPath(cx, cy, radius, width, progress)} fill={ringColor} />
      {leaves
        ? SPRIGS.map((at) => (
            <Sprig
              key={at}
              cx={cx}
              cy={cy}
              radius={radius}
              width={width}
              at={at}
              color={leafColor}
              start={start + drawFrames * at * 0.8}
              frame={frame}
            />
          ))
        : null}
    </svg>
  );
};
