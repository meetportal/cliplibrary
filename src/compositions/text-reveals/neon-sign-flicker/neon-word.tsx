import type { CSSProperties } from 'react';
import { mix } from './color';
import type { Face } from './fonts';
import type { Glyph } from './measure';

export type NeonInk = { tube: string; core: string; glass: string; glow: number; stroke: number };

export type PlacedGlyph = Glyph & { top: number; index: number };

const layer: CSSProperties = { position: 'absolute', left: 0, top: 0, whiteSpace: 'pre' };

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const NeonGlyph = ({
  glyph,
  level,
  gain,
  size,
  ink,
}: {
  glyph: PlacedGlyph;
  level: number;
  gain: number;
  size: number;
  ink: NeonInk;
}) => {
  const lit = clamp01(level);
  const shade = 1 - lit;
  const highlight = mix(ink.glass, '#ffffff', 0.4);
  return (
    <div style={{ position: 'absolute', left: glyph.x, top: glyph.top }}>
      {shade > 0 ? (
        <>
          <span
            style={{
              ...layer,
              color: ink.glass,
              filter: `drop-shadow(0 ${(size * 0.03).toFixed(1)}px ${(size * 0.025).toFixed(1)}px rgba(0,0,0,0.85))`,
              opacity: shade,
            }}
          >
            {glyph.char}
          </span>
          <span
            style={{
              ...layer,
              color: 'transparent',
              WebkitTextStroke: `${(size * 0.008 * ink.stroke).toFixed(2)}px ${highlight}`,
              transform: `translate(${(-size * 0.006).toFixed(2)}px, ${(-size * 0.008).toFixed(2)}px)`,
              opacity: shade * 0.8,
            }}
          >
            {glyph.char}
          </span>
        </>
      ) : null}
      {lit > 0 ? (
        <>
          <span
            style={{
              ...layer,
              color: ink.tube,
              WebkitTextStroke: `${(size * 0.034 * ink.stroke).toFixed(2)}px ${ink.tube}`,
              filter: `blur(${(size * 0.028).toFixed(2)}px)`,
              opacity: clamp01(lit * ink.glow * gain),
            }}
          >
            {glyph.char}
          </span>
          <span
            style={{
              ...layer,
              color: ink.core,
              WebkitTextStroke: `${(size * 0.036 * ink.stroke).toFixed(2)}px ${ink.tube}`,
              opacity: lit,
            }}
          >
            {glyph.char}
          </span>
          <span style={{ ...layer, color: ink.core, opacity: lit }}>{glyph.char}</span>
        </>
      ) : null}
    </div>
  );
};

const Haze = ({
  glyph,
  level,
  gain,
  size,
  ink,
}: {
  glyph: PlacedGlyph;
  level: number;
  gain: number;
  size: number;
  ink: NeonInk;
}) => (
  <span
    style={{
      ...layer,
      left: glyph.x,
      top: glyph.top,
      color: ink.tube,
      WebkitTextStroke: `${(size * 0.1).toFixed(2)}px ${ink.tube}`,
      filter: `blur(${(size * 0.2).toFixed(1)}px)`,
      opacity: clamp01(0.75 * clamp01(level) * ink.glow * gain),
    }}
  >
    {glyph.char}
  </span>
);

export const NeonWord = ({
  glyphs,
  levels,
  gain,
  size,
  face,
  ink,
}: {
  glyphs: readonly PlacedGlyph[];
  levels: readonly number[];
  gain: number;
  size: number;
  face: Face;
  ink: NeonInk;
}) => {
  const font: CSSProperties = {
    position: 'absolute',
    inset: 0,
    fontFamily: face.family,
    fontWeight: face.weight,
    fontSize: size,
    lineHeight: 1,
  };
  return (
    <>
      <div style={font}>
        {glyphs.map((glyph) => (
          <Haze
            key={`haze-${glyph.index}`}
            glyph={glyph}
            level={levels[glyph.index] ?? 1}
            gain={gain}
            size={size}
            ink={ink}
          />
        ))}
      </div>
      <div style={font}>
        {glyphs.map((glyph) => (
          <NeonGlyph
            key={`tube-${glyph.index}`}
            glyph={glyph}
            level={levels[glyph.index] ?? 1}
            gain={gain}
            size={size}
            ink={ink}
          />
        ))}
      </div>
    </>
  );
};
