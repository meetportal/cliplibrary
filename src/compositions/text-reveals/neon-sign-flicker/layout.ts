import type { NeonSignFlickerProps } from '@/schemas';
import { LABEL_FACES, NEON_FACES } from './fonts';
import type { Box, TextRow } from './lockup';
import { fitLine, fitNeonLines, type Measurer, wrapLines } from './measure';
import type { PlacedGlyph } from './neon-word';
import type { LampGeometry } from './pendant-lamp';

export type SignLayout = {
  size: number;
  glyphs: PlacedGlyph[];
  target: number;
  sign: Box;
  lamp: LampGeometry;
  tagline: TextRow[];
  plate: Box;
  logoBox: Box;
  name: TextRow[];
  website: TextRow[];
};

const SIDE = 90;
const CAP_TOP = 0.2;
const CAP_HEIGHT = 0.7;
const LINE_STEP = 1.08;
const TAGLINE_GAP = 0.42;
const TAGLINE_LEADING = 1.38;

const visibleText = (text: string, uppercase: boolean) => (uppercase ? text.toUpperCase() : text);

const logoFit = (aspect: number | null, maxWidth: number, maxHeight: number) => {
  const ratio = aspect ?? 2;
  const width = Math.min(maxWidth, maxHeight * ratio);
  return { width, height: width / ratio };
};

export const buildLayout = (
  props: NeonSignFlickerProps,
  measure: Measurer,
  aspect: number | null,
  frame: { width: number; height: number },
): SignLayout => {
  const neonFace = NEON_FACES[props.neon.font];
  const labels = LABEL_FACES[props.type.font];
  const maxWidth = frame.width - SIDE * 2;
  const headline = visibleText(props.headline, props.neon.uppercase);
  const fitted = fitNeonLines(
    measure,
    headline,
    neonFace,
    props.neon.size,
    props.neon.tracking,
    maxWidth,
  );
  const size = fitted.size;
  const lineCount = Math.max(1, fitted.lines.length);
  const blockHeight = size * (CAP_HEIGHT + LINE_STEP * (lineCount - 1));
  const capTop = props.layout.signY - blockHeight / 2;
  let index = 0;
  const glyphs = fitted.lines.flatMap((line, row) => {
    const left = (frame.width - line.width) / 2;
    const top = capTop - size * CAP_TOP + row * size * LINE_STEP;
    return line.glyphs.flatMap((glyph) =>
      glyph.char === ' ' ? [] : [{ ...glyph, x: glyph.x + left, top, index: index++ }],
    );
  });
  const target = Math.max(0, Math.min(glyphs.length - 1, Math.round(props.flicker.letter) - 1));
  const signWidth = Math.max(0, ...fitted.lines.map((line) => line.width));
  const sign = {
    x: (frame.width - signWidth) / 2,
    y: capTop,
    width: signWidth,
    height: blockHeight,
  };
  const failing = glyphs[target];
  const shadeWidth = props.lamp.size;
  const shadeBottom = capTop - props.lamp.height;
  const lamp = {
    x: failing === undefined ? frame.width / 2 : failing.x + failing.width / 2,
    shadeTop: shadeBottom - shadeWidth * 0.56,
    shadeWidth,
    coneLength: props.lamp.height + size * 1.3,
    coneSpread: Math.max(shadeWidth * 0.9, (failing?.width ?? size * 0.6) * 1.1),
  };
  const wrapped = wrapLines(
    measure,
    visibleText(props.tagline, props.type.uppercase),
    labels.body,
    props.type.taglineSize,
    props.type.tracking,
    maxWidth,
    3,
  );
  const taglineTop = capTop + blockHeight + Math.max(64, size * TAGLINE_GAP);
  const tagline = wrapped.lines.map((text, row) => ({
    text,
    top: taglineTop + row * wrapped.size * TAGLINE_LEADING,
    size: wrapped.size,
  }));
  const logo = logoFit(aspect, props.lockup.logoWidth, props.lockup.logoHeight);
  const padding = props.lockup.plate ? props.lockup.padding : 0;
  const plate = {
    x: (frame.width - logo.width) / 2 - padding,
    y: props.layout.lockupY - logo.height / 2 - padding,
    width: logo.width + padding * 2,
    height: logo.height + padding * 2,
  };
  const logoBox = { x: plate.x + padding, y: plate.y + padding, ...logo };
  const nameSize = fitLine(
    measure,
    props.companyName,
    labels.name,
    props.type.nameSize,
    -0.01,
    maxWidth,
  );
  const nameTop = plate.y + plate.height + Math.max(36, props.type.nameSize * 0.7);
  const websiteText = visibleText(props.website, true);
  const websiteSize = fitLine(
    measure,
    websiteText,
    labels.body,
    props.type.websiteSize,
    0.18,
    maxWidth,
  );
  return {
    size,
    glyphs,
    target,
    sign,
    lamp,
    tagline,
    plate,
    logoBox,
    name: [{ text: props.companyName, top: nameTop, size: nameSize }],
    website: [
      {
        text: websiteText,
        top: nameTop + nameSize + props.type.websiteSize * 0.9,
        size: websiteSize,
      },
    ],
  };
};
