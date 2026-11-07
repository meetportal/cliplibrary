import { random } from 'remotion';
import type { ArcBurstWordmarkProps } from '@/schemas';
import { type Glyph, scaleMetrics, type WordMetrics } from './fonts';
import { splitLines } from './word-lines';

const LINE_STEP = 1.12;

export type Point = { x: number; y: number };

export type MarkBox = { left: number; top: number; width: number; height: number };

export type WordLayout = {
  size: number;
  left: number;
  top: number;
  baseline: number;
  firstBaseline: number;
  width: number;
  ascent: number;
  descent: number;
  inkTop: number;
  inkBottom: number;
  glyphs: (Glyph & { letter: number; left: number; top: number })[];
  letters: number;
  center: Point;
  reach: number;
  mark: MarkBox | null;
};

export const fitMark = (
  aspect: number,
  mark: ArcBurstWordmarkProps['mark'],
): { width: number; height: number } => {
  const inset = mark.plate ? mark.padding * 2 : 0;
  const width = Math.max(1, mark.width - inset);
  const height = Math.max(1, mark.height - inset);
  const fitted =
    aspect >= width / height
      ? { width, height: width / aspect }
      : { width: height * aspect, height };
  return { width: Math.round(fitted.width + inset), height: Math.round(fitted.height + inset) };
};

export const caseName = (name: string, letterCase: ArcBurstWordmarkProps['name']['letterCase']) =>
  letterCase === 'lowercase'
    ? name.toLocaleLowerCase()
    : letterCase === 'uppercase'
      ? name.toLocaleUpperCase()
      : name;

export const layoutWord = (
  reference: WordMetrics,
  name: ArcBurstWordmarkProps['name'],
  frame: { width: number; height: number },
  mark: { width: number; height: number; gap: number } | null,
): WordLayout => {
  const available = (frame.width * name.maxWidth) / 100;
  const { lines, widest } = splitLines(
    reference.glyphs,
    reference.width,
    available,
    name.size,
    name.wrap,
  );
  const fit = widest > 0 ? (available / widest) * 100 : name.size;
  const size = Math.max(8, Math.min(name.size, fit));
  const k = size / 100;
  const metrics = scaleMetrics(reference, size);
  const center = { x: frame.width / 2, y: frame.height / 2 + name.offsetY };
  const step = Math.round(size * LINE_STEP);
  const block = mark === null ? 0 : mark.height + mark.gap;
  const inkHeight = metrics.inkTop + metrics.inkBottom + step * (lines.length - 1);
  const lockupTop = Math.round(center.y - (block + inkHeight) / 2);
  const firstBaseline = Math.round(lockupTop + block + metrics.inkTop);
  const width = widest * k;
  const left = Math.round(center.x - width / 2);
  let letter = 0;
  const glyphs = lines.flatMap((line, row) => {
    const lineLeft = Math.round(center.x - (line.width * k) / 2);
    const top = firstBaseline + row * step - Math.round(metrics.ascent);
    return metrics.glyphs.slice(line.from, line.to).map((glyph) => {
      const visible = glyph.char.trim() !== '';
      const placed = {
        ...glyph,
        letter: visible ? letter : -1,
        left: lineLeft + glyph.x - line.x * k,
        top,
      };
      letter += visible ? 1 : 0;
      return placed;
    });
  });
  const reach =
    Math.hypot(
      Math.max(center.x, frame.width - center.x),
      Math.max(center.y, frame.height - center.y),
    ) * 1.02;
  return {
    size,
    left,
    top: firstBaseline - metrics.ascent,
    baseline: firstBaseline + step * (lines.length - 1),
    firstBaseline,
    width,
    ascent: metrics.ascent,
    descent: metrics.descent,
    inkTop: metrics.inkTop,
    inkBottom: metrics.inkBottom,
    glyphs,
    letters: letter,
    center,
    reach,
    mark:
      mark === null
        ? null
        : {
            left: Math.round(center.x - mark.width / 2),
            top: lockupTop,
            width: mark.width,
            height: mark.height,
          },
  };
};

export const seeded = (key: string, count: number) =>
  Array.from({ length: count }, (_, index) => random(`${key}-${index}`));

export const arcPath = (center: Point, radius: number, from: number, to: number) => {
  const sweep = to - from;
  if (Math.abs(sweep) < 0.0001 || radius <= 0) {
    return '';
  }
  const start = { x: center.x + radius * Math.cos(from), y: center.y + radius * Math.sin(from) };
  const end = { x: center.x + radius * Math.cos(to), y: center.y + radius * Math.sin(to) };
  const large = Math.abs(sweep) > Math.PI ? 1 : 0;
  const direction = sweep > 0 ? 1 : 0;
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${radius.toFixed(2)} ${radius.toFixed(2)} 0 ${large} ${direction} ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
};

export const ARC_STYLES = ['dots', 'thick', 'dashes', 'thin'] as const;

export type ArcStyle = (typeof ARC_STYLES)[number];

export const strokeFor = (style: ArcStyle, unit: number) => {
  switch (style) {
    case 'dots':
      return {
        strokeWidth: unit * 0.9,
        strokeDasharray: `0.01 ${(unit * 2.4).toFixed(2)}`,
        strokeLinecap: 'round' as const,
      };
    case 'dashes':
      return {
        strokeWidth: unit * 0.7,
        strokeDasharray: `${(unit * 2.6).toFixed(2)} ${(unit * 1.8).toFixed(2)}`,
        strokeLinecap: 'butt' as const,
      };
    case 'thick':
      return { strokeWidth: unit * 1.8, strokeLinecap: 'butt' as const };
    default:
      return { strokeWidth: unit * 0.55, strokeLinecap: 'butt' as const };
  }
};
