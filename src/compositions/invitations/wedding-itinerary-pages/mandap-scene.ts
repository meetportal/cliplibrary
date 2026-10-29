import type { ItineraryPalette } from '@/schemas';
import {
  type CutLayers,
  type CutShape,
  circle,
  hedge,
  leaf,
  polygon,
  rect,
  swagPoints,
  tone,
} from './cut-shapes';

const ARCH_CENTER = [540, 470] as const;

const ARCH_RADIUS = 318;

const arch = (palette: ItineraryPalette): CutShape[] => {
  const light = tone(palette.accent, palette.background, 0.4);
  const steps = 22;
  return Array.from({ length: steps + 1 }, (_, index) => {
    const angle = Math.PI + (index / steps) * Math.PI;
    const x = ARCH_CENTER[0] + Math.cos(angle) * ARCH_RADIUS;
    const y = ARCH_CENTER[1] + Math.sin(angle) * ARCH_RADIUS;
    const outward = angle;
    return [
      { d: leaf(x, y, outward - 0.9, 30, 8), fill: palette.greenery },
      { d: leaf(x, y, outward + 0.9, 30, 8), fill: palette.greenery },
      {
        d: circle(x, y, index % 2 === 0 ? 17 : 13),
        fill: index % 2 === 0 ? palette.accent : light,
      },
    ];
  }).flat();
};

const swag = (palette: ItineraryPalette, frame: number, sway: number): CutShape[] => {
  const light = tone(palette.accent, palette.background, 0.4);
  const lift = Math.sin(frame / 44) * 3 * sway;
  return swagPoints([322, 218], [758, 218], 52 + lift, 22).map(([x, y], index) => ({
    d: circle(x, y, 9),
    fill: index % 2 === 0 ? palette.accent : light,
  }));
};

const urn = (x: number, palette: ItineraryPalette): CutShape[] => {
  const light = tone(palette.accent, palette.background, 0.4);
  return [
    ...[-0.9, -0.3, 0.3, 0.9].map((spread) => ({
      d: leaf(x, 500, -Math.PI / 2 + spread, 70, 14),
      fill: palette.greenery,
    })),
    ...(
      [
        [-26, 470, 18],
        [0, 452, 20],
        [26, 470, 18],
        [-12, 490, 14],
        [14, 490, 14],
      ] as const
    ).map(([dx, y, r], index) => ({
      d: circle(x + dx, y, r),
      fill: index % 2 === 0 ? palette.accent : light,
    })),
    {
      d: polygon([
        [x - 40, 500],
        [x + 40, 500],
        [x + 26, 576],
        [x - 26, 576],
      ]),
      fill: palette.structure,
    },
  ];
};

export const mandapScene = (palette: ItineraryPalette, frame: number, sway: number): CutLayers => {
  const pale = tone(palette.structure, palette.background, 0.4);
  const deep = tone(palette.structure, palette.textColor, 0.25);
  return [
    [
      { d: hedge(360, 10, 46, 1.2), fill: tone(palette.greenery, palette.background, 0.5) },
      ...arch(palette),
    ],
    [
      { d: rect(360, 232, 16, 240), fill: pale },
      { d: rect(704, 232, 16, 240), fill: pale },
      { d: rect(250, 470, 580, 34, 4), fill: deep },
      { d: rect(300, 504, 480, 18, 3), fill: tone(palette.structure, palette.textColor, 0.12) },
      { d: rect(296, 210, 24, 262), fill: palette.structure },
      { d: rect(760, 210, 24, 262), fill: palette.structure },
      { d: rect(288, 198, 40, 14, 3), fill: deep },
      { d: rect(752, 198, 40, 14, 3), fill: deep },
      { d: 'M266 200L814 200L792 174L288 174Z', fill: palette.structure },
      { d: 'M382 175C404 122 480 104 540 88C600 104 676 122 698 175Z', fill: pale },
      { d: circle(540, 82, 9), fill: palette.accent },
      ...swag(palette, frame, sway),
    ],
    [
      {
        d: 'M-600 540L-40 540C300 520 780 520 1120 540L1680 540L1680 640L-600 640Z',
        fill: tone(palette.greenery, palette.background, 0.25),
      },
      {
        d: 'M424 640L492 524L588 524L656 640Z',
        fill: tone(palette.accent, palette.titleColor, 0.55),
      },
      ...urn(170, palette),
      ...urn(910, palette),
    ],
  ];
};
