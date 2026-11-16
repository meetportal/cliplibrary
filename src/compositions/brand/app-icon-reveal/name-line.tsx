import { letterState, type Timeline } from './timeline';

export const NameLine = ({
  frame,
  line,
  text,
  top,
  width,
  size,
  family,
  weight,
  tracking,
  color,
}: {
  frame: number;
  line: Timeline;
  text: string;
  top: number;
  width: number;
  size: number;
  family: string;
  weight: number;
  tracking: number;
  color: string;
}) => {
  let order = 0;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top,
        width,
        textAlign: 'center',
        whiteSpace: 'pre',
        fontFamily: family,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 1.25,
        letterSpacing: `${tracking}em`,
        color,
      }}
    >
      {[...text].map((char, index) => {
        const blank = char.trim() === '';
        const start = line.typeStart + order * line.letterGap;
        if (!blank) {
          order += 1;
        }
        const { shown, rise } = blank ? { shown: 1, rise: 0 } : letterState(frame, start, size);
        return (
          <span
            key={`${index}-${char}`}
            style={{
              display: 'inline-block',
              transform: rise > 0 ? `translateY(${rise}px)` : undefined,
              opacity: shown,
              filter:
                shown > 0 && shown < 1 ? `blur(${(3 * (1 - shown)).toFixed(2)}px)` : undefined,
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
};
