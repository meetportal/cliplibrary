import type { CSSProperties, ReactNode } from 'react';
import type { Face } from './fonts';

const LINE_HEIGHT = 1.24;

export type LetterStyle = {
  x?: number;
  y?: number;
  rotate?: number;
  opacity?: number;
  color?: string;
};

export const Line = ({
  face,
  size,
  center,
  x = 0,
  color,
  style,
  children,
}: {
  face: Face;
  size: number;
  center: number;
  x?: number;
  color: string;
  style?: CSSProperties;
  children: ReactNode;
}) => {
  const box = Math.round(size * LINE_HEIGHT);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: Math.round(center - box / 2),
        height: box,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: face.family,
        fontWeight: face.weight,
        fontSize: size,
        lineHeight: `${box}px`,
        whiteSpace: 'pre',
        color,
        transform: x === 0 ? undefined : `translateX(${Math.round(x)}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Letters = ({
  text,
  styleOf,
}: {
  text: string;
  styleOf: (index: number, count: number) => LetterStyle;
}) => {
  const letters = [...text];
  return (
    <>
      {letters.map((letter, index) => {
        const look = styleOf(index, letters.length);
        const moves = (look.x ?? 0) !== 0 || (look.y ?? 0) !== 0 || (look.rotate ?? 0) !== 0;
        return (
          <span
            key={`${index}-${letter}`}
            style={{
              display: 'inline-block',
              whiteSpace: 'pre',
              opacity: look.opacity ?? 1,
              color: look.color,
              transform: moves
                ? `translate(${Math.round(look.x ?? 0)}px, ${Math.round(look.y ?? 0)}px) rotate(${(look.rotate ?? 0).toFixed(2)}deg)`
                : undefined,
            }}
          >
            {letter}
          </span>
        );
      })}
    </>
  );
};
