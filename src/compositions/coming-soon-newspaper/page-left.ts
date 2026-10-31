import { type Context, fittedSize, linesOf, rule, serif } from '../elevator-newspaper/page-type';
import { printedPhoto } from './photo-print';
import {
  bodyColumns,
  condensed,
  MARGIN,
  type Size,
  type SpreadCopy,
  spacedLine,
  stackedLines,
} from './spread-type';

const masthead = (context: Context, copy: SpreadCopy, [width]: Size) => {
  const inner = width - MARGIN * 2;
  context.fillStyle = copy.ink.text;
  condensed(context, 22, 500);
  spacedLine(context, copy.leftPage.dateline, [width / 2, 96], {
    size: 22,
    tracking: 0.24,
    width: inner,
  });
  rule(context, MARGIN, 128, inner, 1.5);
  serif(context, 132, 500);
  spacedLine(context, copy.leftPage.brand, [width / 2, 276], {
    size: 132,
    tracking: 0.16,
    width: inner,
  });
  rule(context, MARGIN, 318, inner, 4);
  rule(context, MARGIN, 330, inner, 1.5);
};

const headline = (context: Context, copy: SpreadCopy, [width]: Size) => {
  const lines = linesOf(copy.leftPage.headline);
  if (lines.length === 0) {
    return;
  }
  const inner = width - MARGIN * 2;
  const setFont = (fontSize: number) => serif(context, fontSize, 700);
  const size = fittedSize(
    context,
    lines,
    96 * copy.leftPage.headlineSize,
    { width: inner, height: 320, lineGap: 1.06 },
    setFont,
    1,
  );
  setFont(size);
  context.fillStyle = copy.ink.headline;
  stackedLines(context, copy.leftPage.headline, [width / 2, 384], {
    lineGap: size * 1.06,
    width: inner,
  });
};

const footer = (context: Context, copy: SpreadCopy, [width]: Size) => {
  const inner = width - MARGIN * 2;
  context.fillStyle = copy.ink.text;
  rule(context, MARGIN, 1376, inner, 1.5);
  condensed(context, 26, 600);
  spacedLine(context, copy.leftPage.kicker, [width / 2, 1428], {
    size: 26,
    tracking: 0.3,
    width: inner,
  });
  serif(context, 29, 500, 'italic');
  bodyColumns(
    context,
    copy.leftPage.body,
    { x: MARGIN, y: 1494, width: inner, height: 170 },
    { columns: 2, gutter: 44, lineHeight: 40 },
  );
};

export const drawLeftPage = (
  context: Context,
  copy: SpreadCopy,
  photo: CanvasImageSource | null,
  size: Size,
) => {
  const [width] = size;
  masthead(context, copy, size);
  headline(context, copy, size);
  printedPhoto(
    context,
    photo,
    { x: MARGIN, y: 760, width: width - MARGIN * 2, height: 580 },
    { ink: copy.ink.photo, paper: copy.ink.paper },
    {
      focus: copy.leftPage.photoFocus,
      zoom: copy.leftPage.photoZoom,
      contrast: copy.photos.contrast,
      brightness: copy.photos.brightness,
      grain: copy.photos.grain,
      seed: 11,
    },
  );
  footer(context, copy, size);
};
