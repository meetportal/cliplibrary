import { clampChroma, converter, formatHex, formatRgb, parse } from 'culori';
import { z } from 'zod';
import type { DesignElement, Shadow } from './element';
import type { Fill } from './fill';

export const paletteSwatchSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  color: z.string(),
  shades: z.array(z.string()),
});

export type PaletteSwatch = z.infer<typeof paletteSwatchSchema>;

interface Colored {
  width: number;
  height: number;
  background: Fill;
  elements: readonly DesignElement[];
  palette: readonly PaletteSwatch[];
}

const toOklch = converter('oklch');

interface Tone {
  hex: string;
  l: number;
  c: number;
  h: number;
}

const tone = (color: string): Tone | null => {
  const parsed = parse(color);
  if (parsed === undefined) {
    return null;
  }
  const oklch = toOklch(parsed);
  return { hex: formatHex(parsed), l: oklch.l, c: oklch.c, h: oklch.h ?? 0 };
};

const alphaOf = (color: string): number => parse(color)?.alpha ?? 1;

const CHROMATIC = 0.035;
const HUE_SPAN = 30;
const NEUTRAL_SPAN = 0.1;
const MAX_SWATCHES = 6;
const ROLE_LABELS = ['Primary', 'Secondary', 'Accent', 'Highlight', 'Detail', 'Extra'] as const;

const hueGap = (a: number, b: number): number => {
  const gap = Math.abs(a - b) % 360;
  return gap > 180 ? 360 - gap : gap;
};

const related = (a: Tone, b: Tone): boolean => {
  const aChromatic = a.c >= CHROMATIC;
  const bChromatic = b.c >= CHROMATIC;
  if (aChromatic !== bChromatic) {
    return false;
  }
  return aChromatic ? hueGap(a.h, b.h) <= HUE_SPAN : Math.abs(a.l - b.l) <= NEUTRAL_SPAN;
};

const fillColors = (fill: Fill): string[] =>
  typeof fill === 'string' ? [fill] : fill.stops.map((stop) => stop.color);

interface Usage {
  color: string;
  weight: number;
  text: boolean;
}

const textLines = (text: string): number => text.split('\n').length;

const elementUsage = (element: DesignElement): Usage[] => {
  if (element.hidden) {
    return [];
  }
  const scale = element.opacity;
  switch (element.type) {
    case 'text': {
      const area = element.width * element.fontSize * element.lineHeight * textLines(element.text);
      return [
        ...fillColors(element.fill).map((color) => ({ color, weight: area * scale, text: true })),
        ...(element.background === undefined
          ? []
          : [{ color: element.background.fill, weight: area * scale, text: false }]),
        ...(element.strokeWidth > 0
          ? [{ color: element.stroke, weight: area * 0.1 * scale, text: true }]
          : []),
      ];
    }
    case 'icon':
      return [
        { color: element.color, weight: element.width * element.height * 0.2 * scale, text: false },
      ];
    case 'line':
      return [
        { color: element.stroke, weight: element.width * element.strokeWidth * scale, text: false },
      ];
    case 'image':
      return element.strokeWidth > 0
        ? [
            {
              color: element.stroke,
              weight: element.width * element.strokeWidth * 4 * scale,
              text: false,
            },
          ]
        : [];
    default: {
      const area = element.width * element.height * scale;
      return [
        ...fillColors(element.fill).map((color) => ({ color, weight: area, text: false })),
        ...(element.strokeWidth > 0
          ? [
              {
                color: element.stroke,
                weight: (element.width + element.height) * 2 * element.strokeWidth * scale,
                text: false,
              },
            ]
          : []),
      ];
    }
  }
};

interface Cluster {
  tones: Tone[];
  weight: Map<string, number>;
  textWeight: number;
  total: number;
  background: boolean;
}

const heaviest = (cluster: Cluster): Tone => {
  const sorted = [...cluster.tones].sort(
    (a, b) => (cluster.weight.get(b.hex) ?? 0) - (cluster.weight.get(a.hex) ?? 0),
  );
  const first = sorted[0];
  if (first === undefined) {
    throw new Error('A palette cluster needs a colour');
  }
  return first;
};

export const derivePalette = (design: Omit<Colored, 'palette'>): PaletteSwatch[] => {
  const usages: (Usage & { background: boolean })[] = [
    ...fillColors(design.background).map((color) => ({
      color,
      weight: design.width * design.height,
      text: false,
      background: true,
    })),
    ...design.elements.flatMap(elementUsage).map((usage) => ({ ...usage, background: false })),
  ];
  const clusters: Cluster[] = [];
  for (const usage of usages) {
    const found = tone(usage.color);
    const weight = usage.weight * alphaOf(usage.color);
    if (found === null || weight <= 0) {
      continue;
    }
    const cluster =
      clusters.find((item) => item.tones.some((member) => member.hex === found.hex)) ??
      clusters.find((item) => related(heaviest(item), found));
    const target = cluster ?? {
      tones: [],
      weight: new Map<string, number>(),
      textWeight: 0,
      total: 0,
      background: false,
    };
    if (cluster === undefined) {
      clusters.push(target);
    }
    if (!target.tones.some((member) => member.hex === found.hex)) {
      target.tones.push(found);
    }
    target.weight.set(found.hex, (target.weight.get(found.hex) ?? 0) + weight);
    target.total += weight;
    target.textWeight += usage.text ? weight : 0;
    target.background ||= usage.background;
  }
  const ranked = [...clusters].sort((a, b) => b.total - a.total).slice(0, MAX_SWATCHES);
  const background = ranked.find((cluster) => cluster.background) ?? ranked[0];
  const text = [...ranked]
    .filter((cluster) => cluster !== background && cluster.textWeight >= cluster.total / 2)
    .sort((a, b) => b.textWeight - a.textWeight)[0];
  const others = ranked.filter((cluster) => cluster !== background && cluster !== text);
  const named: [Cluster, string, string][] = [
    ...(background === undefined
      ? []
      : [[background, 'background', 'Background'] as [Cluster, string, string]]),
    ...(text === undefined ? [] : [[text, 'text', 'Text'] as [Cluster, string, string]]),
    ...others.map((cluster, index): [Cluster, string, string] => {
      const label = ROLE_LABELS[index] ?? `Colour ${index + 1}`;
      return [cluster, label.toLowerCase(), label];
    }),
  ];
  return named.map(([cluster, id, label]) => {
    const base = heaviest(cluster);
    return {
      id,
      label,
      color: base.hex,
      shades: cluster.tones.filter((member) => member.hex !== base.hex).map((member) => member.hex),
    };
  });
};

const shift = (from: Tone, to: Tone, shade: Tone): string => {
  const chromaRatio = from.c > 0.001 ? shade.c / from.c : 1;
  const next = clampChroma(
    {
      mode: 'oklch',
      l: Math.min(1, Math.max(0, to.l + (shade.l - from.l))),
      c: to.c < CHROMATIC ? shade.c * (to.c / Math.max(from.c, 0.001)) : to.c * chromaRatio,
      h: to.h + (shade.h - from.h),
    },
    'oklch',
  );
  return formatHex(next);
};

const withAlpha = (hex: string, alpha: number): string => {
  if (alpha >= 1) {
    return hex;
  }
  const parsed = parse(hex);
  return parsed === undefined ? hex : formatRgb({ ...parsed, alpha });
};

type Remap = (color: string) => string;

const remapFill = (fill: Fill, remap: Remap): Fill =>
  typeof fill === 'string'
    ? remap(fill)
    : { ...fill, stops: fill.stops.map((stop) => ({ ...stop, color: remap(stop.color) })) };

const remapShadow = (shadow: Shadow | undefined, remap: Remap): Shadow | undefined => {
  if (shadow === undefined) {
    return undefined;
  }
  const found = tone(shadow.color);
  return found !== null && found.c >= CHROMATIC
    ? { ...shadow, color: remap(shadow.color) }
    : shadow;
};

const remapElement = (element: DesignElement, remap: Remap): DesignElement => {
  const shadow = remapShadow(element.shadow, remap);
  const shared = shadow === undefined ? {} : { shadow };
  switch (element.type) {
    case 'text':
      return {
        ...element,
        ...shared,
        fill: remapFill(element.fill, remap),
        stroke: remap(element.stroke),
        ...(element.background === undefined
          ? {}
          : { background: { ...element.background, fill: remap(element.background.fill) } }),
      };
    case 'icon':
      return { ...element, ...shared, color: remap(element.color) };
    case 'line':
    case 'image':
      return { ...element, ...shared, stroke: remap(element.stroke) };
    default:
      return {
        ...element,
        ...shared,
        fill: remapFill(element.fill, remap),
        stroke: remap(element.stroke),
      };
  }
};

export const setSwatchColor = <T extends Colored>(design: T, id: string, color: string): T => {
  const swatch = design.palette.find((item) => item.id === id);
  const from = swatch === undefined ? null : tone(swatch.color);
  const to = tone(color);
  if (swatch === undefined || from === null || to === null) {
    return design;
  }
  const mapping = new Map<string, string>([[from.hex, to.hex]]);
  for (const shade of swatch.shades) {
    const shadeTone = tone(shade);
    if (shadeTone !== null) {
      mapping.set(shadeTone.hex, shift(from, to, shadeTone));
    }
  }
  const remap: Remap = (value) => {
    const parsed = parse(value);
    const next = parsed === undefined ? undefined : mapping.get(formatHex(parsed));
    return next === undefined ? value : withAlpha(next, parsed?.alpha ?? 1);
  };
  return {
    ...design,
    background: remapFill(design.background, remap),
    elements: design.elements.map((element) => remapElement(element, remap)),
    palette: design.palette.map((item) =>
      item.id === id
        ? { ...item, color: to.hex, shades: item.shades.map((shade) => remap(shade)) }
        : item,
    ),
  };
};
