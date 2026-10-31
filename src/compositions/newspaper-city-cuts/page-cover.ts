import {
  applyFont,
  type Box,
  type Context,
  coverImage,
  placeholderImage,
  rule,
  tracked,
  widest,
} from '../footage/canvas-type';
import { drawGem, GEM_ASPECT } from './gem-mark';
import { pageFont } from './page-fonts';
import type { PageCopy } from './page-layout';

type Size = [number, number];

const strip = (context: Context, copy: PageCopy, [width, height]: Size) => {
  context.fillStyle = copy.ink.text;
  rule(context, width * 0.045, height * 0.034, width * 0.91, 1.5);
  rule(context, width * 0.045, height * 0.094, width * 0.91, 1.5);
  const size = height * 0.03;
  applyFont(context, pageFont, size, 500, 'italic');
  tracked(context, size, 0.02);
  const room = width * 0.7;
  const fit = Math.min(1, room / widest(context, [copy.cover.strip]));
  context.save();
  context.translate(width / 2, height * 0.074);
  context.scale(fit, 1);
  context.textAlign = 'center';
  context.fillText(copy.cover.strip, 0, 0);
  context.restore();
  tracked(context, size, 0);
  const gemWidth = width * 0.04;
  context.strokeStyle = copy.ink.accent;
  for (const x of [0.085, 0.915]) {
    drawGem(
      context,
      [width * x - gemWidth / 2, height * 0.064 - (gemWidth * GEM_ASPECT) / 2],
      gemWidth,
      3,
    );
  }
};

export const drawCover = (
  context: Context,
  copy: PageCopy,
  photo: CanvasImageSource | null,
  size: Size,
) => {
  const [width, height] = size;
  strip(context, copy, size);
  const box: Box = {
    x: width * 0.045,
    y: height * 0.112,
    width: width * 0.91,
    height: height * 0.85,
  };
  if (photo === null) {
    placeholderImage(context, box, copy.ink.text);
  } else {
    coverImage(context, photo, box, { focus: copy.cover.photoFocus, zoom: copy.cover.photoZoom });
  }
};
