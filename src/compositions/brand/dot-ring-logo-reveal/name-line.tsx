import { Easing } from 'remotion';
import type { Lockup } from './lockup';
import { pixelTween } from './pixel-tween';
import { letterStart, progress, settle, type Timeline } from './timeline';

export const NameLine = ({
  frame,
  lockup,
  line,
  color,
  family,
  weight,
}: {
  frame: number;
  lockup: Lockup;
  line: Timeline;
  color: string;
  family: string;
  weight: number;
}) => {
  const { name } = lockup;
  const top = name.baseline - name.ascent;
  return (
    <>
      {name.glyphs.map((glyph, index) => {
        if (glyph.char.trim() === '') {
          return null;
        }
        const left = name.left + glyph.x;
        const start = letterStart(left, line, lockup);
        const shown = progress(frame, [start, start + 7], Easing.linear);
        if (shown <= 0) {
          return null;
        }
        const rise = pixelTween(frame, [start, start + 11], [name.size * 0.3, 0], settle);
        return (
          <span
            key={`${index}-${glyph.char}`}
            style={{
              position: 'absolute',
              left,
              top: top + rise,
              fontFamily: family,
              fontWeight: weight,
              fontSize: name.size,
              lineHeight: `${name.ascent + name.descent}px`,
              whiteSpace: 'pre',
              color,
              opacity: shown,
              filter: shown < 1 ? `blur(${(4 * (1 - shown)).toFixed(2)}px)` : undefined,
            }}
          >
            {glyph.char}
          </span>
        );
      })}
    </>
  );
};
