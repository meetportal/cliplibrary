import { formatRgb, parse } from 'culori';
import type { ElevatorNewspaperProps } from '@/schemas';
import {
  type Box,
  type Context,
  condensedLines,
  coverImage,
  fillerLines,
  fitText,
  linesOf,
  placeholderImage,
  rule,
  sans,
  serif,
  spaced,
} from './page-type';

const PAGE_WIDTH = 1024;
const PAGE_HEIGHT = 1448;

const OUTER = PAGE_WIDTH * 0.17;
const INNER = PAGE_WIDTH * 0.07;
const TOP = PAGE_HEIGHT * 0.05;
const BOTTOM = PAGE_HEIGHT * 0.05;
const SQUEEZE = 0.82;

type Page = { context: Context; props: ElevatorNewspaperProps; photo: CanvasImageSource | null };

const clear = (color: string) => {
  const parsed = parse(color);
  return parsed === undefined ? 'transparent' : formatRgb({ ...parsed, alpha: 0 });
};

const centeredCaps = (context: Context, text: string, x: number, y: number, size: number) => {
  sans(context, size, 600);
  spaced(context, size, 0.28);
  context.textAlign = 'center';
  context.fillText(text, x + (size * 0.28) / 2, y);
  spaced(context, size, 0);
};

const drawCover = ({ context, props, photo }: Page) => {
  const { cover, ink, masthead } = props;
  const left = OUTER;
  const width = PAGE_WIDTH - OUTER - INNER;
  context.fillStyle = ink.rules;
  rule(context, left, TOP + 6, width, 3);
  context.fillStyle = ink.text;
  centeredCaps(context, masthead.brand, left + width / 2, TOP + 58, 30);
  context.fillStyle = ink.rules;
  rule(context, left, TOP + 82, width, 3);
  const box: Box = { x: left, y: TOP + 104, width, height: PAGE_HEIGHT - BOTTOM - TOP - 104 };
  if (photo === null) {
    placeholderImage(context, box, ink.text);
  } else {
    coverImage(context, photo, box);
  }
  const shade = context.createLinearGradient(0, box.y, 0, box.y + box.height);
  shade.addColorStop(0, clear(ink.tint));
  shade.addColorStop(0.55, ink.tint);
  shade.addColorStop(1, clear(ink.tint));
  context.save();
  context.globalAlpha = cover.photoTint;
  context.fillStyle = shade;
  context.fillRect(box.x, box.y, box.width, box.height);
  context.restore();
  const lines = linesOf(cover.headline);
  const setFont = (fontSize: number) => serif(context, fontSize, 900);
  const size = fitText(context, lines, 230 * cover.headlineSize, (width * 0.9) / SQUEEZE, setFont);
  setFont(size);
  context.fillStyle = ink.coverText;
  context.textAlign = 'center';
  context.textBaseline = 'alphabetic';
  const lineGap = 0.92;
  const blockHeight = size * 0.72 + size * lineGap * (lines.length - 1);
  const firstBaseline = box.y + box.height * 0.7 - blockHeight / 2 + size * 0.72;
  condensedLines(context, lines, { x: left, y: firstBaseline, width }, size, lineGap, SQUEEZE);
};

const storyHeader = (
  context: Context,
  props: ElevatorNewspaperProps,
  left: number,
  width: number,
) => {
  const { masthead, ink } = props;
  const center = left + width / 2;
  context.fillStyle = ink.text;
  context.textAlign = 'center';
  const brandSize = fitText(context, [masthead.brand], 92, width * 0.86, (s) =>
    serif(context, s, 700),
  );
  serif(context, brandSize, 700);
  spaced(context, brandSize, 0.06);
  context.fillText(masthead.brand, center + brandSize * 0.03, TOP + 92);
  spaced(context, brandSize, 0);
  context.fillStyle = ink.rules;
  rule(context, left, TOP + 124, width, 5);
  rule(context, left, TOP + 136, width, 2);
  context.fillStyle = ink.text;
  sans(context, 24, 600);
  spaced(context, 24, 0.18);
  context.textAlign = 'left';
  context.fillText(masthead.edition, left, TOP + 172);
  context.textAlign = 'right';
  context.fillText(masthead.date, left + width, TOP + 172);
  spaced(context, 24, 0);
  context.fillStyle = ink.rules;
  rule(context, left, TOP + 194, width, 2);
};

const storyHeadline = (
  context: Context,
  props: ElevatorNewspaperProps,
  left: number,
  width: number,
) => {
  const { story, ink } = props;
  const lines = linesOf(story.headline);
  const setFont = (fontSize: number) => serif(context, fontSize, 900);
  const size = fitText(context, lines, 190 * story.headlineSize, width / SQUEEZE, setFont);
  setFont(size);
  context.fillStyle = ink.text;
  context.textAlign = 'center';
  const top = TOP + 214 + size * 0.74;
  condensedLines(context, lines, { x: left, y: top, width }, size, 0.92, SQUEEZE);
  const bottom = top + size * 0.92 * (lines.length - 1) + size * 0.16;
  context.fillStyle = ink.accent;
  centeredCaps(context, story.subhead, left + width / 2, bottom + 52, 22);
  context.fillStyle = ink.rules;
  rule(context, left, bottom + 82, width, 2);
  return bottom + 82;
};

const teaserColumn = (context: Context, props: ElevatorNewspaperProps, box: Box) => {
  const { story, ink } = props;
  context.strokeStyle = ink.rules;
  context.lineWidth = 3;
  context.strokeRect(box.x, box.y, box.width, box.height * 0.5);
  const title = linesOf(story.teaserTitle);
  const setFont = (fontSize: number) => serif(context, fontSize, 900);
  const size = fitText(context, title, 46, (box.width - 36) / SQUEEZE, setFont);
  setFont(size);
  context.fillStyle = ink.accent;
  context.textAlign = 'center';
  condensedLines(
    context,
    title,
    { x: box.x, y: box.y + 26 + size * 0.8, width: box.width },
    size,
    1,
    SQUEEZE,
  );
  const teaserTop = box.y + 26 + size * (title.length + 0.6);
  context.fillStyle = ink.text;
  sans(context, 21, 500);
  context.textAlign = 'center';
  linesOf(story.teaser).forEach((line, index) => {
    context.fillText(line, box.x + box.width / 2, teaserTop + 18 + index * 29, box.width - 28);
  });
  context.fillStyle = ink.filler;
  fillerLines(
    context,
    { x: box.x, y: box.y + box.height * 0.5 + 26, width: box.width, height: box.height * 0.5 - 26 },
    { gap: 22, weight: 7, seed: 1 },
  );
};

const photoColumn = (context: Context, page: Page, box: Box) => {
  const { story, ink } = page.props;
  const photoBox = { ...box, height: box.height * 0.72 };
  if (page.photo === null) {
    placeholderImage(context, photoBox, ink.text);
  } else {
    coverImage(context, page.photo, photoBox);
  }
  const caption = linesOf(story.caption);
  const captionTop = photoBox.y + photoBox.height + 22;
  context.fillStyle = ink.text;
  context.textAlign = 'left';
  caption.forEach((line, index) => {
    sans(context, 20, 700);
    spaced(context, 20, 0.12);
    context.fillText(line, box.x, captionTop + 20 + index * 28, box.width);
    spaced(context, 20, 0);
  });
  context.fillStyle = ink.filler;
  const fillerTop = captionTop + 20 + caption.length * 28;
  fillerLines(
    context,
    { x: box.x, y: fillerTop, width: box.width, height: box.y + box.height - fillerTop },
    { gap: 22, weight: 7, seed: 4 },
  );
};

const storyFooter = (
  context: Context,
  props: ElevatorNewspaperProps,
  left: number,
  width: number,
) => {
  const { story, ink } = props;
  const y = PAGE_HEIGHT - BOTTOM - 40;
  context.fillStyle = ink.rules;
  rule(context, left, y - 34, width, 2);
  rule(context, left, y + 22, width, 5);
  context.fillStyle = ink.text;
  for (const slot of [0.17, 0.5, 0.83]) {
    centeredCaps(context, story.footer, left + width * slot, y, 22);
  }
  context.fillStyle = ink.accent;
  for (const slot of [1 / 3, 2 / 3]) {
    context.beginPath();
    context.arc(left + width * slot, y - 7, 5, 0, Math.PI * 2);
    context.fill();
  }
};

const drawStory = (page: Page) => {
  const { context, props } = page;
  const left = INNER;
  const width = PAGE_WIDTH - OUTER - INNER;
  storyHeader(context, props, left, width);
  const bodyTop = storyHeadline(context, props, left, width) + 26;
  const bodyBottom = PAGE_HEIGHT - BOTTOM - 100;
  const gutter = 28;
  const teaserWidth = width * 0.34;
  teaserColumn(context, props, {
    x: left,
    y: bodyTop,
    width: teaserWidth,
    height: bodyBottom - bodyTop,
  });
  photoColumn(context, page, {
    x: left + teaserWidth + gutter,
    y: bodyTop,
    width: width - teaserWidth - gutter,
    height: bodyBottom - bodyTop,
  });
  storyFooter(context, props, left, width);
};

export type PageSide = 'cover' | 'story';

export const drawPage = (
  canvas: HTMLCanvasElement,
  side: PageSide,
  props: ElevatorNewspaperProps,
  photo: CanvasImageSource | null,
) => {
  const art = document.createElement('canvas');
  art.width = PAGE_WIDTH;
  art.height = PAGE_HEIGHT;
  const context = art.getContext('2d');
  canvas.width = PAGE_WIDTH;
  canvas.height = PAGE_HEIGHT;
  const target = canvas.getContext('2d');
  if (context === null || target === null) {
    return;
  }
  context.textBaseline = 'alphabetic';
  if (side === 'cover') {
    drawCover({ context, props, photo });
  } else {
    drawStory({ context, props, photo });
  }
  target.filter = props.print.softness > 0 ? `blur(${props.print.softness * 2}px)` : 'none';
  target.drawImage(art, 0, 0);
};
