import type { ComingSoonNewspaperProps } from '@/schemas';
import { type Context, linesOf, tracked, wrap } from '../elevator-newspaper/page-type';
import { condensedFont } from './fonts';

export type SpreadCopy = Pick<
  ComingSoonNewspaperProps,
  'leftPage' | 'rightPage' | 'photos' | 'ink'
> & {
  print: Pick<ComingSoonNewspaperProps['print'], 'softness' | 'paperTint'>;
};

export type Size = [number, number];

export const MARGIN = 64;

export const condensed = (context: Context, size: number, weight = 600) => {
  context.font = `normal ${weight} ${size}px "${condensedFont}"`;
};

const capHeight = (context: Context) => context.measureText('H').actualBoundingBoxAscent;

export const spacedLine = (
  context: Context,
  text: string,
  [x, y]: [number, number],
  { size, tracking, width }: { size: number; tracking: number; width: number },
) => {
  tracked(context, size, tracking);
  context.textAlign = 'center';
  const natural = context.measureText(text).width;
  const fit = Math.min(1, width / Math.max(1, natural));
  context.save();
  context.translate(x + (size * tracking * fit) / 2, y);
  context.scale(fit, 1);
  context.fillText(text, 0, 0);
  context.restore();
  tracked(context, size, 0);
};

export const stackedLines = (
  context: Context,
  text: string,
  [x, top]: [number, number],
  { lineGap, width }: { lineGap: number; width: number },
) => {
  const lines = linesOf(text);
  const cap = capHeight(context);
  context.textAlign = 'center';
  lines.forEach((line, index) => {
    context.fillText(line, x, top + cap + index * lineGap, width);
  });
};

export const bodyColumns = (
  context: Context,
  text: string,
  { x, y, width, height }: { x: number; y: number; width: number; height: number },
  { columns, gutter, lineHeight }: { columns: number; gutter: number; lineHeight: number },
) => {
  const columnWidth = (width - gutter * (columns - 1)) / columns;
  const rows = Math.max(1, Math.floor(height / lineHeight));
  const lines = wrap(context, text, columnWidth).slice(0, rows * columns);
  const perColumn = Math.max(1, Math.ceil(lines.length / columns));
  context.textAlign = 'left';
  lines.forEach((line, index) => {
    const column = Math.floor(index / perColumn);
    const row = index % perColumn;
    context.fillText(line, x + column * (columnWidth + gutter), y + row * lineHeight, columnWidth);
  });
};
