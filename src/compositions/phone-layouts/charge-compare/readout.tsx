import { LABEL_FACE } from './fonts';
import { progress } from './timeline';

const BLUR_PER_COUNT = 0.4;
const MAX_BLUR = 1.5;
const MAX = 100;
const FINISH_FROM = 98.5;
const RISE = 0.45;

export type Shutter = { ones: readonly number[]; tens: readonly number[] };

export type ReadoutLook = {
  value: number;
  shutter: Shutter;
  rate: number;
  width: number;
  top: number;
  size: number;
  digit: number;
  sign: number;
  color: string;
  opacity: number;
};

type Slot = { presence: number; glyphs: readonly { text: string; weight: number }[] };

const digitOf = (count: number, place: number) =>
  place > 1 && count < place ? null : String(Math.floor(count / place) % 10);

const exposed = (samples: readonly number[], place: number): Slot => {
  const weights = new Map<string, number>();
  let presence = 0;
  for (const sample of samples) {
    const text = digitOf(Math.round(Math.max(0, Math.min(MAX, sample))), place);
    if (text !== null) {
      presence += 1 / samples.length;
      weights.set(text, (weights.get(text) ?? 0) + 1 / samples.length);
    }
  }
  return { presence, glyphs: [...weights].map(([text, weight]) => ({ text, weight })) };
};

const Layer = ({
  look,
  shutter,
  fade,
  shift,
}: {
  look: ReadoutLook;
  shutter: Shutter;
  fade: number;
  shift: number;
}) => {
  const slots = [exposed(shutter.tens, 100), exposed(shutter.tens, 10), exposed(shutter.ones, 1)];
  const total = slots.reduce((sum, slot) => sum + slot.presence * look.digit, look.sign);
  const blur = Math.min(MAX_BLUR, Math.abs(look.rate) * BLUR_PER_COUNT);
  let left = (look.width - total) / 2;
  const placed = slots.map((slot) => {
    const at = left;
    left += slot.presence * look.digit;
    return { ...slot, at };
  });
  const text = {
    position: 'absolute',
    top: look.top,
    fontFamily: LABEL_FACE.family,
    fontWeight: LABEL_FACE.weight,
    fontSize: look.size,
    lineHeight: 1,
    whiteSpace: 'pre',
    color: look.color,
    transform: shift === 0 ? undefined : `translateY(${shift * RISE * look.size}px)`,
  } as const;
  return (
    <>
      {placed.flatMap((slot, index) =>
        slot.glyphs.map((glyph) => (
          <div
            key={`${index}-${glyph.text}`}
            style={{
              ...text,
              left: slot.at,
              width: look.digit,
              textAlign: 'center',
              opacity: look.opacity * fade * glyph.weight,
              filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
            }}
          >
            {glyph.text}
          </div>
        )),
      )}
      <div style={{ ...text, left, opacity: look.opacity * fade }}>%</div>
    </>
  );
};

export const Readout = ({ look }: { look: ReadoutLook }) => {
  if (look.value < FINISH_FROM || look.value >= MAX) {
    return <Layer look={look} shutter={look.shutter} fade={1} shift={0} />;
  }
  const roll = progress(look.value, FINISH_FROM, MAX);
  const before = { ones: [MAX - 1], tens: [MAX - 1] };
  const after = { ones: [MAX], tens: [MAX] };
  return (
    <>
      <Layer
        look={look}
        shutter={before}
        fade={1 - progress(roll, 0.25, 0.75)}
        shift={-progress(roll, 0.15, 0.75)}
      />
      <Layer
        look={look}
        shutter={after}
        fade={progress(roll, 0.35, 0.9)}
        shift={1 - progress(roll, 0.25, 1)}
      />
    </>
  );
};
