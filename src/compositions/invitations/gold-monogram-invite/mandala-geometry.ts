import { TAU } from '../../promo/timing';

export type MandalaRing =
  | { kind: 'lines'; paths: string[] }
  | { kind: 'dots'; dots: { x: number; y: number; r: number }[] };

const point = (radius: number, angle: number, side = 0): string => {
  const x = radius * Math.cos(angle) - side * Math.sin(angle);
  const y = radius * Math.sin(angle) + side * Math.cos(angle);
  return `${x.toFixed(2)} ${y.toFixed(2)}`;
};

const circle = (radius: number): string =>
  `M ${point(radius, 0)} A ${radius} ${radius} 0 1 1 ${point(radius, TAU / 2)} A ${radius} ${radius} 0 1 1 ${point(radius, 0)}`;

const angles = (count: number, offset = 0): number[] =>
  Array.from({ length: count }, (_, index) => ((index + offset) / count) * TAU - TAU / 4);

const lens = (inner: number, outer: number, width: number, angle: number): string => {
  const middle = (inner + outer) / 2;
  return `M ${point(inner, angle)} Q ${point(middle, angle, width)} ${point(outer, angle)} Q ${point(middle, angle, -width)} ${point(inner, angle)}`;
};

const bud = (inner: number, outer: number, width: number, angle: number): string => {
  const length = outer - inner;
  const near = inner + length * 0.3;
  const far = outer - length * 0.22;
  return `M ${point(inner, angle)} C ${point(near, angle, width)} ${point(far, angle, width * 0.9)} ${point(outer, angle)} C ${point(far, angle, -width * 0.9)} ${point(near, angle, -width)} ${point(inner, angle)}`;
};

const scallop = (radius: number, height: number, from: number, to: number): string =>
  `M ${point(radius, from)} Q ${point(radius + height * 2, (from + to) / 2)} ${point(radius, to)}`;

const spike = (inner: number, outer: number, width: number, angle: number): string =>
  `M ${point(inner, angle, -width)} L ${point(outer, angle)} L ${point(inner, angle, width)}`;

const dots = (radius: number, count: number, size: number, offset = 0): MandalaRing => ({
  kind: 'dots',
  dots: angles(count, offset).map((angle) => ({
    x: radius * Math.cos(angle),
    y: radius * Math.sin(angle),
    r: size,
  })),
});

const lines = (paths: string[]): MandalaRing => ({ kind: 'lines', paths });

export const mandalaRings = (radius: number): MandalaRing[] => {
  const r = (share: number) => share * radius;
  const step24 = TAU / 24;
  return [
    lines([circle(r(0.06))]),
    lines(angles(8).map((angle) => lens(r(0.075), r(0.2), r(0.04), angle))),
    lines([circle(r(0.22))]),
    lines(angles(16, 0.5).map((angle) => bud(r(0.235), r(0.4), r(0.045), angle))),
    dots(r(0.43), 32, r(0.0055)),
    lines([circle(r(0.46)), circle(r(0.48))]),
    lines(angles(24).map((angle) => scallop(r(0.48), r(0.03), angle, angle + step24))),
    lines(
      angles(24, 0.5).flatMap((angle) => [
        bud(r(0.55), r(0.78), r(0.055), angle),
        lens(r(0.6), r(0.73), r(0.016), angle),
      ]),
    ),
    dots(r(0.81), 48, r(0.0045)),
    lines([circle(r(0.84)), circle(r(0.86))]),
    lines(angles(48, 0.5).map((angle) => spike(r(0.875), r(0.95), r(0.014), angle))),
    lines([circle(r(0.975))]),
  ];
};
