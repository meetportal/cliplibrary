import { Easing } from 'remotion';
import { ramp } from '../../kit/motion';
import { pixelTween } from '../dot-ring-logo-reveal/pixel-tween';
import type { Face } from './fonts';
import { LETTER_FRAMES, settle, type Timeline } from './timeline';

const STEP = 2;

const evenTween = (frame: number, range: readonly [number, number], rise: number) =>
  STEP * pixelTween(frame, range, [Math.round(rise / STEP), 0], settle);

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
}) => {
  const rise = Math.round(size * 0.16);
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
        const start = Math.round(line.letterStart + order * line.letterGap);
        if (!blank) {
          order += 1;
        }
        const end = start + LETTER_FRAMES;
        const offset = blank ? 0 : evenTween(frame, [start, end], rise);
        const opacity = blank ? 1 : ramp(frame, start, start + LETTER_FRAMES * 0.75, Easing.linear);
        return (
          <span
            key={`${index}-${char}`}
            style={{
              display: 'inline-block',
              opacity,
              transform: offset === 0 ? undefined : `translateY(${offset}px)`,
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
};

export const RisingLine = ({
  frame,
  start,
  end,
  rise,
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
  frame: number;
  start: number;
  end: number;
  rise: number;
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
  const offset = evenTween(frame, [start, end], rise);
  return (
    <div
      style={{
        position: 'absolute',
        left: Math.round((width - maxWidth) / 2),
        top: top + offset,
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
        opacity: ramp(frame, start, end, Easing.out(Easing.quad)),
      }}
    >
      {text}
    </div>
  );
};
