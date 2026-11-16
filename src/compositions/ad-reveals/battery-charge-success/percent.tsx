import { LABEL_FACE } from './fonts';
import type { Box } from './geometry';
import { liquidSurface, waveY } from './liquid';

const LINE = 1.2;
const STEP = 6;
const DIGIT_WIDTH = '0.62em';
const SLOTS = 3;
const ROLL = 0.38;
const SLOT = { display: 'inline-grid', width: DIGIT_WIDTH, justifyItems: 'center' } as const;

const ROLL_FRAMES = 5;
const FAST = 1;
const THRESHOLDS = [10, 100] as const;

const padded = (value: number) => `${value}`.padStart(SLOTS, ' ');

const window01 = (value: number, start: number, end: number) =>
  Math.min(1, Math.max(0, (value - start) / (end - start)));

const rollWidth = (rate: number) =>
  Math.min(1, Math.max(0.2, Math.min(ROLL_FRAMES * rate, 1 - (rate - FAST) * 2)));

const recentre = (value: number, rate: number, width: number) =>
  THRESHOLDS.reduce((hidden, threshold) => {
    const span = Math.max(1, ROLL_FRAMES * rate);
    const end = threshold - 0.5 - width / 2;
    return hidden - window01(value, end - span, end);
  }, SLOTS - 1);

const Glyph = ({ char, opacity, shift }: { char: string; opacity: number; shift: number }) =>
  char === ' ' || opacity <= 0 ? null : (
    <span
      style={{
        gridArea: '1 / 1',
        opacity,
        transform: shift === 0 ? undefined : `translateY(${shift.toFixed(3)}em)`,
      }}
    >
      {char}
    </span>
  );

const Digits = ({ value, rate }: { value: number; rate: number }) => {
  const whole = Math.min(100, Math.floor(value));
  const width = rollWidth(rate);
  const mix = whole >= 100 ? 0 : window01(value - whole, 0.5 - width / 2, 0.5 + width / 2);
  const from = padded(whole);
  const to = padded(Math.min(100, whole + 1));
  const hidden = recentre(value, rate, width);
  return (
    <span
      style={{
        display: 'inline-flex',
        transform: hidden === 0 ? undefined : `translateX(${(-hidden * 0.31).toFixed(4)}em)`,
      }}
    >
      {[...from].map((char, index) => {
        const next = to[index] ?? char;
        return (
          <span key={index} style={SLOT}>
            {char === next ? (
              <Glyph char={char} opacity={1} shift={0} />
            ) : (
              <>
                <Glyph char={char} opacity={1 - mix} shift={-mix * ROLL} />
                <Glyph char={next} opacity={mix} shift={(1 - mix) * ROLL} />
              </>
            )}
          </span>
        );
      })}
      <span>%</span>
    </span>
  );
};

export const Percent = ({
  box,
  level,
  rate,
  size,
  frame,
  wave,
  light,
  dark,
}: {
  box: Box;
  level: number;
  rate: number;
  size: number;
  frame: number;
  wave: number;
  light: string;
  dark: string;
}) => {
  const top = Math.round(box.y + box.height * 0.42 - size * 0.6);
  const height = Math.round(size * LINE);
  const { surface, amplitude } = liquidSurface(box, level, wave);
  const steps = Math.ceil(box.width / STEP);
  const edge = Array.from({ length: steps + 1 }, (_, index) => {
    const x = Math.min(box.width, index * STEP);
    const y = level <= 0.0005 ? height + 1 : waveY(box.x + x, frame, surface, amplitude, 0) - top;
    return { x, y: Math.max(-1, Math.min(height + 1, y)) };
  });
  const above = edge.every((point) => point.y <= -1);
  const below = edge.every((point) => point.y >= height + 1);
  const curve = edge.map((point) => `${point.x.toFixed(1)}px ${point.y.toFixed(1)}px`);
  const lightClip = `polygon(0px -1px, ${box.width}px -1px, ${[...curve].reverse().join(', ')})`;
  const darkClip = `polygon(${curve.join(', ')}, ${box.width}px ${height + 1}px, 0px ${height + 1}px)`;
  const text = <Digits value={level * 100} rate={rate} />;
  const style = {
    position: 'absolute',
    left: 0,
    top: 0,
    width: box.width,
    height,
    display: 'flex',
    justifyContent: 'center',
    fontFamily: LABEL_FACE.family,
    fontWeight: LABEL_FACE.weight,
    fontSize: size,
    lineHeight: `${height}px`,
    whiteSpace: 'nowrap',
  } as const;
  return (
    <div style={{ position: 'absolute', left: box.x, top, width: box.width, height }}>
      {above ? null : (
        <div style={{ ...style, color: light, clipPath: below ? undefined : lightClip }}>
          {text}
        </div>
      )}
      {below ? null : (
        <div style={{ ...style, color: dark, clipPath: above ? undefined : darkClip }}>{text}</div>
      )}
    </div>
  );
};
