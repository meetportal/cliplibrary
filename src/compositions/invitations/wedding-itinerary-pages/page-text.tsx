import type { WeddingItineraryPagesProps } from '@/schemas';
import { pixelTween, settle, tween } from '../../promo/timing';
import { caretOpacity, charOpacity, splitLines, type TypedSlot, typedCount } from './timeline';

type Timing = WeddingItineraryPagesProps['timing'];

export const TITLE_LEADING = 1.12;

const RISE_FRAMES = 34;

const CARET_TOP = '0.2em';

export const FadeTitle = ({
  text,
  top,
  size,
  family,
  color,
  start,
  frame,
  leading = TITLE_LEADING,
  weight = 400,
}: {
  text: string;
  top: number;
  size: number;
  family: string;
  color: string;
  start: number;
  frame: number;
  leading?: number;
  weight?: number;
}) => {
  const opacity = tween(frame, [start, start + RISE_FRAMES - 6], [0, 1], settle);
  const rise = pixelTween(frame, [start, start + RISE_FRAMES], [size * 0.16, 0], settle);
  const blur = tween(frame, [start, start + RISE_FRAMES - 10], [4, 0], settle);
  if (opacity <= 0) {
    return null;
  }
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: top + rise,
        textAlign: 'center',
        fontFamily: family,
        fontSize: size,
        fontWeight: weight,
        lineHeight: `${Math.round(size * leading)}px`,
        color,
        opacity,
        filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : undefined,
        whiteSpace: 'pre',
      }}
    >
      {splitLines(text).join('\n')}
    </div>
  );
};

export const TypedLine = ({
  slot,
  top,
  height,
  size,
  family,
  weight,
  tracking,
  color,
  frame,
  timing,
}: {
  slot: TypedSlot;
  top: number;
  height: number;
  size: number;
  family: string;
  weight: number;
  tracking: number;
  color: string;
  frame: number;
  timing: Timing;
}) => {
  if (frame < slot.start - 4) {
    return null;
  }
  const chars = Array.from(slot.text);
  const typed = typedCount(frame, slot, chars.length, timing);
  const caret = caretOpacity(frame, slot, timing);
  const caretAt = Math.max(0, typed - 1);
  const caretLeft =
    typed === 0 ? `${-size * 0.08}px` : `calc(100% - ${tracking / 2}em + ${size * 0.03}px)`;
  const spans = chars.map((char, index) => (
    <span key={index} style={{ position: 'relative' }}>
      <span style={{ opacity: charOpacity(frame, slot, index, timing) }}>{char}</span>
      {caret > 0 && index === caretAt ? (
        <span
          style={{
            position: 'absolute',
            left: caretLeft,
            top: CARET_TOP,
            width: Math.max(2, size * 0.06),
            height: '0.82em',
            background: color,
            opacity: caret,
          }}
        />
      ) : null}
    </span>
  ));
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top,
        height,
        lineHeight: `${height}px`,
        textAlign: 'center',
        fontFamily: family,
        fontSize: size,
        fontWeight: weight,
        letterSpacing: `${tracking}em`,
        paddingLeft: `${tracking}em`,
        fontKerning: 'none',
        fontVariantLigatures: 'none',
        color,
        whiteSpace: 'pre',
      }}
    >
      {spans}
    </div>
  );
};

export const DIVIDER_HEIGHT = 16;

export const Divider = ({
  top,
  width,
  color,
  start,
  frame,
}: {
  top: number;
  width: number;
  color: string;
  start: number;
  frame: number;
}) => {
  const grow = tween(frame, [start, start + 30], [0, 1], settle);
  if (grow <= 0) {
    return null;
  }
  const half = width / 2;
  const reach = (half - 14) * grow;
  const box = width + 4;
  const mid = box / 2;
  return (
    <svg
      width={box}
      height={DIVIDER_HEIGHT}
      viewBox={`0 0 ${box} ${DIVIDER_HEIGHT}`}
      style={{ position: 'absolute', left: `calc(50% - ${mid}px)`, top }}
      aria-hidden="true"
    >
      <rect x={mid - 14 - reach} y={7.25} width={reach} height={1.5} fill={color} />
      <rect x={mid + 14} y={7.25} width={reach} height={1.5} fill={color} />
      <path
        d={`M${mid} 2L${mid + 6} 8L${mid} 14L${mid - 6} 8Z`}
        fill={color}
        opacity={tween(frame, [start + 4, start + 20], [0, 1], settle)}
      />
    </svg>
  );
};
