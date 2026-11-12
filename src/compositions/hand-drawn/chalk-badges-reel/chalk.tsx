import type { ReactNode } from 'react';
import { mixOklab } from './color';
import { REEL_FACES, type ReelFaceKey } from './fonts';
import { isShown, type Stroke } from './timeline';

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export const GrainFilter = (props: { id: string; grain: number }) => {
  const k = 2.8 * props.grain;
  const b = 1 + 0.95 * props.grain;
  return (
    <filter id={props.id} x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.9"
        numOctaves={2}
        seed={7}
        result="noise"
      />
      <feColorMatrix
        in="noise"
        type="matrix"
        values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  ${-k} 0 0 0 ${b}`}
        result="holes"
      />
      <feComposite in="SourceGraphic" in2="holes" operator="in" />
    </filter>
  );
};

const Wipe = (props: {
  id: string;
  stroke: Stroke;
  left: number;
  right: number;
  top: number;
  bottom: number;
  soft: number;
  children: ReactNode;
}) => {
  const { stroke, soft } = props;
  if (!isShown(stroke)) {
    return null;
  }
  const width = props.right - props.left;
  const fade = Math.max(soft, width * 3);
  const from = props.left - fade - soft;
  const to = props.right + fade + soft * 2;
  const head = props.left - soft + stroke.write * (width + soft * 2);
  const tail = props.left - fade + stroke.erase * (width + fade);
  const writeStops: [number, string, string][] = [
    [head - soft, '#ffffff', 'write-start'],
    [head, '#000000', 'write-end'],
  ];
  const eraseStops: [number, string, string][] = [
    [tail, '#000000', 'erase-start'],
    [tail + fade, '#ffffff', 'erase-end'],
  ];
  const raw = [...eraseStops, ...writeStops];
  const at = (x: number) => clamp01((x - from) / (to - from));
  const stops = raw.map(([x, color, name], index) => ({
    name,
    offset: Math.max(at(x), ...raw.slice(0, index).map(([before]) => at(before))),
    color,
  }));
  return (
    <g>
      <defs>
        <linearGradient
          id={`${props.id}-g`}
          gradientUnits="userSpaceOnUse"
          x1={from}
          y1={0}
          x2={to}
          y2={0}
        >
          {stops.map((stop) => (
            <stop key={stop.name} offset={stop.offset} stopColor={stop.color} />
          ))}
        </linearGradient>
        <mask
          id={`${props.id}-m`}
          maskUnits="userSpaceOnUse"
          x={from}
          y={props.top}
          width={to - from}
          height={props.bottom - props.top}
        >
          <rect
            x={from}
            y={props.top}
            width={to - from}
            height={props.bottom - props.top}
            fill={`url(#${props.id}-g)`}
          />
        </mask>
      </defs>
      <g mask={`url(#${props.id}-m)`}>{props.children}</g>
    </g>
  );
};

export const ChalkText = (props: {
  id: string;
  text: string;
  face: ReelFaceKey;
  size: number;
  width: number;
  stroke: Stroke;
  fill: string;
  x?: number;
  y?: number;
  tracking?: number;
  anchor?: 'start' | 'middle' | 'end';
  shadow?: string;
}) => {
  const x = props.x ?? 0;
  const y = props.y ?? 0;
  const anchor = props.anchor ?? 'middle';
  const left = anchor === 'start' ? x : anchor === 'end' ? x - props.width : x - props.width / 2;
  const face = REEL_FACES[props.face];
  const settle = clamp01(props.stroke.write * 5);
  const enter = settle * settle * (3 - 2 * settle);
  const text = (dx: number, dy: number, fill: string, opacity: number) => (
    <text
      x={x + dx}
      y={y + dy}
      textAnchor={anchor}
      dominantBaseline="central"
      fill={fill}
      opacity={opacity * enter}
      style={{
        fontFamily: `"${face.family}"`,
        fontWeight: face.weight,
        fontSize: props.size,
        letterSpacing: `${props.tracking ?? 0}em`,
        whiteSpace: 'pre',
      }}
    >
      {props.text}
    </text>
  );
  return (
    <Wipe
      id={props.id}
      stroke={props.stroke}
      left={left}
      right={left + props.width}
      top={y - props.size * 1.1}
      bottom={y + props.size * 1.1}
      soft={Math.max(20, props.size * 1.4)}
    >
      {props.shadow === undefined
        ? null
        : text(props.size * 0.03, props.size * 0.05, props.shadow, 0.5)}
      {text(0, 0, props.fill, 1)}
    </Wipe>
  );
};

export const DrawPath = (props: {
  d: string;
  stroke: Stroke;
  color: string;
  width: number;
  opacity?: number;
}) => {
  const { write, erase } = props.stroke;
  if (!isShown(props.stroke) || write <= 0.002) {
    return null;
  }
  return (
    <path
      d={props.d}
      pathLength={1}
      fill="none"
      stroke={props.color}
      strokeWidth={props.width}
      strokeLinecap="butt"
      strokeLinejoin="round"
      strokeDasharray={`${write.toFixed(4)} 2`}
      opacity={(props.opacity ?? 1) * clamp01(write * 12) * (1 - erase * erase * (3 - 2 * erase))}
    />
  );
};

export const Pop = (props: {
  stroke: Stroke;
  from?: number;
  axis?: 'both' | 'x';
  turn?: number;
  dust: string;
  children: (tint: (color: string) => string) => ReactNode;
}) => {
  const { write, erase } = props.stroke;
  if (!isShown(props.stroke)) {
    return null;
  }
  const grow = 1 - (1 - write) ** 2;
  const from = props.from ?? 0.2;
  const enter = from + (1 - from) * grow;
  const late = erase;
  const shrink = late * late * (3 - 2 * late);
  const blend = clamp01(erase / 0.7);
  const toDust = 0.55 * blend * blend * (3 - 2 * blend);
  const tint = (color: string) => (toDust > 0 ? mixOklab(color, props.dust, toDust) : color);
  const wide = props.axis === 'x';
  const sx = enter * (1 - (wide ? 0 : 0.92) * shrink);
  const sy = wide ? 1 - 0.2 * (1 - grow) : sx;
  const fadeOut = clamp01((erase - (wide ? 0.1 : 0.6)) / (wide ? 0.9 : 0.4));
  const opacity = clamp01(write * 6) * (1 - fadeOut * fadeOut * (3 - 2 * fadeOut));
  const turn = (props.turn ?? 0) * (1 - grow);
  return (
    <g
      transform={`rotate(${(turn + 0.01).toFixed(3)}) scale(${sx.toFixed(4)} ${sy.toFixed(4)})`}
      opacity={opacity}
    >
      {props.children(tint)}
    </g>
  );
};

const sparklePath = (size: number) => {
  const s = size;
  const w = size * 0.28;
  return `M0 ${-s} Q${w * 0.35} ${-w * 0.35} ${s} 0 Q${w * 0.35} ${w * 0.35} 0 ${s} Q${-w * 0.35} ${w * 0.35} ${-s} 0 Q${-w * 0.35} ${-w * 0.35} 0 ${-s}Z`;
};

export const Sparkle = (props: {
  x: number;
  y: number;
  size: number;
  color: string;
  stroke: Stroke;
  pulse: number;
}) => (
  <g transform={`translate(${props.x} ${props.y}) scale(${props.pulse.toFixed(4)})`}>
    <Pop stroke={props.stroke} from={0} turn={-40} dust={props.color}>
      {() => <path d={sparklePath(props.size)} fill={props.color} />}
    </Pop>
  </g>
);
