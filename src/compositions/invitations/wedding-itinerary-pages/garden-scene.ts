import type { ItineraryPalette } from '@/schemas';
import { type CutLayers, type CutShape, circle, rect, tone } from './cut-shapes';

const SHRUBS: readonly (readonly [number, number, number])[] = [
  [30, 470, 44],
  [92, 432, 42],
  [158, 452, 34],
  [1052, 448, 44],
  [990, 420, 40],
  [928, 446, 32],
];

const BLOOMS: readonly (readonly [number, number])[] = [
  [76, 414],
  [122, 438],
  [36, 448],
  [1006, 404],
  [962, 430],
  [1046, 424],
];

const chhatri = (palette: ItineraryPalette): CutShape[] => {
  const trim = tone(palette.structure, palette.textColor, 0.14);
  const shade = tone(palette.structure, palette.textColor, 0.07);
  return [
    { d: rect(428, 328, 224, 28, 3), fill: trim },
    ...[446, 498, 566, 618].map((x) => ({ d: rect(x, 224, 16, 106), fill: palette.structure })),
    { d: 'M406 226L674 226L654 206L426 206Z', fill: trim },
    {
      d: 'M452 207C452 152 500 128 540 102C580 128 628 152 628 207Z',
      fill: palette.structure,
    },
    { d: 'M540 102C580 128 628 152 628 207L540 207Z', fill: shade, flat: true },
    { d: rect(537, 78, 6, 26), fill: palette.accent },
    { d: circle(540, 78, 7), fill: palette.accent },
  ];
};

export const gardenScene = (palette: ItineraryPalette): CutLayers => {
  const far = tone(palette.greenery, palette.background, 0.62);
  const middle = tone(palette.greenery, palette.background, 0.32);
  const shrub = tone(palette.greenery, palette.textColor, 0.28);
  return [
    [
      {
        d: 'M-600 300L-40 300C240 222 420 262 600 250C800 238 960 208 1120 236L1680 236L1680 640L-600 640Z',
        fill: far,
      },
    ],
    [
      {
        d: 'M-600 420L-40 420C200 360 380 344 540 352C720 360 900 340 1120 392L1680 392L1680 640L-600 640Z',
        fill: middle,
      },
      ...chhatri(palette),
    ],
    [
      {
        d: 'M-600 476L-40 476C140 420 300 432 420 500C470 530 500 600 520 640L-600 640Z',
        fill: palette.greenery,
      },
      {
        d: 'M1680 452L1120 452C940 420 780 442 680 512C640 542 610 600 600 640L1680 640Z',
        fill: palette.greenery,
      },
      ...SHRUBS.map(([x, y, r]) => ({ d: circle(x, y, r), fill: shrub })),
      ...BLOOMS.map(([x, y]) => ({ d: circle(x, y, 6), fill: palette.accent, flat: true })),
    ],
  ];
};
