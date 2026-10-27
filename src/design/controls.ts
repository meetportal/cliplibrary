import { clampChroma, converter, formatHex, formatRgb, parse } from 'culori';
import { z } from 'zod';
import type { DesignElement } from './element';
import type { Fill } from './fill';

export const PAGE_TARGET = 'page';

export const COLOR_PROPS = ['fill', 'stroke', 'color', 'textBackground', 'shadow'] as const;

export const toneSchema = z.object({
  l: z.number(),
  c: z.number(),
  h: z.number(),
});

export const colorTargetSchema = z.object({
  element: z.string().min(1),
  prop: z.enum(COLOR_PROPS),
  stop: z.number().int().min(0).optional(),
  tone: toneSchema.optional(),
  alpha: z.number().min(0).max(1).optional(),
});

export const elementTargetSchema = z.object({ element: z.string().min(1) });

export const COLOR_ROLES = [
  'Background color',
  'Surface color',
  'Primary color',
  'Secondary color',
  'Accent color',
  'Text color',
] as const;

export const designControlSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('color'),
    id: z.string().min(1),
    label: z.enum(COLOR_ROLES),
    hint: z.string().optional(),
    value: z.string(),
    targets: z.array(colorTargetSchema),
  }),
  z.object({
    kind: z.literal('font'),
    id: z.string().min(1),
    label: z.string().min(1),
    hint: z.string().optional(),
    value: z.string(),
    targets: z.array(elementTargetSchema),
  }),
  z.object({
    kind: z.literal('text'),
    id: z.string().min(1),
    label: z.string().min(1),
    hint: z.string().optional(),
    value: z.string(),
    targets: z.array(elementTargetSchema),
  }),
  z.object({
    kind: z.literal('list'),
    id: z.string().min(1),
    label: z.string().min(1),
    hint: z.string().optional(),
    values: z.array(z.string()),
    targets: z.array(z.array(elementTargetSchema)),
  }),
]);

export type Tone = z.infer<typeof toneSchema>;
export type ColorTarget = z.infer<typeof colorTargetSchema>;
export type DesignControl = z.infer<typeof designControlSchema>;
export type ColorRole = (typeof COLOR_ROLES)[number];
export type ColorProp = (typeof COLOR_PROPS)[number];

const toOklch = converter('oklch');

const oklch = (color: string): Tone | null => {
  const parsed = parse(color);
  if (parsed === undefined) {
    return null;
  }
  const value = toOklch(parsed);
  return { l: value.l, c: value.c, h: value.h ?? 0 };
};

export const alphaOf = (color: string): number => parse(color)?.alpha ?? 1;

export const toneBetween = (base: string, shade: string): Tone | undefined => {
  const from = oklch(base);
  const to = oklch(shade);
  if (from === null || to === null) {
    return undefined;
  }
  const baseColor = parse(base);
  const shadeColor = parse(shade);
  if (
    baseColor !== undefined &&
    shadeColor !== undefined &&
    formatHex(baseColor) === formatHex(shadeColor)
  ) {
    return undefined;
  }
  return {
    l: to.l - from.l,
    c: from.c > 0.002 ? to.c / from.c : to.c,
    h: to.h - from.h,
  };
};

export const applyTone = (base: string, tone: Tone | undefined, alpha = 1): string => {
  const from = oklch(base);
  const parsed = parse(base);
  if (from === null || parsed === undefined) {
    return base;
  }
  const hex =
    tone === undefined
      ? formatHex(parsed)
      : formatHex(
          clampChroma(
            {
              mode: 'oklch',
              l: Math.min(1, Math.max(0, from.l + tone.l)),
              c: from.c > 0.002 ? from.c * tone.c : tone.c,
              h: from.h + tone.h,
            },
            'oklch',
          ),
        );
  if (alpha >= 1) {
    return hex;
  }
  const rgb = parse(hex);
  return rgb === undefined ? hex : formatRgb({ ...rgb, alpha });
};

interface Controlled {
  background: Fill;
  elements: readonly DesignElement[];
  controls: readonly DesignControl[];
}

const setFillColor = (fill: Fill, stop: number | undefined, color: string): Fill => {
  if (typeof fill === 'string' || stop === undefined) {
    return color;
  }
  return {
    ...fill,
    stops: fill.stops.map((item, index) => (index === stop ? { ...item, color } : item)),
  };
};

const paintElement = (
  element: DesignElement,
  target: ColorTarget,
  color: string,
): DesignElement => {
  switch (target.prop) {
    case 'fill':
      return 'fill' in element
        ? { ...element, fill: setFillColor(element.fill, target.stop, color) }
        : element;
    case 'stroke':
      return 'stroke' in element ? { ...element, stroke: color } : element;
    case 'color':
      return element.type === 'icon' ? { ...element, color } : element;
    case 'textBackground':
      return element.type === 'text' && element.background !== undefined
        ? { ...element, background: { ...element.background, fill: color } }
        : element;
    default:
      return element.shadow === undefined
        ? element
        : { ...element, shadow: { ...element.shadow, color } };
  }
};

const byTarget = <T extends { element: string }>(targets: readonly T[]): Map<string, T[]> => {
  const map = new Map<string, T[]>();
  for (const target of targets) {
    map.set(target.element, [...(map.get(target.element) ?? []), target]);
  }
  return map;
};

const setTexts = <T extends Controlled>(
  design: T,
  ids: ReadonlySet<string>,
  patch: { text: string } | { fontFamily: string },
): T => ({
  ...design,
  elements: design.elements.map((element) =>
    ids.has(element.id) && element.type === 'text' ? { ...element, ...patch } : element,
  ),
});

export const setListItem = <T extends Controlled>(
  design: T,
  id: string,
  index: number,
  value: string,
): T => {
  const control = design.controls.find((item) => item.id === id);
  if (control?.kind !== 'list' || index < 0 || index >= control.values.length) {
    return design;
  }
  const controls = design.controls.map((item) =>
    item.id === id && item.kind === 'list'
      ? { ...item, values: item.values.map((entry, at) => (at === index ? value : entry)) }
      : item,
  );
  const ids = new Set((control.targets[index] ?? []).map((target) => target.element));
  return { ...setTexts(design, ids, { text: value }), controls };
};

export const setControlValue = <T extends Controlled>(design: T, id: string, value: string): T => {
  const control = design.controls.find((item) => item.id === id);
  if (control === undefined || control.kind === 'list') {
    return design;
  }
  const controls = design.controls.map((item) =>
    item.id === id && item.kind !== 'list' ? { ...item, value } : item,
  );
  if (control.kind === 'color') {
    if (parse(value) === undefined) {
      return design;
    }
    const targets = byTarget(control.targets);
    const colorFor = (target: ColorTarget) => applyTone(value, target.tone, target.alpha);
    const page = targets.get(PAGE_TARGET) ?? [];
    return {
      ...design,
      controls,
      background: page.reduce<Fill>(
        (fill, target) => setFillColor(fill, target.stop, colorFor(target)),
        design.background,
      ),
      elements: design.elements.map((element) =>
        (targets.get(element.id) ?? []).reduce(
          (current, target) => paintElement(current, target, colorFor(target)),
          element,
        ),
      ),
    };
  }
  const ids = new Set(control.targets.map((target) => target.element));
  const patch = control.kind === 'font' ? { fontFamily: value } : { text: value };
  return { ...setTexts(design, ids, patch), controls };
};
