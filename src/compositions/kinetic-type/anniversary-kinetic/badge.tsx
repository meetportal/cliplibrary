import { ramp } from '../../kit/motion';
import { MONO_FACE, NAME_FACE } from './fonts';
import { Line } from './line';
import type { Measure } from './measure';
import { appear, fade, glide } from './text-fx';

const ordinalOf = (value: string): string => {
  const digits = value.trim();
  if (!/^\d+$/.test(digits)) {
    return '';
  }
  const number = Number(digits);
  const tens = number % 100;
  if (tens >= 11 && tens <= 13) {
    return 'th';
  }
  return ['th', 'st', 'nd', 'rd'][number % 10] ?? 'th';
};

export type BadgeLook = {
  size: number;
  dots: number;
  ring: number;
  spin: number;
  years: string;
  line: string;
  ordinal: boolean;
  ink: string;
  accent: string;
};

const NUMBER_TRACKING = -0.03;
const RING_FROM = 1.1;
const SUFFIX_SHARE = 0.3;
const SUFFIX_GAP = 0.01;

export const Badge = ({
  look,
  local,
  build,
  measure,
}: {
  look: BadgeLook;
  local: number;
  build: number;
  measure: Measure;
}) => {
  const { size } = look;
  const outer = size / 2 - look.ring / 2;
  const ringScale = RING_FROM + (1 - RING_FROM) * ramp(local, 0, build * 0.8, glide);
  const ringOpacity = appear(local, build * 0.4);
  const dotRadius = size * 0.43;
  const segment = (2 * Math.PI * dotRadius) / Math.max(1, Math.round(look.dots));
  const suffix = look.ordinal ? ordinalOf(look.years) : '';
  const numberUnit = measure(look.years, NAME_FACE, NUMBER_TRACKING);
  const suffixUnit = measure(suffix, NAME_FACE) * SUFFIX_SHARE;
  const numberSize = Math.min(size * 0.4, (size * 0.6) / Math.max(0.01, numberUnit + suffixUnit));
  const numberWidth = numberUnit * numberSize;
  const suffixWidth = suffixUnit * numberSize;
  const gap = suffix === '' ? 0 : SUFFIX_GAP * numberSize;
  const total = numberWidth + gap + suffixWidth;
  const lineText = look.line.toUpperCase();
  const lineSize = Math.min(
    size * 0.048,
    (size * 0.6) / Math.max(0.01, measure(lineText, MONO_FACE, 0.2)),
  );
  const drop = size * 0.09 * (1 - ramp(local, 0, build * 0.6, glide));
  const numberOpacity = appear(local + 1, build * 0.4);
  const center = size * 0.47 - drop;
  const bleed = size * (RING_FROM - 1) + look.ring;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg
        width={size + bleed * 2}
        height={size + bleed * 2}
        viewBox={`${-bleed} ${-bleed} ${size + bleed * 2} ${size + bleed * 2}`}
        style={{ position: 'absolute', left: -bleed, top: -bleed }}
        aria-hidden="true"
      >
        {look.ring > 0 ? (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={outer * ringScale}
            fill="none"
            stroke={look.ink}
            strokeWidth={look.ring}
            opacity={ringOpacity}
          />
        ) : null}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={dotRadius}
          fill="none"
          stroke={look.accent}
          strokeWidth={size * 0.022}
          strokeDasharray={`${(segment * 0.45).toFixed(2)} ${(segment * 0.55).toFixed(2)}`}
          opacity={ramp(local, build * 0.3, build * 0.9, fade)}
          transform={`rotate(${(local * look.spin - 90).toFixed(3)} ${size / 2} ${size / 2})`}
        />
      </svg>
      <Line
        face={NAME_FACE}
        size={numberSize}
        center={center}
        x={-total / 2 + numberWidth / 2}
        color={look.accent}
        text={look.years}
        tracking={NUMBER_TRACKING}
        style={{ opacity: numberOpacity }}
      />
      {suffix === '' ? null : (
        <Line
          face={NAME_FACE}
          size={numberSize * SUFFIX_SHARE}
          center={center - numberSize * 0.17}
          x={total / 2 - suffixWidth / 2}
          color={look.ink}
          text={suffix}
          style={{ opacity: numberOpacity }}
        />
      )}
      <Line
        face={MONO_FACE}
        size={lineSize}
        center={size * 0.69}
        color={look.ink}
        text={lineText}
        tracking={0.2}
        style={{ opacity: ramp(local, build * 0.4, build * 0.8, fade) }}
      />
    </div>
  );
};
