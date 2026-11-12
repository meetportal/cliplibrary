import { STACK_FAMILY } from './fonts';
import type { Bar, Letter } from './layout';
import { EASE_IN, EASE_IN_OUT, EASE_SINE } from './timeline';

export type LetterState = { pop: number; shrink: number };

const POP_FROM = 0.35;

const transformOf = (letter: Letter, cap: number, state: LetterState) => {
  const settle = EASE_IN_OUT(state.pop);
  const rest = 1 - settle;
  const scale = (POP_FROM + (1 - POP_FROM) * settle) * (1 - EASE_IN(state.shrink));
  const cx = letter.centerX;
  const cy = letter.baseline + letter.lift - (cap * letter.size) / 2;
  const dx = rest * 0.05 * letter.size;
  const dy = rest * 0.1 * letter.size;
  const turn = letter.tilt + rest * 9;
  return {
    scale,
    transform: `translate(${(cx + dx).toFixed(2)} ${(cy + dy).toFixed(2)}) rotate(${turn.toFixed(3)}) scale(${scale.toFixed(4)}) translate(${(-cx).toFixed(2)} ${(-cy).toFixed(2)})`,
  };
};

type GlyphsProps = {
  letters: Letter[];
  states: LetterState[];
  cap: number;
  fill: string;
};

export const Glyphs = ({ letters, states, cap, fill }: GlyphsProps) => (
  <>
    {letters.map((letter, at) => {
      const state = states[at] ?? { pop: 0, shrink: 0 };
      if (state.pop <= 0 || state.shrink >= 1) {
        return null;
      }
      const { scale, transform } = transformOf(letter, cap, state);
      if (scale < 0.01) {
        return null;
      }
      return (
        <text
          key={`${at}-${letter.char}`}
          x={letter.x.toFixed(2)}
          y={(letter.baseline + letter.lift).toFixed(2)}
          fontSize={letter.size}
          fontFamily={`"${STACK_FAMILY}"`}
          fill={fill}
          opacity={EASE_IN_OUT(Math.min(1, state.pop * 1.1))}
          transform={transform}
        >
          {letter.char}
        </text>
      );
    })}
  </>
);

type UnderlineProps = { bar: Bar; grow: number; retract: number; fill: string };

export const Underline = ({ bar, grow, retract, fill }: UnderlineProps) => {
  const start = bar.x + bar.width * EASE_IN_OUT(retract);
  const end = bar.x + bar.width * EASE_SINE(grow);
  if (end - start < 1) {
    return null;
  }
  return (
    <rect
      x={start.toFixed(2)}
      y={bar.y.toFixed(2)}
      width={(end - start).toFixed(2)}
      height={bar.thickness}
      rx={Math.min(bar.thickness * 0.2, 3)}
      fill={fill}
    />
  );
};
