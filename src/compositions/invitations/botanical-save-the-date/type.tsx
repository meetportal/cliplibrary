import type { CSSProperties } from 'react';
import { smooth, tween } from '../../promo/timing';
import { withAlpha } from './paint';

export interface Cue {
  start: number;
  end: number;
  typeFrames: number;
  eraseFrames: number;
}

export interface Voice {
  serif: string;
  display: string;
  script: string;
  ink: string;
  muted: string;
  accent: string;
  tracking: number;
}

const SOFT_CHARS = 2.4;
const BLOCK_CHARS = 2.2;

const ramp = (value: number): number => Math.min(1, Math.max(0, value));

const sweep = (frame: number, from: number, frames: number, count: number, lead: number) =>
  tween(frame, [from, from + Math.max(1, frames)], [-lead, count + lead], (t) => t);

export const onStage = (frame: number, cue: Cue): boolean =>
  frame >= cue.start - 1 && frame <= cue.end + cue.eraseFrames + 2;

type Reveal = 'type' | 'block';

export const glyphStates = (
  frame: number,
  count: number,
  cue: Cue,
  reveal: Reveal,
): { glyph: number; cover: number }[] => {
  const lead = reveal === 'block' ? BLOCK_CHARS : SOFT_CHARS;
  const front = sweep(frame, cue.start, cue.typeFrames, count, lead);
  const eraseFront = sweep(frame, cue.end, cue.eraseFrames * 0.62, count, lead);
  const eraseBack = sweep(
    frame,
    cue.end + cue.eraseFrames * 0.38,
    cue.eraseFrames * 0.62,
    count,
    lead,
  );
  return Array.from({ length: count }, (_, index) => {
    if (reveal === 'type') {
      const shown = ramp((front - index) / SOFT_CHARS);
      const erased = ramp((eraseFront - index) / SOFT_CHARS);
      return { glyph: smooth(shown) * (1 - smooth(erased)), cover: 0 };
    }
    const reached = ramp(front - index);
    const passed = ramp(front - BLOCK_CHARS - index);
    const covered = ramp(eraseFront - index);
    const cleared = ramp(eraseBack - index);
    return {
      glyph: passed * (1 - covered),
      cover: reached * (1 - passed) + covered * (1 - cleared),
    };
  });
};

export const TypedLine = ({
  text,
  frame,
  cue,
  color,
  reveal = 'type',
  style,
}: {
  text: string;
  frame: number;
  cue: Cue;
  color: string;
  reveal?: Reveal;
  style: CSSProperties;
}) => {
  const characters = Array.from(text);
  const states = glyphStates(frame, characters.length, cue, reveal);
  return (
    <div style={{ whiteSpace: 'pre', ...style }}>
      {characters.map((character, index) => {
        const state = states[index] ?? { glyph: 0, cover: 0 };
        return (
          <span
            key={`${index}:${character}`}
            style={{
              color: withAlpha(color, state.glyph),
              backgroundColor: state.cover > 0.002 ? withAlpha(color, state.cover) : undefined,
            }}
          >
            {character}
          </span>
        );
      })}
    </div>
  );
};

export const fadeCue = (frame: number, cue: Cue, delay = 0): number =>
  tween(frame, [cue.start + delay, cue.start + delay + 16], [0, 1], smooth) *
  tween(frame, [cue.end + delay * 0.5, cue.end + delay * 0.5 + 14], [1, 0], smooth);

export const lineCue = (cue: Cue, index: number, stagger: number): Cue => ({
  ...cue,
  start: cue.start + index * stagger,
});

export const capsStyle = (
  voice: Voice,
  size: number,
  weight = 400,
  tracking = voice.tracking,
): CSSProperties => ({
  fontFamily: voice.serif,
  fontSize: size,
  fontWeight: weight,
  letterSpacing: `${tracking}em`,
  lineHeight: 1.25,
  fontVariantNumeric: 'lining-nums',
});

export const scriptStyle = (voice: Voice, size: number): CSSProperties => ({
  fontFamily: voice.script,
  fontSize: size,
  lineHeight: 1.12,
  padding: '0 0.25em',
});

export const splitLines = (text: string): string[] =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
