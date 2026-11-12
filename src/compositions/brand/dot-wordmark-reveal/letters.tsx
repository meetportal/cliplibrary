import type { Face } from './fonts';
import type { Lockup } from './layout';

export type LetterState = { opacity: number; offset: number };

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
        <div
          key={`letter-${at}`}
          style={{
            position: 'absolute',
            left: letter.left,
            top: lockup.nameTop + state.offset,
            height: lockup.nameSize,
            lineHeight: `${lockup.nameSize}px`,
            fontFamily: face.family,
            fontWeight: face.weight,
            fontSize: lockup.nameSize,
            whiteSpace: 'pre',
            color,
            opacity: state.opacity,
          }}
        >
          {letter.text}
        </div>
      );
    })}
  </>
);
