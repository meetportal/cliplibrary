import { Easing } from 'remotion';
import { ramp } from '../../kit/motion';
import { MONO_FACE, NAME_FACE } from './fonts';
import type { Measure } from './measure';
import { pixelTween } from './pixel-tween';

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
  const around = 2 * Math.PI * outer;
  const drawn = ramp(local, 0, build, Easing.inOut(Easing.cubic));
  const dotRadius = size * 0.43;
  const segment = (2 * Math.PI * dotRadius) / Math.max(1, Math.round(look.dots));
  const suffix = look.ordinal ? ordinalOf(look.years) : '';
  const numberWidth = measure(look.years, NAME_FACE, -0.03) + measure(suffix, NAME_FACE) * 0.3;
  const numberSize = Math.min(size * 0.4, (size * 0.6) / Math.max(0.01, numberWidth));
  const lineSize = Math.min(
    size * 0.048,
    (size * 0.6) / Math.max(0.01, measure(look.line.toUpperCase(), MONO_FACE, 0.2)),
  );
  const rise = pixelTween(local, [0, build * 0.6], [size * 0.09, 0], Easing.out(Easing.cubic));
  const spin = local * look.spin;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        {look.ring > 0 ? (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={outer}
            fill="none"
            stroke={look.ink}
            strokeWidth={look.ring}
            strokeDasharray={`${(around * drawn).toFixed(2)} ${around.toFixed(2)}`}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
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
          opacity={ramp(local, build * 0.3, build * 0.8)}
          transform={`rotate(${(spin - 90).toFixed(3)} ${size / 2} ${size / 2})`}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: Math.round(size * 0.47 - numberSize * 0.62 + rise),
          height: Math.round(numberSize * 1.24),
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: NAME_FACE.family,
          fontWeight: NAME_FACE.weight,
          fontSize: numberSize,
          lineHeight: `${Math.round(numberSize * 1.24)}px`,
          letterSpacing: '-0.03em',
          whiteSpace: 'pre',
          color: look.accent,
          opacity: 0.25 + 0.75 * ramp(local, 0, build * 0.4),
        }}
      >
        {look.years}
        {suffix === '' ? null : (
          <span
            style={{
              fontSize: numberSize * 0.3,
              color: look.ink,
              letterSpacing: 0,
              marginLeft: numberSize * 0.04,
              alignSelf: 'flex-start',
              lineHeight: `${Math.round(numberSize * 0.9)}px`,
            }}
          >
            {suffix}
          </span>
        )}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: Math.round(size * 0.69 - lineSize),
          textAlign: 'center',
          fontFamily: MONO_FACE.family,
          fontWeight: MONO_FACE.weight,
          fontSize: lineSize,
          lineHeight: `${Math.round(lineSize * 2)}px`,
          letterSpacing: '0.2em',
          paddingLeft: '0.2em',
          textTransform: 'uppercase',
          whiteSpace: 'pre',
          color: look.ink,
          opacity: ramp(local, build * 0.4, build * 0.8),
        }}
      >
        {look.line}
      </div>
    </div>
  );
};
