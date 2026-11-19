import type { FilmDustProps } from '@/schemas';
import { nameFont, taglineFont } from './fonts';

export type TitleSprite = {
  canvas: HTMLCanvasElement;
  left: number;
  top: number;
  width: number;
  height: number;
};

const RULE_GAP = 0.7;
const MIN_TAGLINE = 0.55;
const SUPERSAMPLE = 2;
const PAD = 0.25;
const MIN_FILL = 0.42;
const MAX_GROW = 2.2;
const DESCENDER = 0.34;

type Setting = { font: string; spacing: number };

const apply = (context: CanvasRenderingContext2D, setting: Setting) => {
  context.font = setting.font;
  context.letterSpacing = `${setting.spacing.toFixed(2)}px`;
};

const fitSize = (context: CanvasRenderingContext2D, text: string, size: number, room: number) => {
  const width = context.measureText(text).width;
  return width > room ? (size * room) / width : size;
};

const fillSize = (context: CanvasRenderingContext2D, text: string, size: number, room: number) => {
  const width = context.measureText(text).width;
  if (width <= 0) {
    return size;
  }
  const grown = width < room * MIN_FILL ? Math.min(MAX_GROW, (room * MIN_FILL) / width) : 1;
  return width > room ? (size * room) / width : size * grown;
};

const layoutTitle = (context: CanvasRenderingContext2D, props: FilmDustProps) => {
  const { title, companyName, tagline } = props;
  apply(context, { font: nameFont(title.nameSize), spacing: title.tracking * title.nameSize });
  const nameSize = fillSize(context, companyName, title.nameSize, title.maxWidth);
  const name = { font: nameFont(nameSize), spacing: title.tracking * nameSize };
  apply(context, name);
  const nameCap = context.measureText('H').actualBoundingBoxAscent;
  const nameWidth = context.measureText(companyName).width;
  const showTagline = tagline.trim() !== '';
  const lineGap = Math.max(
    title.gap * Math.min(1, nameSize / title.nameSize),
    DESCENDER * nameSize,
  );
  apply(context, { font: taglineFont(title.taglineSize), spacing: 0 });
  const ruleRoom = title.rules ? 2 * (title.ruleWidth + RULE_GAP * title.taglineSize) : 0;
  const taglineSize = Math.max(
    title.taglineSize * MIN_TAGLINE,
    fitSize(context, tagline, title.taglineSize, title.maxWidth - ruleRoom),
  );
  const line = { font: taglineFont(taglineSize), spacing: 0 };
  apply(context, line);
  const taglineX = context.measureText('x').actualBoundingBoxAscent;
  const taglineWidth = context.measureText(tagline).width;
  const ruleLength = (title.ruleWidth * taglineSize) / title.taglineSize;
  const ruleOffset = taglineWidth / 2 + RULE_GAP * taglineSize;
  const block = showTagline ? nameCap + lineGap + taglineX : nameCap;
  const nameBaseline = nameCap - block / 2;
  const taglineBaseline = nameBaseline + lineGap + taglineX;
  const lineWidth = title.rules ? 2 * (ruleOffset + ruleLength) : taglineWidth;
  const wide = Math.max(nameWidth, showTagline ? lineWidth : 0);
  const pad = PAD * nameSize;
  const top = nameBaseline - nameSize - pad;
  const bottom =
    (showTagline ? taglineBaseline + taglineSize * 0.45 : nameBaseline + nameSize * 0.35) + pad;
  return {
    name,
    line,
    nameSize,
    taglineSize,
    taglineX,
    nameBaseline,
    taglineBaseline,
    showTagline,
    ruleLength,
    ruleOffset,
    box: { left: -wide / 2 - pad, top, width: wide + 2 * pad, height: bottom - top },
  };
};

export const buildTitleSprite = (
  props: FilmDustProps,
  ink: string,
  accent: string,
  ratio: number,
): TitleSprite | null => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (context === null) {
    return null;
  }
  const layout = layoutTitle(context, props);
  const resolution = ratio * SUPERSAMPLE;
  const { box } = layout;
  canvas.width = Math.max(1, Math.ceil(box.width * resolution));
  canvas.height = Math.max(1, Math.ceil(box.height * resolution));
  context.setTransform(resolution, 0, 0, resolution, -box.left * resolution, -box.top * resolution);
  context.textAlign = 'center';
  context.textBaseline = 'alphabetic';
  apply(context, layout.name);
  context.fillStyle = ink;
  context.fillText(props.companyName, layout.name.spacing / 2, layout.nameBaseline);
  if (layout.showTagline) {
    apply(context, layout.line);
    context.fillStyle = accent;
    context.fillText(props.tagline, 0, layout.taglineBaseline);
    if (props.title.rules) {
      const thick = Math.max(2, layout.taglineSize * 0.05);
      const ruleY = layout.taglineBaseline - layout.taglineX / 2 - thick / 2;
      context.fillRect(-layout.ruleOffset - layout.ruleLength, ruleY, layout.ruleLength, thick);
      context.fillRect(layout.ruleOffset, ruleY, layout.ruleLength, thick);
    }
  }
  return { canvas, ...box };
};
