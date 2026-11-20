import {
  balanceTwoLines,
  type FitBlock,
  type FitRules,
  fitBlock,
  type Paragraph,
  wordsOf,
} from './copy-fit';
import { WEIGHTS } from './fonts';
import { FRAME } from './swing';

const STATIC_WIDTH = 920;
const MIN_SCALE = 0.34;
const GLYPH_REACH = 0.6;
const FOOTER_LEADING = 1.42;
const BRAND_LEADING = 1.12;
const WEBSITE_LEADING = 1.2;
const WEBSITE_GAP = 0.95;
const EDGE_MARGIN = 48;
const TOP_MARGIN = 24;
const BRAND_GAP = 24;
const SCALES = [1, 0.94, 0.88, 0.82, 0.76, 0.7, 0.64, 0.58, 0.52];
const FOOTER_SCALES = [...SCALES, 0.46, 0.4];

const staticRules = (
  centerY: number,
  size: number,
  maxLines: number,
  leading: number,
): FitRules => ({
  maxSize: size,
  minSize: size * MIN_SCALE,
  maxLines,
  centerY,
  leading,
  widthAt: () => STATIC_WIDTH,
  bottomOk: () => true,
});

export const plain = (text: string, weight: number, accentCount = 0): Paragraph[] => [
  { words: wordsOf(text, accentCount), weight },
];

export const blockTop = (block: FitBlock, fallback: number) =>
  (block.lines[0]?.y ?? fallback) - GLYPH_REACH * block.size;

const glyphBottom = (block: FitBlock, fallback: number) =>
  (block.lines.at(-1)?.y ?? fallback) + GLYPH_REACH * block.size;

const shift = (block: FitBlock, by: number): FitBlock => ({
  ...block,
  lines: block.lines.map((line) => ({ ...line, y: line.y + by })),
});

export type FooterSpec = {
  services: Paragraph[];
  website: string;
  position: number;
  servicesSize: number;
  websiteSize: number;
  floor: number;
};

const footerAt = (spec: FooterSpec, family: string, scale: number) => {
  const fitted = fitBlock(
    spec.services,
    family,
    staticRules(spec.floor, spec.servicesSize * scale, 3, FOOTER_LEADING),
  );
  const services = shift(fitted, spec.floor - blockTop(fitted, spec.floor));
  const websiteSize = spec.websiteSize * scale;
  const lastLine = services.lines.at(-1)?.y ?? spec.floor;
  const website = fitBlock(
    plain(spec.website, WEIGHTS.regular),
    family,
    staticRules(
      lastLine + WEBSITE_GAP * (services.size + websiteSize),
      websiteSize,
      1,
      WEBSITE_LEADING,
    ),
  );
  return { services, website };
};

export const placeFooter = (spec: FooterSpec, family: string) => {
  const limit = FRAME.height - EDGE_MARGIN;
  let placed = footerAt(spec, family, 1);
  for (const scale of FOOTER_SCALES) {
    placed = footerAt(spec, family, scale);
    if (glyphBottom(placed.website, limit) <= limit) {
      break;
    }
  }
  const travel = Math.max(0, limit - glyphBottom(placed.website, limit));
  const by = travel * Math.min(1, Math.max(0, spec.position));
  return { services: shift(placed.services, by), website: shift(placed.website, by) };
};

const settleBrand = (brand: FitBlock, limit: number): FitBlock | null => {
  const down = TOP_MARGIN - blockTop(brand, TOP_MARGIN);
  const up = limit - glyphBottom(brand, limit);
  if (down > up) {
    return null;
  }
  return shift(brand, Math.max(down, Math.min(0, up)));
};

export const placeBrand = (
  paragraphs: Paragraph[],
  family: string,
  brandY: number,
  brandSize: number,
  copyTop: number,
): FitBlock => {
  const limit = copyTop - BRAND_GAP;
  let brand = fitBlock(paragraphs, family, staticRules(brandY, brandSize, 1, BRAND_LEADING));
  for (const maxLines of [1, 2]) {
    for (const scale of SCALES) {
      const fitted = fitBlock(
        paragraphs,
        family,
        staticRules(brandY, brandSize * scale, maxLines, BRAND_LEADING),
      );
      if (fitted.lines.length > maxLines) {
        continue;
      }
      brand = balanceTwoLines(fitted, family);
      const settled = settleBrand(brand, limit);
      if (settled !== null) {
        return settled;
      }
    }
  }
  return shift(brand, Math.max(0, TOP_MARGIN - blockTop(brand, TOP_MARGIN)));
};
