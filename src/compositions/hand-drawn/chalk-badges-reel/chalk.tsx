import type { ReactNode } from 'react';
import { type Measure, REEL_FACES, type ReelFaceKey } from './fonts';
import { isShown, type Stroke } from './timeline';

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const smooth = (value: number) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};

const STAMP_WINDOW = 0.6;

const stampOf = (erase: number, index: number, count: number) => {
  const gap = count > 1 ? (1 - STAMP_WINDOW) / (count - 1) : 0;
  const local = count > 1 ? (erase - index * gap) / STAMP_WINDOW : erase;
  return { scale: 1 - 0.85 * smooth(local), opacity: 1 - smooth((local - 0.85) / 0.15) };
};

export type Stamp = { measure: Measure; order: 'left' | 'outside' };

type Glyph = { char: string; left: number; center: number };

const glyphsOf = (
  text: string,
  face: ReelFaceKey,
  size: number,
  tracking: number,
  measure: Measure,
): Glyph[] => {
  const chars = [...text];
  return chars.map((char, index) => {
    const before = measure(chars.slice(0, index + 1).join(''), face) - measure(char, face);
    const left = (before + index * tracking) * size;
    return { char, left, center: left + (measure(char, face) * size) / 2 };
  });
};

export const GrainFilter = (props: {
  id: string;
  grain: number;
  width: number;
  height: number;
}) => {
  const k = 2.8 * props.grain;
  const b = 1 + 0.95 * props.grain;
  return (
    <filter
      id={props.id}
      filterUnits="userSpaceOnUse"
      x={-props.width * 0.05}
      y={-props.height * 0.05}
      width={props.width * 1.1}
      height={props.height * 1.1}
    >
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
  const head = props.left + stroke.write * (width + soft);
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
  stamp?: Stamp | undefined;
}) => {
  const x = props.x ?? 0;
  const y = props.y ?? 0;
  const anchor = props.anchor ?? 'middle';
  const left = anchor === 'start' ? x : anchor === 'end' ? x - props.width : x - props.width / 2;
  const face = REEL_FACES[props.face];
  const settle = clamp01(props.stroke.write * 5);
  const enter = settle * settle * (3 - 2 * settle);
  const style = {
    fontFamily: `"${face.family}"`,
    fontWeight: face.weight,
    fontSize: props.size,
    whiteSpace: 'pre' as const,
    textRendering: 'geometricPrecision' as const,
  };
  const whole = (dx: number, dy: number, fill: string, opacity: number) => (
    <text
      x={x + dx}
      y={y + dy}
      textAnchor={anchor}
      dominantBaseline="central"
      fill={fill}
      opacity={opacity * enter}
      style={{ ...style, letterSpacing: `${props.tracking ?? 0}em` }}
    >
      {props.text}
    </text>
  );
  const measure = props.stamp?.measure;
  const outside = props.stamp?.order === 'outside';
  const glyphs =
    measure === undefined
      ? []
      : glyphsOf(props.text, props.face, props.size, props.tracking ?? 0, measure);
  const visible = glyphs.filter((glyph) => glyph.char.trim() !== '');
  const middle = props.width / 2;
  const byDistance = visible
    .map((glyph, index) => ({ index, away: Math.abs(glyph.center - middle) }))
    .sort((a, b) => b.away - a.away);
  const ranks = visible.map((_, index) => byDistance.findIndex((entry) => entry.index === index));
  const stamped = (dx: number, dy: number, fill: string, opacity: number) =>
    visible.map((glyph, index) => {
      const order = outside ? (ranks[index] ?? index) : index;
      const stamp = stampOf(props.stroke.erase, order, visible.length);
      if (stamp.opacity <= 0.001) {
        return null;
      }
      const cx = left + glyph.center + dx;
      const cy = y + dy;
      return (
        <text
          key={`${glyph.left.toFixed(2)}-${dx}`}
          x={left + glyph.left + dx}
          y={cy}
          textAnchor="start"
          dominantBaseline="central"
          fill={fill}
          opacity={opacity * enter * stamp.opacity}
          transform={
            stamp.scale < 1
              ? `translate(${cx.toFixed(2)} ${cy.toFixed(2)}) scale(${stamp.scale.toFixed(4)}) translate(${(-cx).toFixed(2)} ${(-cy).toFixed(2)})`
              : undefined
          }
          style={style}
        >
          {glyph.char}
        </text>
      );
    });
  const text = measure === undefined ? whole : stamped;
  return (
    <Wipe
      id={props.id}
      stroke={measure === undefined ? props.stroke : { write: props.stroke.write, erase: 0 }}
      left={left}
      right={left + props.width}
      top={y - props.size * 1.1}
      bottom={y + props.size * 1.1}
      soft={Math.max(20, Math.min(props.size * 1.4, props.width * 0.8), props.width * 0.2)}
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
      strokeDasharray={`${Math.max(0, write - erase).toFixed(4)} 2`}
      strokeDashoffset={(-erase).toFixed(4)}
      opacity={(props.opacity ?? 1) * clamp01(write * 12) * (1 - smooth((erase - 0.94) / 0.06))}
    />
  );
};

export type Lay = { id: string; left: number; right: number; top: number; bottom: number };

export const Pop = (props: {
  stroke: Stroke;
  from?: number;
  lay?: Lay;
  exitAt?: number;
  pinch?: boolean;
  turn?: number;
  children: ReactNode;
}) => {
  const { write, erase } = props.stroke;
  if (!isShown(props.stroke)) {
    return null;
  }
  const { lay } = props;
  const grow = lay === undefined ? 1 - (1 - write) ** 2 : 1;
  const from = props.from ?? 0.2;
  const enter = from + (1 - from) * grow;
  const fadeIn = lay === undefined ? smooth(write / 0.1) : 1;
  const shrink = erase;
  const pinch = props.pinch === true && lay !== undefined;
  const ex = 1 - (pinch ? 0.5 : 0.97) * shrink;
  const ey = lay === undefined ? ex : 1 - (pinch ? 0.97 : 0.85) * shrink;
  const opacity = fadeIn * (1 - smooth((erase - 0.8) / 0.2));
  const turn = (props.turn ?? 0) * (1 - grow);
  const body = (
    <g transform={`rotate(${(turn + 0.01).toFixed(3)}) scale(${enter.toFixed(4)})`}>
      {props.children}
    </g>
  );
  return (
    <g
      transform={`translate(${props.exitAt ?? 0} 0) scale(${ex.toFixed(4)} ${ey.toFixed(4)}) translate(${-(props.exitAt ?? 0)} 0)`}
      opacity={opacity}
    >
      {lay === undefined ? (
        body
      ) : (
        <Wipe
          id={lay.id}
          stroke={{ write: 1 - (1 - write) ** 2, erase: 0 }}
          left={lay.left}
          right={lay.right}
          top={lay.top}
          bottom={lay.bottom}
          soft={Math.max(40, (lay.right - lay.left) * 0.3)}
        >
          {body}
        </Wipe>
      )}
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
    <Pop stroke={props.stroke} from={0} turn={-40}>
      <path d={sparklePath(props.size)} fill={props.color} />
    </Pop>
  </g>
);
