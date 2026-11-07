import { Easing, interpolateColors } from 'remotion';
import type { DotMorphWordmarkProps } from '@/schemas';
import { pixelTween } from '../dot-ring-logo-reveal/pixel-tween';
import { withContrast } from './contrast-floor';
import { isGradientDot, landingPoint } from './dots';
import type { Letter, Wordmark } from './layout';
import { BLOOM, progress, settle, smooth, type Timeline, UNDERLINE } from './timeline';

const SEED_SCALE = 0.18;
const STEP = 2;

export const evenTween = (
  frame: number,
  range: readonly [number, number],
  [from, to]: readonly [number, number],
  easing: (t: number) => number,
) => STEP * pixelTween(frame, range, [from / STEP, to / STEP], easing);
const grow = Easing.out(Easing.cubic);

const appearance = (
  letter: Letter,
  land: number,
  style: DotMorphWordmarkProps['morph']['style'],
) =>
  style === 'bloom'
    ? { from: land - BLOOM.lead + letter.order * BLOOM.stagger, length: BLOOM.length }
    : {
        from: land + UNDERLINE.letters + letter.order * UNDERLINE.stagger,
        length: UNDERLINE.length,
      };

export const tightenShift = (frame: number, line: Timeline, distance: number) =>
  evenTween(
    frame,
    [line.toFrame(line.tightenStart), line.toFrame(line.tightenEnd)],
    [0, distance],
    smooth,
  );

type LetterMotion = { opacity: number; scale: number; dx: number; dy: number; color: string };

const letterMotion = (
  letter: Letter,
  frame: number,
  u: number,
  wordmark: Wordmark,
  line: Timeline,
  props: DotMorphWordmarkProps,
): LetterMotion | null => {
  const events = line.dots[letter.group];
  if (events === undefined) {
    return null;
  }
  const bloom = props.morph.style === 'bloom';
  const { from, length } = appearance(letter, events.land, props.morph.style);
  if (u <= from) {
    return null;
  }
  const { baseline, capHeight, dotCount } = wordmark;
  const range = [line.toFrame(from), line.toFrame(from + length)] as const;
  const target = landingPoint(letter.group, wordmark, props.morph.style);
  const { colors } = props;
  const tintFrom = isGradientDot(letter.group, dotCount)
    ? withContrast(colors.primary, colors.background, colors.text)
    : colors.dots;
  const tint = props.morph.tint;
  return {
    opacity: progress(u, [from, from + (bloom ? 5 : 7)], Easing.linear),
    scale: bloom ? SEED_SCALE + (1 - SEED_SCALE) * progress(u, [from, from + length], grow) : 1,
    dx: bloom
      ? evenTween(frame, range, [target.x - (letter.openX + letter.width / 2), 0], settle)
      : 0,
    dy: evenTween(
      frame,
      range,
      [bloom ? target.y - (baseline - capHeight / 2) : capHeight * 0.2, 0],
      settle,
    ),
    color:
      tint > 0
        ? interpolateColors(u, [from + 3, from + 3 + tint], [tintFrom, props.colors.text])
        : props.colors.text,
  };
};

export const Letters = ({
  frame,
  u,
  wordmark,
  line,
  props,
  family,
  weight,
}: {
  frame: number;
  u: number;
  wordmark: Wordmark;
  line: Timeline;
  props: DotMorphWordmarkProps;
  family: string;
  weight: number;
}) => {
  const { baseline, ascent, descent, capHeight, size } = wordmark;
  const top = baseline - ascent;
  return (
    <>
      {wordmark.letters.map((letter, index) => {
        const motion = letterMotion(letter, frame, u, wordmark, line, props);
        if (motion === null) {
          return null;
        }
        const shift = tightenShift(frame, line, letter.finalX - letter.openX);
        return (
          <span
            key={`${index}-${letter.char}`}
            style={{
              position: 'absolute',
              left: letter.openX + motion.dx + shift,
              top: top + motion.dy,
              fontFamily: family,
              fontWeight: weight,
              fontSize: size,
              lineHeight: `${ascent + descent}px`,
              whiteSpace: 'pre',
              color: motion.color,
              opacity: motion.opacity,
              transform: motion.scale < 1 ? `scale(${motion.scale.toFixed(4)})` : undefined,
              transformOrigin: `${(letter.width / 2).toFixed(1)}px ${(ascent - capHeight / 2).toFixed(1)}px`,
            }}
          >
            {letter.char}
          </span>
        );
      })}
    </>
  );
};
