import type { CSSProperties } from 'react';
import { linear, tween } from './motion';
import { withAlpha } from './paint';

export interface Cue {
  start: number;
  frames: number;
  eraseAt: number;
  eraseFrames: number;
}

export type Reveal = 'soft-type' | 'block-cursor';

const SOFT_CHARS = 2.4;
const BLOCK_CHARS = 2.2;
const FADE_FRAMES = 9;
const ERASE_TAIL = 3.5;

const unit = (value: number): number => Math.min(1, Math.max(0, value));

const sweep = (
  frame: number,
  from: number,
  frames: number,
  count: number,
  minimum: number,
  extra: number,
  maximum = Number.POSITIVE_INFINITY,
) => {
  const span = Math.max(1, frames);
  const soft = Math.min(maximum, Math.max(minimum, (count / span) * FADE_FRAMES));
  return { at: tween(frame, [from, from + span], [-1, count + extra + soft], linear), soft };
};

export type GlyphState = { glyph: number; cover: number };

export const glyphStates = (
  frame: number,
  count: number,
  cue: Cue,
  reveal: Reveal,
): GlyphState[] => {
  if (reveal === 'soft-type') {
    const front = sweep(frame, cue.start, cue.frames, count, SOFT_CHARS, 1);
    const erase = sweep(frame, cue.eraseAt, cue.eraseFrames, count, SOFT_CHARS, 1);
    return Array.from({ length: count }, (_, index) => ({
      glyph: unit((front.at - index) / front.soft) * (1 - unit((erase.at - index) / erase.soft)),
      cover: 0,
    }));
  }
  const front = sweep(frame, cue.start, cue.frames, count, 1, BLOCK_CHARS);
  const erase = sweep(frame, cue.eraseAt, cue.eraseFrames, count, 1, BLOCK_CHARS, ERASE_TAIL);
  return Array.from({ length: count }, (_, index) => {
    const reached = unit((front.at - index) / front.soft);
    const passed = unit((front.at - BLOCK_CHARS - index) / front.soft);
    const erased = unit((erase.at - index) / erase.soft);
    const cleared = unit((erase.at - BLOCK_CHARS - index) / erase.soft);
    return {
      glyph: passed * (1 - erased),
      cover: reached * (1 - passed) + erased * (1 - cleared),
    };
  });
};

export const TypedLine = ({
  text,
  states,
  color,
  cursor,
  style,
}: {
  text: string;
  states: GlyphState[];
  color: string;
  cursor: string;
  style: CSSProperties;
}) => (
  <div
    style={{
      whiteSpace: 'pre',
      fontVariantLigatures: 'none',
      fontFeatureSettings: '"liga" 0, "clig" 0, "calt" 0',
      ...style,
    }}
  >
    {Array.from(text).map((character, index) => {
      const state = states[index] ?? { glyph: 0, cover: 0 };
      return (
        <span
          key={`${index}:${character}`}
          style={{
            color: withAlpha(color, state.glyph),
            backgroundColor: state.cover > 0.002 ? withAlpha(cursor, state.cover) : undefined,
          }}
        >
          {character}
        </span>
      );
    })}
  </div>
);
