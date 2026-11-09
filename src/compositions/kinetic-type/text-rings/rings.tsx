import { Easing } from 'remotion';
import type { TextRingsProps } from '@/schemas';
import type { PhraseLayout, RingState } from './field';
import { RING_FACES } from './fonts';

const REFERENCE_RADIUS = 500;
const CIRCUMFERENCE = Math.PI * 2 * REFERENCE_RADIUS;
const SOFT = 0.25;
const arrive = Easing.bezier(0.2, 0.3, 0.4, 1);
const sweep = Easing.bezier(0.3, 0.1, 0.35, 1);

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export const ringPath = () => {
  const r = REFERENCE_RADIUS;
  const lap = `A ${r} ${r} 0 1 1 0 ${r} A ${r} ${r} 0 1 1 0 ${-r}`;
  return `M 0 ${-r} ${lap} ${lap}`;
};

export type RingStyle = {
  font: TextRingsProps['nameRings']['font'];
  color: string;
  opacity: number;
};

type Placed = { text: string; center: number; glyphs: { center: number }[] };

const placeRing = (phrase: PhraseLayout) => {
  const slot = CIRCUMFERENCE / phrase.repeats;
  const fontPx = phrase.size * REFERENCE_RADIUS;
  const lay = (
    text: string,
    glyphs: PhraseLayout['metrics']['glyphs'],
    widthEm: number,
    center: number,
  ): Placed => ({
    text,
    center,
    glyphs: glyphs.map((glyph, index) => ({
      center: center + (glyph.x + glyph.width / 2 + phrase.tracking * index - widthEm / 2) * fontPx,
    })),
  });
  const separatorEm = phrase.separator.width + phrase.tracking * [...phrase.separator.text].length;
  const words: Placed[] = Array.from({ length: phrase.repeats }, (_, index) =>
    lay(phrase.metrics.text, phrase.metrics.glyphs, phrase.wordEm, CIRCUMFERENCE + index * slot),
  );
  const separators: Placed[] =
    phrase.separator.text === ''
      ? []
      : Array.from({ length: phrase.repeats }, (_, index) =>
          lay(
            phrase.separator.text,
            phrase.separator.glyphs,
            separatorEm,
            CIRCUMFERENCE + (index + 0.5) * slot,
          ),
        );
  return { words, separators, slot, fontPx };
};

const writeOpacity = (progress: number, position: number, slot: number) => {
  const share = (position - CIRCUMFERENCE + slot / 2) / CIRCUMFERENCE;
  return clamp01((progress - share) / SOFT);
};

const Run = ({
  placed,
  pathId,
  writing,
  slot,
}: {
  placed: Placed;
  pathId: string;
  writing: number | null;
  slot: number;
}) => (
  <text textAnchor="middle" dominantBaseline="central">
    <textPath href={`#${pathId}`} startOffset={placed.center.toFixed(3)}>
      {writing === null
        ? placed.text
        : [...placed.text].map((char, index) => {
            const center = placed.glyphs[index]?.center ?? placed.center + index;
            return (
              <tspan
                key={`g${center}`}
                fillOpacity={writeOpacity(writing, center, slot).toFixed(3)}
              >
                {char}
              </tspan>
            );
          })}
    </textPath>
  </text>
);

export const Ring = ({
  state,
  style,
  separatorColor,
  pathId,
  entrance,
  entranceFrames,
}: {
  state: RingState;
  style: RingStyle;
  separatorColor: string;
  pathId: string;
  entrance: TextRingsProps['rings']['entrance'];
  entranceFrames: number;
}) => {
  const phrase = state.plan.phrase;
  const { words, separators, slot, fontPx } = placeRing(phrase);
  const progress = clamp01(state.age / Math.max(1, entranceFrames));
  const writing = entrance === 'write-on' ? sweep(progress) * (1 + SOFT) : null;
  const fade = entrance === 'write-on' ? 1 : arrive(progress);
  const face = RING_FACES[style.font];
  return (
    <g
      transform={`rotate(${state.angle.toFixed(4)}) scale(${(state.radius / REFERENCE_RADIUS).toFixed(6)})`}
      opacity={(fade * style.opacity).toFixed(4)}
      fontFamily={face.family}
      fontWeight={face.weight}
      fontStyle={face.style}
      fontSize={fontPx.toFixed(3)}
      letterSpacing={`${phrase.tracking}em`}
    >
      <g fill={style.color}>
        {words.map((placed) => (
          <Run
            key={`w${placed.center}`}
            placed={placed}
            pathId={pathId}
            writing={writing}
            slot={slot}
          />
        ))}
      </g>
      <g fill={separatorColor}>
        {separators.map((placed) => (
          <Run
            key={`s${placed.center}`}
            placed={placed}
            pathId={pathId}
            writing={writing}
            slot={slot}
          />
        ))}
      </g>
    </g>
  );
};
