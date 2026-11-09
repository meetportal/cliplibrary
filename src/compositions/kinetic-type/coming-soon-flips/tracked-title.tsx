import type { CSSProperties } from 'react';
import type { ComingSoonFlipsProps } from '@/schemas';
import type { Face } from './fonts';
import type { TitleLine } from './layout';
import type { Measure } from './measure';
import { pixelTween } from './pixel-tween';
import { hash, settle } from './timeline';

const LEAD_LETTERS = 3;
const FLICKER_FLOOR = 0.3;

type Title = ComingSoonFlipsProps['title'];

const appearFrames = (title: Title): number[][] => {
  const lines = [Array.from(title.top), Array.from(title.bottom)];
  const slots = lines.flatMap((letters, line) =>
    letters.map((_, index) => ({ line, index, order: hash(title.seed, line, index) })),
  );
  const ranked = [...slots].sort((a, b) => a.order - b.order);
  const late = Math.max(1, ranked.length - LEAD_LETTERS);
  const frames = lines.map((letters) => letters.map(() => 0));
  ranked.forEach((slot, rank) => {
    const row = frames[slot.line];
    if (row !== undefined) {
      row[slot.index] = Math.floor(
        (Math.max(0, rank - LEAD_LETTERS + 1) / late) * title.appearFrames,
      );
    }
  });
  return frames;
};

const letterOpacity = (
  title: Title,
  appear: number,
  line: number,
  index: number,
  local: number,
) => {
  if (local < appear) {
    return 0;
  }
  if (local >= appear + title.flickerFrames) {
    return 1;
  }
  return FLICKER_FLOOR + (1 - FLICKER_FLOOR) * hash(title.seed, line, index, local);
};

const Line = ({
  line,
  row,
  title,
  face,
  measure,
  appear,
  local,
  paint,
}: {
  line: TitleLine;
  row: number;
  title: Title;
  face: Face;
  measure: Measure;
  appear: number[];
  local: number;
  paint: CSSProperties;
}) => {
  const letters = Array.from(line.text);
  const advance = (measure(line.text, face).width * line.size) / Math.max(1, letters.length);
  const extra = (title.spread - 1) * advance;
  const middle = (letters.length - 1) / 2;
  const range: [number, number] = [0, Math.max(1, title.settleFrames)];
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: line.top,
        display: 'flex',
        justifyContent: 'center',
        paddingLeft: `${title.tracking}em`,
        fontFamily: face.family,
        fontWeight: face.weight,
        fontSize: line.size,
        lineHeight: 1,
        letterSpacing: `${title.tracking}em`,
        whiteSpace: 'pre',
      }}
    >
      {letters.map((letter, index) => {
        const offset = pixelTween(local, range, [(index - middle) * extra, 0], settle);
        const opacity = letterOpacity(title, appear[index] ?? 0, row, index, local);
        return (
          <span
            key={`${row}:${index}:${letter}`}
            style={{
              ...paint,
              display: 'inline-block',
              opacity,
              transform: offset === 0 ? undefined : `translateX(${offset}px)`,
            }}
          >
            {letter}
          </span>
        );
      })}
    </div>
  );
};

export const TrackedTitle = ({
  title,
  lines,
  face,
  measure,
  local,
  outlineColor,
  solidColor,
}: {
  title: Title;
  lines: { top: TitleLine; bottom: TitleLine };
  face: Face;
  measure: Measure;
  local: number;
  outlineColor: string;
  solidColor: string;
}) => {
  const appear = appearFrames(title);
  const paint = (which: 'top' | 'bottom'): CSSProperties =>
    title.outlined === which
      ? { color: 'transparent', WebkitTextStroke: `${title.outline}px ${outlineColor}` }
      : { color: which === 'top' && title.outlined === 'none' ? outlineColor : solidColor };
  return (
    <>
      <Line
        line={lines.top}
        row={0}
        title={title}
        face={face}
        measure={measure}
        appear={appear[0] ?? []}
        local={local}
        paint={paint('top')}
      />
      <Line
        line={lines.bottom}
        row={1}
        title={title}
        face={face}
        measure={measure}
        appear={appear[1] ?? []}
        local={local}
        paint={paint('bottom')}
      />
    </>
  );
};
