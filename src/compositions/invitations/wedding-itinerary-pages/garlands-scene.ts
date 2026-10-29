import type { ItineraryPalette } from '@/schemas';
import {
  type CutLayers,
  type CutShape,
  circle,
  ellipse,
  leaf,
  polygon,
  rect,
  swagPoints,
  swing,
  tone,
} from './cut-shapes';

const STRAND_LENGTHS = [9, 12, 10, 13, 11, 14, 12, 14, 11, 13, 10, 12, 9];

const BEAD_GAP = 19;

const strands = (palette: ItineraryPalette, frame: number, sway: number): CutShape[] => {
  const deep = tone(palette.accent, palette.structure, 0.38);
  return STRAND_LENGTHS.flatMap((count, index) => {
    const pivot = [296 + index * 41, 84] as const;
    const angle = Math.sin(frame / 38 + index * 0.7) * 0.035 * sway;
    const fill = index % 2 === 0 ? palette.accent : deep;
    const beads = Array.from({ length: count }, (_, bead) => {
      const [x, y] = swing(pivot, angle, [pivot[0], pivot[1] + 14 + bead * BEAD_GAP]);
      return { d: circle(x, y, 10.5), fill };
    });
    const [tipX, tipY] = swing(pivot, angle, [pivot[0], pivot[1] + 14 + count * BEAD_GAP]);
    return [
      ...beads,
      { d: leaf(tipX, tipY - 6, Math.PI / 2 + angle - 0.5, 20, 6), fill: palette.greenery },
      { d: leaf(tipX, tipY - 6, Math.PI / 2 + angle + 0.5, 20, 6), fill: palette.greenery },
    ];
  });
};

const swag = (palette: ItineraryPalette, frame: number, sway: number): CutShape[] => {
  const light = tone(palette.accent, palette.background, 0.3);
  const lift = Math.sin(frame / 46) * 4 * sway;
  return swagPoints([244, 86], [836, 86], 58 + lift, 30).map(([x, y], index) => ({
    d: circle(x, y, 13),
    fill: index % 2 === 0 ? light : palette.accent,
  }));
};

const pot = (x: number, palette: ItineraryPalette): CutShape[] => {
  const dark = tone(palette.greenery, palette.textColor, 0.3);
  return [
    ...[-1.2, -0.75, -0.3, 0.15, 0.6].map((spread, index) => ({
      d: leaf(x, 506, -Math.PI / 2 + spread * (x < 540 ? 1 : -1), 92 - index * 6, 18),
      fill: index % 2 === 0 ? palette.greenery : dark,
    })),
    {
      d: polygon([
        [x - 46, 500],
        [x + 46, 500],
        [x + 34, 582],
        [x - 34, 582],
      ]),
      fill: tone(palette.structure, palette.textColor, 0.25),
    },
  ];
};

export const garlandsScene = (
  palette: ItineraryPalette,
  frame: number,
  sway: number,
): CutLayers => {
  const wood = tone(palette.structure, palette.textColor, 0.45);
  const cushion = tone(palette.accent, palette.structure, 0.5);
  const side = tone(palette.structure, palette.background, 0.35);
  return [
    [
      {
        d: 'M-600 470L-40 470C300 448 780 448 1120 470L1680 470L1680 640L-600 640Z',
        fill: tone(palette.accent, palette.background, 0.72),
      },
    ],
    [
      { d: rect(236, 70, 18, 404), fill: wood },
      { d: rect(826, 70, 18, 404), fill: wood },
      { d: rect(220, 60, 640, 18, 4), fill: wood },
      ...strands(palette, frame, sway),
      ...swag(palette, frame, sway),
    ],
    [
      {
        d: 'M190 640L276 528L804 528L890 640Z',
        fill: tone(palette.structure, palette.background, 0.6),
      },
      {
        d: 'M236 640L300 548L780 548L844 640Z',
        fill: tone(palette.structure, palette.background, 0.42),
      },
      { d: rect(362, 384, 100, 66, 24), fill: side },
      { d: rect(490, 378, 100, 72, 24), fill: cushion },
      { d: rect(618, 384, 100, 66, 24), fill: side },
      { d: rect(300, 440, 480, 72, 14), fill: palette.structure },
      {
        d: rect(300, 440, 480, 14, 7),
        fill: tone(palette.structure, palette.background, 0.3),
        flat: true,
      },
      { d: rect(290, 404, 76, 46, 23), fill: palette.greenery },
      { d: rect(714, 404, 76, 46, 23), fill: palette.greenery },
      { d: ellipse(296, 427, 9, 21), fill: palette.accent, flat: true },
      { d: ellipse(784, 427, 9, 21), fill: palette.accent, flat: true },
      ...pot(110, palette),
      ...pot(970, palette),
      { d: ellipse(540, 590, 74, 18), fill: tone(palette.structure, palette.textColor, 0.3) },
      ...[-44, -22, 0, 22, 44].map((dx, index) => ({
        d: circle(540 + dx, 580 - (index % 2) * 6, 11),
        fill: index % 2 === 0 ? palette.accent : tone(palette.accent, palette.background, 0.3),
      })),
    ],
  ];
};
