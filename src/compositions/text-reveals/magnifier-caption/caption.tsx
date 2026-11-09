import type { MagnifierCaptionProps } from '@/schemas';
import { alpha } from './color';
import type { Face } from './fonts';
import type { CaptionLayout, PlacedWord } from './measure';
import type { Point } from './path';

const CHAR_FADE = 6;
const WORD_FRAMES = 14;
export const FLIGHT_FRAMES = 24;

const ramp = (frame: number, from: number, to: number): number =>
  Math.max(0, Math.min(1, (frame - from) / Math.max(1, to - from)));

const easeInOut = (t: number): number => 0.5 - 0.5 * Math.cos(Math.PI * t);

const landing = (u: number): number => 1 - (1 - u ** 2) ** 3;

export type Flight = { from: Point; size: number; face: Face; color: string; fadeIn: number };

export type CaptionColors = { text: string; keyword: string; mark: string };

export type CaptionTiming = { found: readonly number[]; fly: boolean; typing: number };

const wordAppears = (index: number, timing: CaptionTiming): number =>
  (timing.found[index] ?? 0) + (timing.fly ? FLIGHT_FRAMES - 4 : -10);

const Mark = ({
  word,
  layout,
  style,
  progress,
  color,
}: {
  word: PlacedWord;
  layout: CaptionLayout;
  style: MagnifierCaptionProps['caption']['keyword'];
  progress: number;
  color: string;
}) => {
  if (style === 'plain' || progress <= 0) {
    return null;
  }
  const size = layout.size;
  if (style === 'highlight') {
    const pad = size * 0.12;
    return (
      <div
        style={{
          position: 'absolute',
          left: word.x - pad,
          top: word.y + layout.lineHeight * 0.16,
          width: word.width + pad * 2,
          height: layout.lineHeight * 0.74,
          borderRadius: size * 0.12,
          background: alpha(color, 0.42),
          transform: `scaleX(${progress.toFixed(4)})`,
          transformOrigin: 'left center',
        }}
      />
    );
  }
  const thickness = Math.max(3, size * 0.065);
  return (
    <div
      style={{
        position: 'absolute',
        left: word.x,
        top: word.y + layout.lineHeight / 2 + size * 0.6,
        width: word.width,
        height: thickness,
        borderRadius: thickness,
        background: color,
        boxShadow: `0 0 ${(thickness * 3).toFixed(1)}px ${alpha(color, 0.8)}`,
        transform: `scaleX(${progress.toFixed(4)})`,
        transformOrigin: 'left center',
        opacity: Math.min(1, progress * 4),
      }}
    />
  );
};

const FlyingWord = ({
  word,
  frame,
  start,
  flight,
  layout,
  face,
  color,
}: {
  word: PlacedWord;
  frame: number;
  start: number;
  flight: Flight;
  layout: CaptionLayout;
  face: Face;
  color: string;
}) => {
  const u = ramp(frame, start, start + FLIGHT_FRAMES);
  if (frame < start || u >= 1) {
    return null;
  }
  const s = landing(u);
  const center = { x: word.x + word.width / 2, y: word.y + layout.lineHeight / 2 };
  const shift = {
    x: (flight.from.x - center.x) * (1 - s),
    y: (flight.from.y - center.y) * (1 - s),
  };
  const startScale = flight.size / layout.size;
  const scale = startScale + (1 - startScale) * s;
  const serif = easeInOut(ramp(u, 0.04, 0.3));
  const line = {
    position: 'absolute' as const,
    top: 0,
    height: layout.lineHeight,
    lineHeight: `${layout.lineHeight}px`,
    whiteSpace: 'pre' as const,
    fontSize: layout.size,
    textShadow: `0 0 ${(layout.size * 0.3).toFixed(1)}px ${alpha(color, 0.55 * (1 - s))}`,
  };
  return (
    <div
      style={{
        position: 'absolute',
        left: word.x,
        top: word.y,
        width: word.width,
        height: layout.lineHeight,
        opacity: flight.fadeIn > 0 ? ramp(frame, start, start + flight.fadeIn) : 1,
        transform: `translate(${shift.x.toFixed(3)}px, ${shift.y.toFixed(3)}px) scale(${scale.toFixed(5)})`,
        transformOrigin: `${(word.width / 2).toFixed(3)}px ${(layout.lineHeight / 2).toFixed(3)}px`,
      }}
    >
      <div
        style={{
          ...line,
          left: 0,
          fontFamily: face.family,
          fontWeight: face.weight,
          color,
          opacity: serif,
        }}
      >
        {word.text}
      </div>
      <div
        style={{
          ...line,
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: flight.face.family,
          fontWeight: flight.face.weight,
          color: flight.color,
          opacity: 1 - serif,
        }}
      >
        {word.text}
      </div>
    </div>
  );
};

export const TypedCaption = ({
  frame,
  layout,
  face,
  colors,
  timing,
  style,
  flights,
}: {
  frame: number;
  layout: CaptionLayout;
  face: Face;
  colors: CaptionColors;
  timing: CaptionTiming;
  style: MagnifierCaptionProps['caption']['keyword'];
  flights: readonly (Flight | null)[];
}) => {
  const last = layout.words.length - 1;
  const keyword = layout.words[last];
  const markFrom = keyword ? wordAppears(last, timing) + WORD_FRAMES + 4 : 0;
  const markProgress = easeInOut(ramp(frame, markFrom, markFrom + 26));
  return (
    <>
      {keyword ? (
        <Mark
          word={keyword}
          layout={layout}
          style={style}
          progress={markProgress}
          color={colors.mark}
        />
      ) : null}
      {layout.words.map((word) => {
        const appears = wordAppears(word.index, timing);
        const chars = [...word.text];
        const stagger = timing.fly
          ? 0
          : Math.min(timing.typing, WORD_FRAMES / Math.max(1, chars.length));
        const fade = timing.fly ? 0 : CHAR_FADE;
        return (
          <div
            key={`${word.index}-${word.text}`}
            style={{
              position: 'absolute',
              left: word.x,
              top: word.y,
              height: layout.lineHeight,
              lineHeight: `${layout.lineHeight}px`,
              whiteSpace: 'pre',
              fontFamily: face.family,
              fontWeight: face.weight,
              fontSize: layout.size,
              color: word.index === last ? colors.keyword : colors.text,
            }}
          >
            {chars.map((char, order) => (
              <span
                key={`${order}-${char}`}
                style={{
                  opacity:
                    fade === 0
                      ? Number(frame >= appears)
                      : ramp(frame, appears + order * stagger, appears + order * stagger + fade),
                }}
              >
                {char}
              </span>
            ))}
          </div>
        );
      })}
      {timing.fly
        ? layout.words.map((word) => {
            const flight = flights[word.index];
            return flight ? (
              <FlyingWord
                key={`flight-${word.index}`}
                word={word}
                frame={frame}
                start={(timing.found[word.index] ?? 0) - 4}
                flight={flight}
                layout={layout}
                face={face}
                color={word.index === last ? colors.keyword : colors.text}
              />
            ) : null;
          })
        : null}
    </>
  );
};
