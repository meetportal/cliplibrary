import { CanvasText } from './canvas-text';
import type { Face } from './fonts';
import type { Lockup } from './layout';

export type LetterState = { opacity: number; offset: number; shift: number };

export const Letters = ({
  lockup,
  face,
  color,
  states,
}: {
  lockup: Lockup;
  face: Face;
  color: string;
  states: readonly LetterState[];
}) => (
  <>
    {lockup.letters.map((letter, at) => {
      const state = states[at];
      if (state === undefined || state.opacity <= 0 || letter.text.trim() === '') {
        return null;
      }
      return (
        <CanvasText
          key={`letter-${at}`}
          glyph={{
            text: letter.text,
            face,
            size: lockup.nameSize,
            tracking: 0,
            color,
            lineHeight: lockup.nameSize,
            width: letter.width,
          }}
          left={letter.left}
          top={lockup.nameTop}
          opacity={state.opacity}
          dx={state.shift}
          dy={state.offset}
        />
      );
    })}
  </>
);
