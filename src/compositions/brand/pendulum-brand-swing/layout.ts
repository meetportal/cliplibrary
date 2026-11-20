import type { PendulumBrandSwingProps } from '@/schemas';
import { type BobShape, verticalReach } from './bob';
import { type FitBlock, type FitRules, fitBlock, type Paragraph, wordsOf } from './copy-fit';
import { WEIGHTS } from './fonts';
import { blockTop, placeBrand, placeFooter, plain } from './static-blocks';
import { PIVOT, type Swing } from './swing';

export type Layout = {
  states: [FitBlock, FitBlock, FitBlock];
  brand: FitBlock;
  services: FitBlock;
  website: FitBlock;
};

const COPY_LEADING = 1.08;
const MAX_COPY_WIDTH = 900;
const CORD_CLEARANCE = 22;
const BOB_CLEARANCE = 40;
const MIN_SCALE = 0.34;
const FOOTER_CLEARANCE = 24;

const coneRules = (
  swing: Swing,
  shape: BobShape,
  cordWidth: number,
  centerY: number,
  size: number,
  maxLines: number,
): FitRules => {
  const slope = Math.tan(swing.amplitude);
  const margin = cordWidth / 2 + CORD_CLEARANCE;
  return {
    maxSize: size,
    minSize: size * MIN_SCALE,
    maxLines,
    centerY,
    leading: COPY_LEADING,
    widthAt: (glyphTop) =>
      Math.min(MAX_COPY_WIDTH, Math.max(0, 2 * ((glyphTop - PIVOT.y) * slope - margin))),
    bottomOk: (glyphBottom, halfWidth) => {
      if (halfWidth >= swing.length) {
        return false;
      }
      const angle = Math.asin(halfWidth / swing.length);
      const bobTop = PIVOT.y + swing.length * Math.cos(angle) - verticalReach(shape, angle);
      return glyphBottom <= bobTop - BOB_CLEARANCE;
    },
  };
};

const headlineParagraphs = (text: string, lightMiddle: boolean): Paragraph[] =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '')
    .map((line, at) => ({
      words: wordsOf(line, 0),
      weight: lightMiddle && at % 2 === 1 ? WEIGHTS.light : WEIGHTS.bold,
    }));

const footerParagraphs = (text: string): Paragraph[] =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '')
    .map((line) => ({ words: wordsOf(line, 0), weight: WEIGHTS.semibold }));

export const buildLayout = (
  props: PendulumBrandSwingProps,
  family: string,
  swing: Swing,
  shape: BobShape,
): Layout => {
  const { type, layout, pendulum } = props;
  const cone = (maxLines: number) =>
    coneRules(swing, shape, pendulum.string, layout.copyY, type.copySize, maxLines);
  const states: [FitBlock, FitBlock, FitBlock] = [
    fitBlock(plain(props.companyName, WEIGHTS.semibold), family, cone(2)),
    fitBlock(headlineParagraphs(props.headline, type.lightMiddle), family, cone(4)),
    fitBlock(plain(props.tagline, WEIGHTS.semibold, type.accentWords), family, cone(2)),
  ];
  const copyTop = Math.min(...states.map((block) => blockTop(block, layout.copyY)));
  const brand = placeBrand(
    plain(props.companyName, WEIGHTS.semibold),
    family,
    layout.brandY,
    type.brandSize,
    copyTop,
  );
  const { services, website } = placeFooter(
    {
      services: footerParagraphs(props.services),
      website: props.website,
      position: layout.footer,
      servicesSize: type.servicesSize,
      websiteSize: type.websiteSize,
      floor: PIVOT.y + swing.length + shape.height / 2 + FOOTER_CLEARANCE,
    },
    family,
  );
  return { states, brand, services, website };
};
