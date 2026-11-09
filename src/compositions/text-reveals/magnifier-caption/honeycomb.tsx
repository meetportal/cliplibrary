import { useId } from 'react';
import type { Bubble } from './field';
import type { Face } from './fonts';
import type { Point } from './path';

export type CellStyle = {
  shape: 'hexagon' | 'circle';
  ring: string;
  word: string;
  lineWidth: number;
  font: Face;
};

export type CellGlow = {
  amount: number;
  spot: string;
  spotStrength: number;
  text: string;
  font: Face;
  keep: number;
};

export type Fade = { top: number; bottom: number; length: number };

const WIDTH = 1080;
const HEIGHT = 1920;

const smooth = (edge0: number, edge1: number, value: number): number => {
  const t = Math.min(1, Math.max(0, (value - edge0) / Math.max(1, edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

const fadeAt = (y: number, fade: Fade | undefined): number =>
  fade === undefined
    ? 1
    : smooth(fade.top, fade.top + fade.length, y) *
      (1 - smooth(fade.bottom - fade.length, fade.bottom, y));

const hexagonPoints = (bubble: Bubble): string =>
  Array.from({ length: 6 }, (_, corner) => {
    const angle = (Math.PI / 3) * corner;
    return `${(bubble.x + bubble.r * Math.cos(angle)).toFixed(2)},${(bubble.y + bubble.r * Math.sin(angle)).toFixed(2)}`;
  }).join(' ');

const Outline = ({ bubble, style }: { bubble: Bubble; style: CellStyle }) =>
  style.shape === 'hexagon' ? (
    <polygon
      points={hexagonPoints(bubble)}
      fill="none"
      stroke={style.ring}
      strokeWidth={style.lineWidth}
      strokeLinejoin="round"
    />
  ) : (
    <circle
      cx={bubble.x}
      cy={bubble.y}
      r={bubble.r}
      fill="none"
      stroke={style.ring}
      strokeWidth={style.lineWidth}
    />
  );

const SPOT_STOPS = [
  [0, 0.85],
  [0.26, 0.5],
  [0.56, 0.14],
  [0.86, 0],
  [1, 0],
] as const;

const Spot = ({ bubble, glow, id }: { bubble: Bubble; glow: CellGlow; id: string }) => (
  <>
    <defs>
      <radialGradient id={id}>
        {SPOT_STOPS.map(([offset, amount]) => (
          <stop
            key={offset}
            offset={offset}
            stopColor={glow.spot}
            stopOpacity={amount * glow.amount * glow.spotStrength}
          />
        ))}
      </radialGradient>
    </defs>
    <circle cx={bubble.x} cy={bubble.y} r={bubble.r * 0.92} fill={`url(#${id})`} />
  </>
);

const Label = ({
  bubble,
  style,
  glow,
}: {
  bubble: Bubble;
  style: CellStyle;
  glow: CellGlow | null;
}) => {
  const amount = glow?.amount ?? 0;
  const keep = glow?.keep ?? 1;
  const shared = {
    x: bubble.x,
    y: bubble.y,
    textAnchor: 'middle' as const,
    dominantBaseline: 'central' as const,
    fontSize: bubble.size,
  };
  return (
    <>
      {amount < 1 ? (
        <text
          {...shared}
          fontFamily={style.font.family}
          fontWeight={style.font.weight}
          fill={style.word}
          opacity={(1 - amount) * keep}
        >
          {bubble.word}
        </text>
      ) : null}
      {glow && amount > 0 ? (
        <>
          <text
            {...shared}
            fontFamily={glow.font.family}
            fontWeight={glow.font.weight}
            fill="none"
            stroke={glow.spot}
            strokeWidth={bubble.size * 0.22}
            strokeLinejoin="round"
            opacity={amount * 0.32 * keep * Math.min(1, glow.spotStrength)}
          >
            {bubble.word}
          </text>
          <text
            {...shared}
            fontFamily={glow.font.family}
            fontWeight={glow.font.weight}
            fill={glow.text}
            opacity={amount * keep}
          >
            {bubble.word}
          </text>
        </>
      ) : null}
    </>
  );
};

export const Honeycomb = ({
  bubbles,
  offset,
  style,
  scale = 1,
  center = { x: WIDTH / 2, y: HEIGHT / 2 },
  glowOf,
  fade,
}: {
  bubbles: readonly Bubble[];
  offset: Point;
  style: CellStyle;
  scale?: number;
  center?: Point;
  glowOf?: (bubble: Bubble) => CellGlow | null;
  fade?: Fade;
}) => {
  const prefix = `cell-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const transform = `translate(${center.x} ${center.y}) scale(${scale}) translate(${offset.x - center.x} ${offset.y - center.y})`;
  return (
    <svg
      aria-hidden="true"
      width={WIDTH}
      height={HEIGHT}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      style={{ position: 'absolute', left: 0, top: 0 }}
    >
      <g transform={transform}>
        {bubbles.map((bubble, index) => {
          const x = center.x + (bubble.x + offset.x - center.x) * scale;
          const y = center.y + (bubble.y + offset.y - center.y) * scale;
          const reach = bubble.r * scale + 40;
          if (x + reach < 0 || x - reach > WIDTH || y + reach < 0 || y - reach > HEIGHT) {
            return null;
          }
          const opacity = fadeAt(y, fade);
          if (opacity <= 0.001) {
            return null;
          }
          const glow = glowOf ? glowOf(bubble) : null;
          const id = `${prefix}-${index}`;
          return (
            <g key={id} opacity={opacity}>
              {glow && glow.amount > 0 ? <Spot bubble={bubble} glow={glow} id={id} /> : null}
              <Outline bubble={bubble} style={style} />
              {bubble.word ? <Label bubble={bubble} style={style} glow={glow} /> : null}
            </g>
          );
        })}
      </g>
    </svg>
  );
};
