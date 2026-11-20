import { describe, expect, it } from 'bun:test';
import { wordsOf } from '@/compositions/brand/pendulum-brand-swing/copy-fit';
import { buildPalette } from '@/compositions/brand/pendulum-brand-swing/palette';
import { placeFooter } from '@/compositions/brand/pendulum-brand-swing/static-blocks';
import { FRAME, PIVOT } from '@/compositions/brand/pendulum-brand-swing/swing';
import { contrast } from '@/compositions/kit/lab-color';
import { pendulumBrandSwingDefaults } from '@/schemas';

const REACH = 0.6;
const LIMIT = FRAME.height - 48;

const rows = (text: string) =>
  text.split('\n').map((line) => ({ words: wordsOf(line, 0), weight: 600 }));

const SHORT = rows('Weddings | Events | Floral Design | Workshops\nSeasonal subscriptions');
const LONG = rows(
  'Brand strategy | Identity systems | Packaging\nWebsites | Motion design | Campaigns\nPhotography | Workshops | Retainers',
);

const footer = (position: number, length: number, bob: number, services = SHORT, size = 34) => {
  const floor = PIVOT.y + length + bob / 2 + 24;
  const placed = placeFooter(
    {
      services,
      website: 'willowandco.com',
      position,
      servicesSize: size,
      websiteSize: size,
      floor,
    },
    'Outfit',
  );
  const first = placed.services.lines[0]?.y ?? 0;
  const website = placed.website.lines[0]?.y ?? 0;
  return {
    floor,
    top: first - REACH * placed.services.size,
    bottom: website + REACH * placed.website.size,
    first,
  };
};

describe('pendulum footer position', () => {
  const cases = [
    { length: 980, bob: 110 },
    { length: 1020, bob: 150 },
    { length: 1100, bob: 190 },
  ];
  for (const services of [SHORT, LONG]) {
    for (const { length, bob } of cases) {
      it(`moves on every step for string ${length}, bob ${bob}, ${services.length} rows`, () => {
        const steps = Array.from({ length: 101 }, (_, at) =>
          footer(at / 100, length, bob, services),
        );
        const start = steps[0];
        const end = steps.at(-1);
        expect(start?.top).toBeCloseTo(start?.floor ?? 0, 6);
        expect(end?.bottom).toBeCloseTo(LIMIT, 6);
        for (let at = 1; at < steps.length; at++) {
          expect(steps[at]?.top ?? 0).toBeGreaterThan(steps[at - 1]?.top ?? 0);
          expect(steps[at]?.bottom ?? 0).toBeLessThanOrEqual(LIMIT + 1e-6);
        }
      });
    }
  }

  it('keeps the largest footer inside the frame under the longest string and biggest bob', () => {
    for (const position of [0, 0.5, 1]) {
      const placed = footer(position, 1100, 190, LONG, 56);
      expect(placed.top).toBeGreaterThanOrEqual(placed.floor - 1e-6);
      expect(placed.bottom).toBeLessThanOrEqual(LIMIT + 1e-6);
    }
  });

  it('keeps the default footer where it was', () => {
    const { length, bobSize } = pendulumBrandSwingDefaults.pendulum;
    const placed = footer(pendulumBrandSwingDefaults.layout.footer, length, bobSize);
    expect(Math.abs(placed.first - 1088)).toBeLessThan(1);
  });
});

describe('pendulum text color', () => {
  const colors = pendulumBrandSwingDefaults.colors;

  it('keeps white text on the dark default', () => {
    expect(buildPalette(colors).text).toBe('#ffffff');
  });

  for (const background of ['#f7f4ef', '#f6e27a', '#ffffff', '#cfd8e3']) {
    it(`turns white text into a crisp charcoal on ${background}`, () => {
      const { text } = buildPalette({ ...colors, background });
      expect(contrast(text, background)).toBeGreaterThanOrEqual(12);
    });
  }
});
