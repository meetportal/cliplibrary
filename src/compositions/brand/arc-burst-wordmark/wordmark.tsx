import type { CSSProperties } from 'react';
import type { ArcBurstWordmarkProps } from '@/schemas';
import type { WordmarkFace } from './fonts';
import type { WordLayout } from './layout';
import { bandClip, motionStyle, type Piece, piecesFor, shardBandAt } from './pieces';
import { settledAt, type Timeline } from './timeline';

const OVERLAP = 1.5;

type Slot = {
  frame: number;
  line: Timeline;
  word: WordLayout;
  width: number;
  base: CSSProperties;
  key: string;
  char: string;
  primary: string;
};

const pieceSpans = (piece: Piece, at: number, slot: Slot) => {
  const { frame, line, word, width, base, key, char, primary } = slot;
  const motion = motionStyle(piece, frame, line.flight);
  if (motion === null) {
    return [];
  }
  const shardBand = shardBandAt(piece, frame, line.flight);
  const own = piece.band ?? (shardBand === null ? null : ([-3, shardBand[0]] as const));
  const clip = own === null ? undefined : bandClip(own, word, width, OVERLAP);
  const shard = shardBand === null ? null : bandClip(shardBand, word, width, 0);
  const hidden = shard !== null && piece.band !== null && motion.shown < 1;
  return [
    <span
      key={`${key}-${at}`}
      style={{ ...base, ...motion.style, clipPath: clip, opacity: hidden ? 0 : motion.shown }}
    >
      {char}
    </span>,
    shard === null ? null : (
      <span
        key={`${key}-${at}-shard`}
        style={{ ...base, ...motion.style, clipPath: shard, color: primary }}
      >
        {char}
      </span>
    ),
  ];
};

export const Wordmark = ({
  frame,
  word,
  line,
  props,
  face,
}: {
  frame: number;
  word: WordLayout;
  line: Timeline;
  props: ArcBurstWordmarkProps;
  face: WordmarkFace;
}) => {
  const pad = Math.ceil(word.size * 0.3);
  const lineHeight = word.ascent + word.descent;
  return (
    <>
      {word.glyphs.map((glyph, index) => {
        if (glyph.letter < 0) {
          return null;
        }
        const start = line.letterStarts[glyph.letter] ?? line.buildStart;
        const width = glyph.width + pad * 2;
        const base: CSSProperties = {
          position: 'absolute',
          left: glyph.left - pad,
          top: glyph.top,
          width,
          height: lineHeight,
          paddingLeft: pad,
          boxSizing: 'border-box',
          fontFamily: face.family,
          fontWeight: face.weight,
          fontSize: word.size,
          lineHeight: `${lineHeight}px`,
          whiteSpace: 'pre',
          color: props.colors.text,
        };
        const key = `${index}-${glyph.char}`;
        if (frame >= settledAt(start, line, props.build.style)) {
          return (
            <span key={key} style={base}>
              {glyph.char}
            </span>
          );
        }
        const slot: Slot = {
          frame,
          line,
          word,
          width,
          base,
          key,
          char: glyph.char,
          primary: props.colors.primary,
        };
        return piecesFor(glyph.letter, start, width, word, props.build, true).flatMap((piece, at) =>
          pieceSpans(piece, at, slot),
        );
      })}
    </>
  );
};
