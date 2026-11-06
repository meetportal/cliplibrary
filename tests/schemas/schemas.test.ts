import { describe, expect, it } from 'bun:test';
import { z } from 'zod';
import {
  CLIP_CATEGORY_IDS,
  CLIP_DEFAULTS,
  CLIP_IDS,
  CLIP_MODULES,
  CLIP_REGISTRY,
  CLIP_SCHEMAS,
  CLIP_TAGS,
  CLIP_THEMES,
  categoryLabel,
  EASING_IDS,
  getClipDefaults,
  getClipMeta,
  getClipSchema,
  HEX_COLOR,
  isClipId,
  readControlMeta,
  zColor,
  zImage,
  zMultiline,
  zSlider,
  zVideo,
} from '@/schemas';

const CATEGORIES: readonly string[] = CLIP_CATEGORY_IDS;

describe('clip registry completeness', () => {
  it('has a schema, defaults and registry entry for every clip id', () => {
    for (const id of CLIP_IDS) {
      expect(CLIP_SCHEMAS[id]).toBeDefined();
      expect(CLIP_DEFAULTS[id]).toBeDefined();
      expect(getClipMeta(id).id).toBe(id);
    }
  });

  it('keeps the registry and the id union in exact sync', () => {
    const registryIds = CLIP_REGISTRY.map((meta) => meta.id).sort();
    expect(registryIds).toEqual([...CLIP_IDS].sort());
    expect(CLIP_REGISTRY).toHaveLength(CLIP_IDS.length);
  });

  it('exposes coherent, positive timing and dimension metadata', () => {
    for (const meta of CLIP_REGISTRY) {
      expect(meta.title.length).toBeGreaterThan(0);
      expect(meta.description.length).toBeGreaterThan(0);
      expect(CATEGORIES).toContain(meta.category);
      expect(meta.source).toBe(`src/compositions/scenes/${meta.category}/${meta.id}.tsx`);
      expect(meta.fps).toBeGreaterThan(0);
      expect(meta.width).toBeGreaterThan(0);
      expect(meta.height).toBeGreaterThan(0);
      expect(meta.durationInFrames).toBeGreaterThan(0);
      expect(meta.posterFrame).toBeGreaterThanOrEqual(0);
      expect(meta.posterFrame).toBeLessThan(meta.durationInFrames);
    }
  });

  it('resolves schemas and defaults through the accessor helpers', () => {
    for (const id of CLIP_IDS) {
      expect(getClipSchema(id)).toBe(CLIP_SCHEMAS[id]);
      expect(getClipDefaults(id)).toBe(CLIP_DEFAULTS[id]);
    }
  });
});

describe('isClipId', () => {
  it('accepts known ids and rejects unknown strings', () => {
    for (const id of CLIP_IDS) {
      expect(isClipId(id)).toBe(true);
    }
    expect(isClipId('not-a-clip')).toBe(false);
    expect(isClipId('')).toBe(false);
  });
});

describe('clip defaults round-trip', () => {
  it('parses every clip default cleanly and returns an equal value', () => {
    for (const id of CLIP_IDS) {
      const schema: z.ZodType = CLIP_SCHEMAS[id];
      const result = schema.safeParse(CLIP_DEFAULTS[id]);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(CLIP_DEFAULTS[id]);
      }
    }
  });
});

describe('control metadata', () => {
  it('accepts six and eight digit hex colors and rejects others', () => {
    expect(HEX_COLOR.test('#abcdef')).toBe(true);
    expect(HEX_COLOR.test('#ABCDEF12')).toBe(true);
    expect(HEX_COLOR.test('#fff')).toBe(false);
    expect(HEX_COLOR.test('abcdef')).toBe(false);
    expect(zColor().safeParse('#112233').success).toBe(true);
    expect(zColor().safeParse('red').success).toBe(false);
  });

  it('reads color, textarea and slider hints back from a schema', () => {
    expect(readControlMeta(zColor())).toEqual({ control: 'color' });
    expect(readControlMeta(zMultiline())).toEqual({ control: 'textarea' });
    expect(readControlMeta(zSlider({ min: 0, max: 10, step: 2 }))).toEqual({
      control: 'slider',
      step: 2,
    });
  });

  it('defaults the slider step to one when omitted', () => {
    expect(readControlMeta(zSlider({ min: 0, max: 4 }))).toEqual({ control: 'slider', step: 1 });
  });

  it('returns undefined for a schema without control metadata', () => {
    expect(readControlMeta(z.string())).toBeUndefined();
    expect(readControlMeta(z.number())).toBeUndefined();
  });

  it('keeps slider bounds enforced on the underlying number', () => {
    const slider = zSlider({ min: 1, max: 3 });
    expect(slider.safeParse(2).success).toBe(true);
    expect(slider.safeParse(0).success).toBe(false);
    expect(slider.safeParse(4).success).toBe(false);
  });
});

describe('pluggable module architecture', () => {
  it('registers every module in a seeded category', () => {
    for (const module of CLIP_MODULES) {
      expect(CATEGORIES).toContain(module.meta.category);
      expect(module.id).toBe(module.meta.id);
      expect<unknown>(CLIP_SCHEMAS[module.id]).toBe(module.schema);
      expect<unknown>(CLIP_DEFAULTS[module.id]).toBe(module.defaults);
    }
  });
});

describe('easing enum control', () => {
  it('accepts every easing id and rejects unknown curves', () => {
    const easing = z.enum(EASING_IDS);
    for (const id of EASING_IDS) {
      expect(easing.safeParse(id).success).toBe(true);
    }
    expect(easing.safeParse('bounce').success).toBe(false);
  });
});

describe('image media control', () => {
  it('tags an image field with image control metadata', () => {
    expect(readControlMeta(zImage())).toEqual({ control: 'image' });
  });

  it('accepts empty, url and data-uri strings but rejects non-strings', () => {
    expect(zImage().safeParse('').success).toBe(true);
    expect(zImage().safeParse('https://example.com/a.png').success).toBe(true);
    expect(zImage().safeParse('data:image/png;base64,AAAA').success).toBe(true);
    expect(zImage().safeParse(42).success).toBe(false);
  });
});

describe('video media control', () => {
  it('tags a video field with video control metadata', () => {
    expect(readControlMeta(zVideo())).toEqual({ control: 'video' });
  });

  it('accepts empty, url and data-uri strings but rejects non-strings', () => {
    expect(zVideo().safeParse('').success).toBe(true);
    expect(zVideo().safeParse('https://example.com/a.mp4').success).toBe(true);
    expect(zVideo().safeParse('data:video/mp4;base64,AAAA').success).toBe(true);
    expect(zVideo().safeParse(42).success).toBe(false);
  });
});

describe('clip taxonomy', () => {
  it('tags every clip from the shared vocabulary without duplicates', () => {
    const vocabulary: readonly string[] = CLIP_TAGS;
    for (const meta of CLIP_REGISTRY) {
      expect(meta.tags.length).toBeGreaterThan(0);
      expect(new Set(meta.tags).size).toBe(meta.tags.length);
      for (const tag of meta.tags) {
        expect(vocabulary).toContain(tag);
      }
    }
  });

  it('gives every clip a known theme', () => {
    const themes: readonly string[] = CLIP_THEMES;
    for (const meta of CLIP_REGISTRY) {
      expect(themes).toContain(meta.theme);
    }
  });

  it('labels categories for display', () => {
    expect(categoryLabel('phone-layouts')).toBe('Multi-phone Layouts');
    expect(categoryLabel('hand-drawn')).toBe('Hand-drawn');
  });
});
