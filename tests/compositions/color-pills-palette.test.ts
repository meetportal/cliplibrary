import { describe, expect, it } from 'bun:test';
import { contrast, toLab } from '@/compositions/kit/lab-color';
import { cursorColor, glowTints, pillTones } from '@/compositions/list-pickers/color-pills/palette';
import { colorPillsDefaults } from '@/schemas';

const PRIMARIES = ['#8e2dd2', '#1f2a44', '#e0262f', '#f6e27a'];

const withPrimary = (primary: string) => ({
  ...colorPillsDefaults,
  colors: { ...colorPillsDefaults.colors, primary },
});

const separation = (left: string, right: string) => {
  const a = toLab(left);
  const b = toLab(right);
  return Math.hypot(a.l - b.l, a.a - b.a, a.b - b.b);
};

describe('color pills palette', () => {
  for (const primary of PRIMARIES) {
    const props = withPrimary(primary);
    const tones = pillTones(props);

    it(`keeps every pill label readable with Primary ${primary}`, () => {
      for (const tone of tones) {
        expect(contrast(tone.ink, tone.fill)).toBeGreaterThanOrEqual(3);
      }
    });

    it(`keeps the first pill exactly Primary ${primary}`, () => {
      expect(tones[0]?.fill).toBe(primary);
    });

    it(`keeps the cursor apart from every pill with Primary ${primary}`, () => {
      const cursor = cursorColor(props, tones);
      for (const tone of tones) {
        expect(separation(cursor, tone.fill)).toBeGreaterThanOrEqual(0.15);
      }
    });

    it(`keeps the corner tints visible on the background with Primary ${primary}`, () => {
      const tints = glowTints(props, tones);
      for (const tint of [tints.first, tints.second]) {
        expect(separation(tint, props.colors.background)).toBeGreaterThanOrEqual(0.08);
      }
    });
  }
});
