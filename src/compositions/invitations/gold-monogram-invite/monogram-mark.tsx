import type { GoldMonogramInviteProps } from '@/schemas';
import { settle, smooth, tween } from '../../promo/timing';
import { dashStyle, drawProgress, useSvgId } from './reveal';

const HEART: [number, number][][] = [
  [[0, 0.9]],
  [
    [-0.12, 0.74],
    [-1, 0.28],
    [-1, -0.24],
  ],
  [
    [-1, -0.78],
    [-0.42, -1],
    [0, -0.52],
  ],
  [
    [0.42, -1],
    [1, -0.78],
    [1, -0.24],
  ],
  [
    [1, 0.28],
    [0.12, 0.74],
    [0, 0.9],
  ],
];

const heartPath = (scale: number, top: number): string =>
  `${HEART.map(
    (points, index) =>
      `${index === 0 ? 'M' : 'C'} ${points
        .map(([x, y]) => `${(x * scale).toFixed(2)} ${(top + y * scale).toFixed(2)}`)
        .join(' ')}`,
  ).join(' ')} Z`;

const RING_GAP = 0.055;

const GLYPH_DASH = 4.5;

export const markPadding = 34;

const Shapes = ({
  monogram,
  serif,
  paint,
  ringStyle,
  heartStyle,
  glyphStyle,
  fill,
  heartFill,
}: {
  monogram: GoldMonogramInviteProps['monogram'];
  serif: string;
  paint: string;
  ringStyle: object;
  heartStyle: object;
  glyphStyle: object;
  fill: number;
  heartFill: number;
}) => {
  const size = monogram.initialSize;
  const gap = monogram.spacing * size;
  const radius = monogram.ringRadius;
  const heart = size * 0.1;
  const glyph = {
    fontFamily: serif,
    fontSize: size,
    fontWeight: 500,
    dominantBaseline: 'central' as const,
    fill: paint,
    fillOpacity: fill,
    stroke: paint,
    strokeWidth: Math.max(1, size / 180),
    style: glyphStyle,
  };
  return (
    <>
      <g fill="none" stroke={paint} strokeWidth={1.6}>
        <path
          d={`M 0 ${-radius} A ${radius} ${radius} 0 1 1 0 ${radius} A ${radius} ${radius} 0 1 1 0 ${-radius}`}
          pathLength={1}
          style={ringStyle}
        />
        <path
          d={`M 0 ${radius * (1 - RING_GAP)} A ${radius * (1 - RING_GAP)} ${radius * (1 - RING_GAP)} 0 1 1 0 ${-radius * (1 - RING_GAP)} A ${radius * (1 - RING_GAP)} ${radius * (1 - RING_GAP)} 0 1 1 0 ${radius * (1 - RING_GAP)}`}
          pathLength={1}
          strokeWidth={0.9}
          style={ringStyle}
        />
      </g>
      <text x={-gap} y={0} textAnchor="end" {...glyph}>
        {monogram.first}
      </text>
      <text x={gap} y={0} textAnchor="start" {...glyph}>
        {monogram.second}
      </text>
      {monogram.showHeart ? (
        <path
          d={heartPath(heart, size * 0.03)}
          fill={paint}
          fillOpacity={heartFill}
          stroke={paint}
          strokeWidth={1.4}
          pathLength={1}
          style={heartStyle}
        />
      ) : null}
    </>
  );
};

export const MonogramMark = ({
  frame,
  monogram,
  gold,
  glintColor,
  serif,
}: {
  frame: number;
  monogram: GoldMonogramInviteProps['monogram'];
  gold: GoldMonogramInviteProps['gold'];
  glintColor: string;
  serif: string;
}) => {
  const goldId = useSvgId('monogram-gold');
  const glintId = useSvgId('monogram-glint');
  const radius = monogram.ringRadius;
  const side = Math.ceil(radius + markPadding);
  const start = monogram.start;
  const draw = monogram.drawFrames;
  const ring = tween(frame, [start + 4, start + 4 + draw], [0, 1], smooth);
  const glyphs = tween(frame, [start + 14, start + 14 + draw], [0, 1], smooth);
  const heart = tween(frame, [start + draw * 0.55, start + draw * 1.15], [0, 1], smooth);
  const fill = tween(frame, [start + draw * 0.9, start + draw * 1.5], [0, 1], settle);
  const heartFill = tween(frame, [start + draw * 1.05, start + draw * 1.5], [0, 1], settle);
  const dots = tween(frame, [start + draw * 0.9, start + draw * 1.3], [0, 1], smooth);
  const glintStart = start + draw * 1.75;
  const glint = tween(frame, [glintStart, glintStart + monogram.glintFrames], [0, 1], smooth);
  const glinting = monogram.glint && glint > 0 && glint < 1;
  const glyphDash = drawProgress(glyphs) * monogram.initialSize * GLYPH_DASH;
  const glyphStyle =
    drawProgress(glyphs) >= 1
      ? {}
      : { strokeDasharray: `${glyphDash.toFixed(2)} ${monogram.initialSize * 20}` };
  const sweep = -radius * 1.6 + glint * radius * 3.2;
  if (ring <= 0) {
    return null;
  }
  return (
    <svg
      width={side * 2}
      height={side * 2}
      viewBox={`${-side} ${-side} ${side * 2} ${side * 2}`}
      role="presentation"
      style={{ display: 'block', overflow: 'visible' }}
    >
      <defs>
        <linearGradient
          id={goldId}
          gradientUnits="userSpaceOnUse"
          x1={0}
          y1={-radius}
          x2={0}
          y2={radius}
        >
          <stop offset="0" stopColor={gold.light} />
          <stop offset="0.5" stopColor={gold.dark} />
          <stop offset="0.78" stopColor={gold.light} />
          <stop offset="1" stopColor={gold.dark} />
        </linearGradient>
        <linearGradient
          id={glintId}
          gradientUnits="userSpaceOnUse"
          x1={sweep - radius * 0.7}
          y1={-radius * 0.7}
          x2={sweep + radius * 0.7}
          y2={radius * 0.7}
        >
          <stop offset="0" stopColor={glintColor} stopOpacity={0} />
          <stop offset="0.4" stopColor={glintColor} stopOpacity={0} />
          <stop offset="0.5" stopColor={glintColor} stopOpacity={0.85} />
          <stop offset="0.6" stopColor={glintColor} stopOpacity={0} />
          <stop offset="1" stopColor={glintColor} stopOpacity={0} />
        </linearGradient>
      </defs>
      <Shapes
        monogram={monogram}
        serif={serif}
        paint={`url(#${goldId})`}
        ringStyle={dashStyle(ring)}
        heartStyle={dashStyle(heart)}
        glyphStyle={glyphStyle}
        fill={fill}
        heartFill={heartFill}
      />
      {[0, 1, 2, 3].map((quarter) => (
        <path
          key={quarter}
          d="M 0 -5 L 4 0 L 0 5 L -4 0 Z"
          transform={`rotate(${quarter * 90}) translate(0 ${-radius - 16})`}
          fill={`url(#${goldId})`}
          opacity={dots}
        />
      ))}
      {glinting ? (
        <Shapes
          monogram={monogram}
          serif={serif}
          paint={`url(#${glintId})`}
          ringStyle={{}}
          heartStyle={{}}
          glyphStyle={{}}
          fill={1}
          heartFill={1}
        />
      ) : null}
    </svg>
  );
};
