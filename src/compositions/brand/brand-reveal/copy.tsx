import type { Face } from './fonts';
import { letterIn, type Timeline } from './timeline';

const LETTER_RISE = 0.3;

const offsetStyle = (offset: number) => (offset === 0 ? undefined : `translateY(${offset}px)`);

export const NameLetters = ({
  frame,
  line,
  text,
  left,
  top,
  size,
  face,
  tracking,
  color,
  quantum,
}: {
  frame: number;
  line: Timeline;
  text: string;
  left: number;
  top: number;
  size: number;
  face: Face;
  tracking: number;
  color: string;
  quantum: number;
}) => {
  const rise = size * LETTER_RISE;
  let order = 0;
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        whiteSpace: 'pre',
        fontFamily: face.family,
        fontWeight: face.weight,
        fontSize: size,
        lineHeight: 1,
        letterSpacing: `${tracking}em`,
        color,
      }}
    >
      {[...text].map((char, index) => {
        const blank = char.trim() === '';
        const start = line.letterStart + order * line.letterGap;
        if (!blank) {
          order += 1;
        }
        const shown = letterIn(frame, start, rise, quantum);
        const offset = blank ? 0 : shown.offset;
        const opacity = blank ? 1 : shown.opacity;
        return (
          <span
            key={`${index}-${char}`}
            style={{
              display: 'inline-block',
              opacity,
              transform: offsetStyle(offset),
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
};

export const TextLine = ({
  offset,
  opacity,
  text,
  top,
  width,
  maxWidth,
  size,
  face,
  tracking,
  lineHeight,
  color,
  upper,
}: {
  offset: number;
  opacity: number;
  text: string;
  top: number;
  width: number;
  maxWidth: number;
  size: number;
  face: Face;
  tracking: number;
  lineHeight: number;
  color: string;
  upper: boolean;
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: Math.round((width - maxWidth) / 2),
        top,
        transform: offsetStyle(offset),
        width: maxWidth,
        textAlign: 'center',
        textWrap: 'balance',
        fontFamily: face.family,
        fontWeight: face.weight,
        fontSize: size,
        lineHeight,
        letterSpacing: `${tracking}em`,
        textTransform: upper ? 'uppercase' : undefined,
        color,
        opacity,
      }}
    >
      {text}
    </div>
  );
};
