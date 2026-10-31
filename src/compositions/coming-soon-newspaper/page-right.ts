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

const HEADLINE_TOP = 352;
const HEADLINE_ROOM = 720;

const nameplate = (context: Context, copy: SpreadCopy, [width]: Size) => {
  const inner = width - MARGIN * 2;
  context.fillStyle = copy.ink.text;
  condensed(context, 22, 500);
  spacedLine(context, copy.rightPage.dateline, [width / 2, 96], {
    size: 22,
    tracking: 0.24,
    width: inner,
  });
  rule(context, MARGIN, 128, inner, 1.5);
  serif(context, 100, 500, 'italic');
  spacedLine(context, copy.rightPage.nameplate, [width / 2, 250], {
    size: 100,
    tracking: 0.01,
    width: inner,
  });
  rule(context, MARGIN, 300, inner, 1.5);
  rule(context, MARGIN, 312, inner, 4);
};

const headline = (context: Context, copy: SpreadCopy, [width]: Size) => {
  const lines = linesOf(copy.rightPage.headline);
  if (lines.length === 0) {
    return;
  }
  const inner = width - MARGIN * 2;
  const lineGap = 1.02;
  const setFont = (fontSize: number) => condensed(context, fontSize, 600);
  const size = fittedSize(
    context,
    lines,
    300 * copy.rightPage.headlineSize,
    { width: inner * 0.94, height: HEADLINE_ROOM * 1.1, lineGap },
    setFont,
    1,
  );
  setFont(size);
  context.fillStyle = copy.ink.headline;
  const block = size * 0.81 + size * lineGap * (lines.length - 1);
  const top = HEADLINE_TOP + Math.max(0, (HEADLINE_ROOM - block) / 2);
  stackedLines(context, copy.rightPage.headline, [width / 2, top], {
    lineGap: size * lineGap,
    width: inner,
  });
};

const story = (
  context: Context,
  copy: SpreadCopy,
  photo: CanvasImageSource | null,
  [width]: Size,
) => {
  const inner = width - MARGIN * 2;
  context.fillStyle = copy.ink.text;
  rule(context, MARGIN, 1108, inner, 1.5);
  const photoWidth = inner * 0.5;
  printedPhoto(
    context,
    photo,
    { x: MARGIN, y: 1140, width: photoWidth, height: 430 },
    { ink: copy.ink.photo, paper: copy.ink.paper },
    {
      focus: copy.rightPage.photoFocus,
      zoom: copy.rightPage.photoZoom,
      contrast: copy.photos.contrast,
      brightness: copy.photos.brightness,
      grain: copy.photos.grain,
      seed: 29,
    },
  );
  context.fillStyle = copy.ink.text;
  serif(context, 30, 500, 'italic');
  const gutter = 40;
  bodyColumns(
    context,
    copy.rightPage.body,
    { x: MARGIN + photoWidth + gutter, y: 1166, width: inner - photoWidth - gutter, height: 410 },
    { columns: 1, gutter: 0, lineHeight: 42 },
  );
  rule(context, MARGIN, 1600, inner, 4);
  condensed(context, 26, 600);
  spacedLine(context, copy.rightPage.footer, [width / 2, 1652], {
    size: 26,
    tracking: 0.3,
    width: inner,
  });
};

export const drawRightPage = (
  context: Context,
  copy: SpreadCopy,
  photo: CanvasImageSource | null,
  size: Size,
) => {
  nameplate(context, copy, size);
  headline(context, copy, size);
  story(context, copy, photo, size);
};
