import type { ItineraryPalette } from '@/schemas';
import {
  type CutLayers,
  type CutShape,
  circle,
  ellipse,
  hedge,
  polyline,
  rect,
  swagPoints,
  tone,
  widenSwag,
} from './cut-shapes';

const BULBS = 41;

const STARS: readonly (readonly [number, number, number])[] = [
  [60, 40, 2.6],
  [170, 120, 2],
  [250, 30, 3],
  [340, 170, 2],
  [420, 80, 2.4],
  [520, 20, 2],
  [600, 150, 2.8],
  [690, 60, 2],
  [780, 190, 2.2],
  [860, 30, 2.8],
  [950, 130, 2],
  [1030, 60, 2.4],
  [120, 230, 2],
  [480, 240, 2.2],
  [900, 250, 2],
];

const twinkle = (frame: number, index: number, rate: number, depth: number): number =>
  1 - depth + depth * (0.5 + 0.5 * Math.sin(frame / rate + index * 2.3));

const stars = (palette: ItineraryPalette, frame: number, sway: number): CutShape[] =>
  STARS.map(([x, y, r], index) => ({
    d: circle(x, y, r),
    fill: index % 3 === 0 ? palette.accent : palette.textColor,
    opacity: twinkle(frame, index, 13, Math.min(0.8, 0.45 * sway)),
    flat: true,
  }));

const string = (
  palette: ItineraryPalette,
  frame: number,
  sway: number,
  from: readonly [number, number],
  to: readonly [number, number],
  sag: number,
  seed: number,
): CutShape[] => {
  const wide = widenSwag(from, to, sag);
  const wire = swagPoints(wide.start, wide.end, wide.sag, 80);
  const bulbs = swagPoints(wide.start, wide.end, wide.sag, BULBS).slice(1, -1);
  return [
    {
      d: polyline(wire),
      fill: tone(palette.textColor, palette.background, 0.55),
      stroke: 2,
      flat: true,
    },
    ...bulbs.flatMap(([x, y], index) => {
      const glow = twinkle(frame, index + seed, 11, Math.min(0.6, 0.3 * sway));
      return [
        { d: circle(x, y + 10, 17), fill: palette.accent, opacity: 0.2 * glow, flat: true },
        { d: rect(x - 1, y, 2, 5), fill: tone(palette.textColor, palette.background, 0.55) },
        { d: circle(x, y + 10, 6), fill: palette.accent, opacity: 0.55 + 0.45 * glow },
      ];
    }),
  ];
};

const diya = (x: number, palette: ItineraryPalette, frame: number, sway: number): CutShape[] => {
  const flicker = twinkle(frame, x, 7, Math.min(0.5, 0.25 * sway));
  const tip = 472 - 4 * flicker;
  return [
    { d: `M${x - 30} 510Q${x} 546 ${x + 30} 510Z`, fill: palette.structure },
    { d: `M${x} ${tip}Q${x + 9} 494 ${x} 506Q${x - 9} 494 ${x} ${tip}Z`, fill: palette.accent },
  ];
};

const DHOL = { x: 540, y: 410, half: 132, radius: 50 } as const;

const dhol = (palette: ItineraryPalette): CutShape[] => {
  const { x, y, half, radius } = DHOL;
  const skin = tone(palette.textColor, palette.structure, 0.22);
  const rope = tone(palette.textColor, palette.structure, 0.35);
  const left = x - half;
  const right = x + half;
  const top = y - radius;
  const bottom = y + radius;
  const bulge = radius * 0.8;
  const zigzag = Array.from({ length: 13 }, (_, index) => [
    left + 42 + index * ((2 * half - 84) / 12),
    index % 2 === 0 ? top + 8 : bottom - 8,
  ]) as [number, number][];
  return [
    {
      d: [
        `M${left} ${y}`,
        `C${left} ${y - bulge} ${left + 20} ${top} ${left + 40} ${top}`,
        `L${right - 40} ${top}`,
        `C${right - 20} ${top} ${right} ${y - bulge} ${right} ${y}`,
        `C${right} ${y + bulge} ${right - 20} ${bottom} ${right - 40} ${bottom}`,
        `L${left + 40} ${bottom}`,
        `C${left + 20} ${bottom} ${left} ${y + bulge} ${left} ${y}Z`,
      ].join(''),
      fill: palette.structure,
    },
    { d: polyline(zigzag), fill: rope, stroke: 2.5, flat: true },
    { d: rect(left + 32, top, 9, radius * 2), fill: palette.accent, flat: true },
    { d: rect(right - 41, top, 9, radius * 2), fill: palette.accent, flat: true },
    { d: ellipse(left, y, 18, radius * 0.92), fill: skin },
    { d: ellipse(right, y, 18, radius * 0.92), fill: skin },
  ];
};

export const lightsScene = (palette: ItineraryPalette, frame: number, sway: number): CutLayers => [
  [
    ...stars(palette, frame, sway),
    { d: hedge(330, 9, 70, 0.4), fill: tone(palette.greenery, palette.background, 0.45) },
  ],
  [
    { d: hedge(420, 6, 90, 2.1), fill: tone(palette.greenery, palette.background, 0.15) },
    ...string(palette, frame, sway, [-40, 60], [1120, 90], 130, 0),
    ...string(palette, frame, sway, [-40, 170], [1120, 140], 100, 7),
  ],
  [
    {
      d: 'M-600 446L-40 446C300 428 780 428 1120 446L1680 446L1680 640L-600 640Z',
      fill: palette.greenery,
    },
    ...dhol(palette),
    ...diya(250, palette, frame, sway),
    ...diya(830, palette, frame, sway),
  ],
];
