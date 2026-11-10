import type { MandalaPattern } from '@/schemas';

type Point = [number, number];

export type MandalaRing = { strokes: string[]; fills: string[]; width: number };

const fixed = (value: number): string => value.toFixed(1);

const pt = ([x, y]: Point): string => `${fixed(x)} ${fixed(y)}`;

const polar = (radius: number, angle: number, [cx, cy]: Point = [0, 0]): Point => [
  cx + radius * Math.cos(angle),
  cy + radius * Math.sin(angle),
];

const around = <T>(count: number, offset: number, build: (angle: number) => T): T[] =>
  Array.from({ length: count }, (_, index) =>
    build(offset + (index / count) * Math.PI * 2 - Math.PI / 2),
  );

export const circle = (radius: number, [cx, cy]: Point = [0, 0]): string =>
  `M ${pt([cx, cy - radius])} A ${fixed(radius)} ${fixed(radius)} 0 1 1 ${pt([cx, cy + radius])} A ${fixed(radius)} ${fixed(radius)} 0 1 1 ${pt([cx, cy - radius])}`;

const lobe = (angle: number, r0: number, r1: number, spread: number, center: Point = [0, 0]) => {
  const reach = r1 + (r1 - r0) * 0.18;
  return `M ${pt(polar(r0, angle - spread, center))} C ${pt(polar(reach, angle - spread * 1.5, center))} ${pt(polar(reach, angle + spread * 1.5, center))} ${pt(polar(r0, angle + spread, center))}`;
};

const pointed = (angle: number, r0: number, r1: number, spread: number, closed = false) => {
  const length = r1 - r0;
  const a1 = polar(r0 + length * 0.5, angle - spread * 1.3);
  const a2 = polar(r1 - length * 0.22, angle - spread * 0.32);
  const b1 = polar(r0 + length * 0.5, angle + spread * 1.3);
  const b2 = polar(r1 - length * 0.22, angle + spread * 0.32);
  return `M ${pt(polar(r0, angle - spread))} C ${pt(a1)} ${pt(a2)} ${pt(polar(r1, angle))} C ${pt(b2)} ${pt(b1)} ${pt(polar(r0, angle + spread))}${closed ? ' Z' : ''}`;
};

const teardrop = (base: Point, angle: number, length: number, width: number): string => {
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  const at = (along: number, side: number): Point => [
    base[0] + dx * along - dy * side,
    base[1] + dy * along + dx * side,
  ];
  return `M ${pt(base)} C ${pt(at(length * 0.36, width * 1.25))} ${pt(at(length, width * 0.95))} ${pt(at(length, 0))} C ${pt(at(length, -width * 0.95))} ${pt(at(length * 0.36, -width * 1.25))} ${pt(base)} Z`;
};

const spiral = (center: Point, radius: number, start: number, turns: number, sign = 1): string => {
  const steps = Math.ceil(turns * 18);
  const points = Array.from({ length: steps + 1 }, (_, index) => {
    const t = index / steps;
    return polar(radius * (1 - 0.82 * t), start + sign * t * turns * Math.PI * 2, center);
  });
  return `M ${points.map(pt).join(' L ')}`;
};

const flower = (center: Point, radius: number, petals: number, rotation: number): string =>
  around(petals, rotation, (angle) =>
    lobe(angle, radius * 0.28, radius, (Math.PI / petals) * 0.82, center),
  ).join(' ');

const dot = (radius: number, angle: number, size: number) => circle(size, polar(radius, angle));

const step = (count: number) => Math.PI / count;

const ring = (strokes: string[], fills: string[], width: number): MandalaRing => ({
  strokes,
  fills,
  width,
});

const jewel = (r: number): MandalaRing[] => [
  ring([circle(0.37 * r), circle(0.385 * r)], [], 2.2),
  ring(
    [],
    around(56, 0, (a) => dot(0.41 * r, a, 0.0042 * r)),
    0,
  ),
  ring(
    around(16, 0, (a) => lobe(a, 0.43 * r, 0.53 * r, step(16) * 0.85)),
    [],
    1.8,
  ),
  ring([circle(0.555 * r), circle(0.57 * r)], [], 2.2),
  ring(
    around(14, 0, (a) =>
      [
        spiral(polar(0.635 * r, a), 0.045 * r, a + Math.PI, 1.4),
        spiral(polar(0.635 * r, a + step(14)), 0.034 * r, a, 1.2, -1),
      ].join(' '),
    ),
    [],
    1.6,
  ),
  ring(
    [circle(0.7 * r)],
    around(84, 0, (a) => dot(0.716 * r, a, 0.0036 * r)),
    2,
  ),
  ring(
    around(16, 0, (a) => flower(polar(0.775 * r, a), 0.045 * r, 8, a)),
    around(16, step(16), (a) => teardrop(polar(0.735 * r, a), a, 0.075 * r, 0.012 * r)),
    1.6,
  ),
  ring([circle(0.83 * r), circle(0.845 * r)], [], 2.2),
  ring(
    around(30, 0, (a) => pointed(a, 0.855 * r, 0.97 * r, step(30) * 0.96)),
    around(30, 0, (a) => pointed(a, 0.875 * r, 0.935 * r, step(30) * 0.45, true)),
    2,
  ),
  ring(
    around(30, step(30), (a) => circle(0.009 * r, polar(1.075 * r, a))),
    around(30, step(30), (a) => teardrop(polar(0.985 * r, a), a, 0.06 * r, 0.012 * r)),
    1.6,
  ),
];

const lotus = (r: number): MandalaRing[] => [
  ring([circle(0.37 * r), circle(0.385 * r)], [], 2.2),
  ring(
    around(16, 0, (a) =>
      [
        pointed(a, 0.395 * r, 0.505 * r, step(16) * 0.9),
        pointed(a, 0.415 * r, 0.475 * r, step(16) * 0.4),
      ].join(' '),
    ),
    [],
    1.5,
  ),
  ring(
    [circle(0.525 * r), circle(0.54 * r)],
    around(64, 0, (a) => dot(0.56 * r, a, 0.004 * r)),
    2,
  ),
  ring(
    around(8, 0, (a) =>
      [circle(0.05 * r, polar(0.635 * r, a)), circle(0.025 * r, polar(0.635 * r, a))].join(' '),
    ),
    around(8, step(8), (a) => teardrop(polar(0.6 * r, a), a, 0.08 * r, 0.014 * r)),
    1.6,
  ),
  ring([circle(0.705 * r), circle(0.72 * r)], [], 2.2),
  ring(
    around(10, 0, (a) => pointed(a, 0.725 * r, r, step(10) * 0.86)),
    [],
    2.2,
  ),
  ring(
    around(10, 0, (a) => pointed(a, 0.75 * r, 0.92 * r, step(10) * 0.62)),
    [],
    1.6,
  ),
  ring(
    around(10, 0, (a) =>
      [
        pointed(a, 0.78 * r, 0.86 * r, step(10) * 0.36),
        `M ${pt(polar(0.865 * r, a))} L ${pt(polar(0.95 * r, a))}`,
      ].join(' '),
    ),
    [],
    1.2,
  ),
  ring(
    around(10, step(10), (a) => flower(polar(0.84 * r, a), 0.05 * r, 9, a)),
    around(10, step(10), (a) => dot(0.84 * r, a, 0.012 * r)),
    1.5,
  ),
  ring(
    [],
    around(10, 0, (a) => dot(1.045 * r, a, 0.011 * r)),
    0,
  ),
];

const sunburst = (r: number): MandalaRing[] => [
  ring([circle(0.37 * r), circle(0.38 * r)], [], 2.2),
  ring(
    around(48, 0, (a) => `M ${pt(polar(0.4 * r, a))} L ${pt(polar(0.5 * r, a))}`),
    [],
    1.4,
  ),
  ring(
    [circle(0.52 * r)],
    around(48, step(48), (a) => dot(0.54 * r, a, 0.0045 * r)),
    2,
  ),
  ring(
    around(24, 0, (a) => lobe(a, 0.56 * r, 0.615 * r, step(24) * 0.98)),
    [],
    1.6,
  ),
  ring([circle(0.64 * r), circle(0.652 * r)], [], 2.2),
  ring(
    around(24, 0, (a) => pointed(a, 0.66 * r, 0.8 * r, step(24) * 0.8)),
    around(24, step(24), (a) => teardrop(polar(0.67 * r, a), a, 0.07 * r, 0.011 * r)),
    1.8,
  ),
  ring(
    [circle(0.82 * r)],
    around(96, 0, (a) => dot(0.835 * r, a, 0.0032 * r)),
    2,
  ),
  ring(
    around(36, 0, (a) => lobe(a, 0.85 * r, 0.93 * r, step(36) * 0.95)),
    [],
    1.8,
  ),
  ring(
    around(36, step(36), (a) => `M ${pt(polar(0.945 * r, a))} L ${pt(polar(1.02 * r, a))}`),
    around(36, step(36), (a) => dot(1.04 * r, a, 0.006 * r)),
    1.4,
  ),
];

export const CORE_RINGS = 4;

const core = (r: number): MandalaRing[] => [
  ring([flower([0, 0], 0.13 * r, 12, 0)], [circle(0.02 * r)], 1.6),
  ring([circle(0.17 * r)], [], 2),
  ring(
    around(12, step(12), (a) => lobe(a, 0.19 * r, 0.31 * r, step(12) * 0.9)),
    [],
    1.6,
  ),
  ring([circle(0.335 * r)], [], 2),
];

const BUILDERS: Record<MandalaPattern, (r: number) => MandalaRing[]> = { jewel, lotus, sunburst };

export const mandalaRings = (pattern: MandalaPattern, radius: number, withCore: boolean) => [
  ...(withCore ? core(radius) : []),
  ...BUILDERS[pattern](radius),
];

export const heartPath = ([cx, cy]: Point, size: number): string => {
  const at = (x: number, y: number) => pt([cx + x * size, cy + y * size]);
  return `M ${at(0, 0.9)} C ${at(-0.2, 0.62)} ${at(-1, 0.3)} ${at(-1, -0.25)} C ${at(-1, -0.8)} ${at(-0.4, -1)} ${at(0, -0.5)} C ${at(0.4, -1)} ${at(1, -0.8)} ${at(1, -0.25)} C ${at(1, 0.3)} ${at(0.2, 0.62)} ${at(0, 0.9)} Z`;
};
