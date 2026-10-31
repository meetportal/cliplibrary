import {
  applyFont,
  type Box,
  type Context,
  coverImage,
  placeholderImage,
  rule,
  tracked,
  widest,
  wrap,
} from '../footage/canvas-type';
import { drawGem, GEM_ASPECT } from './gem-mark';
import { mastheadFont, pageFont } from './page-fonts';
import type { PageCopy } from './page-layout';

type Size = [number, number];

const fitLine = (context: Context, text: string, x: number, y: number, room: number) => {
  const fit = Math.min(1, room / widest(context, [text]));
  context.save();
  context.translate(x, y);
  context.scale(fit, 1);
  context.fillText(text, 0, 0);
  context.restore();
};

const masthead = (context: Context, copy: PageCopy, [width, height]: Size) => {
  context.fillStyle = copy.ink.text;
  context.textAlign = 'center';
  applyFont(context, mastheadFont, height * 0.072, 400);
  fitLine(context, copy.masthead.title, width / 2, height * 0.098, width * 0.9);
  rule(context, width * 0.045, height * 0.122, width * 0.91, 4);
  rule(context, width * 0.045, height * 0.13, width * 0.91, 1.5);
  const size = height * 0.016;
  applyFont(context, pageFont, size, 600);
  tracked(context, size, 0.22);
  fitLine(context, copy.masthead.dateline, width / 2 + size * 0.11, height * 0.153, width * 0.8);
  tracked(context, size, 0);
  rule(context, width * 0.045, height * 0.168, width * 0.91, 1.5);
};

const headline = (context: Context, copy: PageCopy, [width, height]: Size) => {
  const box: Box = {
    x: width * 0.06,
    y: height * 0.19,
    width: width * 0.88,
    height: height * 0.24,
  };
  const lineGap = 1.08;
  let size = height * 0.066 * copy.story.headlineSize;
  let lines: string[] = [];
  for (let attempt = 0; attempt < 60; attempt += 1) {
    applyFont(context, pageFont, size, 800);
    lines = wrap(context, copy.story.headline, box.width);
    if (lines.length * size * lineGap <= box.height) {
      break;
    }
    size *= 0.95;
  }
  context.fillStyle = copy.ink.text;
  context.textAlign = 'center';
  const top = box.y + (box.height - lines.length * size * lineGap) / 2 + size * 0.8;
  lines.forEach((line, index) => {
    fitLine(context, line, width / 2, top + index * size * lineGap, box.width);
  });
  context.fillStyle = copy.ink.accent;
  rule(context, width * 0.4, height * 0.452, width * 0.2, 3);
};

const body = (context: Context, copy: PageCopy, box: Box) => {
  const size = box.width * 0.062;
  applyFont(context, pageFont, size, 400);
  context.fillStyle = copy.ink.text;
  context.textAlign = 'left';
  const lineHeight = size * 1.42;
  const rows = Math.floor((box.height - size) / lineHeight) + 1;
  wrap(context, copy.story.body, box.width)
    .slice(0, rows)
    .forEach((line, index) => {
      context.fillText(line, box.x, box.y + size + index * lineHeight, box.width);
    });
};

const showDetails = (
  context: Context,
  copy: PageCopy,
  image: CanvasImageSource | null,
  box: Box,
) => {
  const photoBox: Box = { ...box, height: box.height * 0.68 };
  if (image === null) {
    placeholderImage(context, photoBox, copy.ink.text);
  } else {
    coverImage(context, image, photoBox);
  }
  context.textAlign = 'left';
  context.fillStyle = copy.ink.text;
  applyFont(context, pageFont, box.width * 0.105, 800);
  fitLine(context, copy.story.booth, box.x, box.y + box.height * 0.84, box.width);
  context.fillStyle = copy.ink.accent;
  applyFont(context, pageFont, box.width * 0.088, 600, 'italic');
  fitLine(context, copy.story.dates, box.x, box.y + box.height * 0.97, box.width);
};

const band = (context: Context, copy: PageCopy, [width, height]: Size) => {
  const box: Box = {
    x: width * 0.045,
    y: height * 0.85,
    width: width * 0.91,
    height: height * 0.085,
  };
  context.fillStyle = copy.ink.band;
  context.beginPath();
  context.roundRect(box.x, box.y, box.width, box.height, box.height / 2);
  context.fill();
  const gemWidth = box.height * 0.62;
  context.strokeStyle = copy.ink.accent;
  drawGem(
    context,
    [box.x + box.height * 0.55, box.y + (box.height - gemWidth * GEM_ASPECT) / 2],
    gemWidth,
    4,
  );
  const size = box.height * 0.42;
  applyFont(context, pageFont, size, 700);
  tracked(context, size, 0.28);
  context.fillStyle = copy.ink.bandText;
  context.textAlign = 'center';
  fitLine(
    context,
    copy.story.band,
    width / 2 + size * 0.14,
    box.y + box.height / 2 + size * 0.36,
    box.width - box.height * 3,
  );
  tracked(context, size, 0);
};

export const drawStory = (
  context: Context,
  copy: PageCopy,
  image: CanvasImageSource | null,
  size: Size,
) => {
  const [width, height] = size;
  masthead(context, copy, size);
  headline(context, copy, size);
  const top = height * 0.48;
  const bottom = height * 0.82;
  body(context, copy, { x: width * 0.06, y: top, width: width * 0.4, height: bottom - top });
  showDetails(context, copy, image, {
    x: width * 0.52,
    y: top,
    width: width * 0.42,
    height: bottom - top,
  });
  band(context, copy, size);
};
