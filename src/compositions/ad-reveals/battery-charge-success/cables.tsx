import { useId } from 'react';
import { alpha, mix } from './color';
import { LABEL_FACE } from './fonts';
import {
  type CableState,
  cablePoints,
  PLUG_LENGTH,
  PLUG_THICKNESS,
  type Point,
  pathOf,
  pointAt,
} from './geometry';
import type { CableKey } from './timeline';

export type DrawnCable = {
  key: CableKey;
  state: CableState;
  label: string;
  color: string;
  seed: number;
};

export type CableLook = {
  frame: number;
  tone: number;
  empty: string;
  wire: string;
  shell: string;
  text: string;
  sway: number;
  pulses: number;
  pulseStart: number;
  labelSize: number;
};

const PULSE_PERIOD = 54;
const LABEL_GAP = 50;
const DEGREES = 180 / Math.PI;

const Pulses = ({
  cable,
  points,
  look,
  id,
}: {
  cable: DrawnCable;
  points: Point[];
  look: CableLook;
  id: string;
}) => {
  if (look.pulses === 0) {
    return null;
  }
  const since = look.frame - look.pulseStart;
  const shown = Math.min(1, Math.max(0, since / 12)) * (1 - Math.min(1, cable.state.released * 3));
  if (shown <= 0) {
    return null;
  }
  return (
    <>
      {Array.from({ length: look.pulses }, (_, index) => {
        const t = 1 - ((since / PULSE_PERIOD + index / look.pulses + cable.seed * 0.13) % 1);
        const edge = Math.min(1, t / 0.08, (1 - t) / 0.12);
        const point = pointAt(points, t);
        return (
          <g key={index} opacity={shown * edge}>
            <circle cx={point.x} cy={point.y} r={26} fill={`url(#${id}-${cable.key})`} />
            <circle cx={point.x} cy={point.y} r={5} fill={mix(cable.color, '#ffffff', 0.55)} />
          </g>
        );
      })}
    </>
  );
};

const Plug = ({ cable, look }: { cable: DrawnCable; look: CableLook }) => {
  const { tip, angle, opacity } = cable.state.pose;
  const stripe = mix(look.empty, cable.color, look.tone);
  const relief = mix(look.shell, '#7d8a88', 0.35);
  return (
    <g
      transform={`translate(${tip.x.toFixed(2)} ${tip.y.toFixed(2)}) rotate(${(angle * DEGREES).toFixed(3)})`}
      opacity={opacity}
    >
      <rect x={-24} y={-12} width={26} height={24} rx={3} fill="#252c30" />
      <rect x={-20} y={-6} width={18} height={3} fill="#8c979a" />
      <rect x={-20} y={3} width={18} height={3} fill="#8c979a" />
      <rect
        x={-PLUG_LENGTH + 16}
        y={-PLUG_THICKNESS / 2}
        width={PLUG_LENGTH - 36}
        height={PLUG_THICKNESS}
        rx={9}
        fill={look.shell}
      />
      <rect x={-56} y={-PLUG_THICKNESS / 2} width={10} height={PLUG_THICKNESS} fill={stripe} />
      <rect
        x={-70}
        y={-PLUG_THICKNESS / 2}
        width={6}
        height={PLUG_THICKNESS}
        fill={alpha(stripe, 0.6)}
      />
      <rect x={-PLUG_LENGTH} y={-9} width={20} height={18} rx={4} fill={relief} />
    </g>
  );
};

export const CableWires = ({
  cables,
  look,
}: {
  cables: readonly DrawnCable[];
  look: CableLook;
}) => {
  const id = useId().replace(/:/g, '');
  const drawn = cables.map((cable) => ({
    cable,
    points: cablePoints(cable.state, look.frame, cable.seed, look.sway),
  }));
  return (
    <svg
      width={1080}
      height={1920}
      viewBox="0 0 1080 1920"
      style={{ position: 'absolute', left: 0, top: 0 }}
      aria-hidden="true"
    >
      <defs>
        {cables.map((cable) => (
          <radialGradient key={cable.key} id={`${id}-${cable.key}`}>
            <stop offset="0" stopColor={cable.color} stopOpacity={0.95} />
            <stop offset="0.35" stopColor={cable.color} stopOpacity={0.45} />
            <stop offset="1" stopColor={cable.color} stopOpacity={0} />
          </radialGradient>
        ))}
      </defs>
      {drawn.map(({ cable, points }) => (
        <path
          key={cable.key}
          d={pathOf(points)}
          fill="none"
          stroke={look.wire}
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={cable.state.pose.opacity}
        />
      ))}
      {drawn.map(({ cable, points }) => (
        <Pulses key={cable.key} cable={cable} points={points} look={look} id={id} />
      ))}
      {cables.map((cable) => (
        <Plug key={cable.key} cable={cable} look={look} />
      ))}
    </svg>
  );
};

const FLIPPED: Record<CableKey, boolean> = {
  leftTop: true,
  leftBottom: true,
  rightTop: false,
  rightBottom: false,
  bottom: false,
};

export const CableLabels = ({
  cables,
  look,
}: {
  cables: readonly DrawnCable[];
  look: CableLook;
}) => (
  <>
    {cables.map((cable) => {
      if (cable.label.trim() === '') {
        return null;
      }
      const { tip, angle, opacity } = cable.state.pose;
      const flipped = FLIPPED[cable.key];
      const textAngle = flipped ? angle : angle + Math.PI;
      const back = { x: tip.x - Math.cos(angle) * 14, y: tip.y - Math.sin(angle) * 14 };
      const up = { x: Math.sin(textAngle), y: -Math.cos(textAngle) };
      const anchor = { x: back.x + up.x * LABEL_GAP, y: back.y + up.y * LABEL_GAP };
      const dot = Math.round(look.labelSize * 0.26);
      return (
        <div
          key={cable.key}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            transformOrigin: '0 0',
            transform: `translate(${anchor.x.toFixed(2)}px, ${anchor.y.toFixed(2)}px) rotate(${(textAngle * DEGREES).toFixed(3)}deg) translate(${flipped ? '-100%' : '0'}, -50%)`,
            display: 'flex',
            alignItems: 'center',
            gap: Math.round(look.labelSize * 0.3),
            whiteSpace: 'nowrap',
            fontFamily: LABEL_FACE.family,
            fontWeight: LABEL_FACE.weight,
            fontSize: look.labelSize,
            lineHeight: 1.2,
            color: look.text,
            opacity,
          }}
        >
          <span
            style={{
              width: dot,
              height: dot,
              borderRadius: dot,
              backgroundColor: mix(look.empty, cable.color, look.tone),
              flexShrink: 0,
            }}
          />
          <span>{cable.label}</span>
        </div>
      );
    })}
  </>
);
