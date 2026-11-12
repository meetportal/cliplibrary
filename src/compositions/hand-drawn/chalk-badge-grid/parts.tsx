import type { ReactNode } from 'react';
import { lerp } from '../../kit/motion';
import { FACES, type FaceKey, type Measure } from './fonts';
import type { BadgeState } from './timeline';

export type GridPalette = {
  chalk: string;
  primary: string;
  primaryInk: string;
  warm: string;
  pink: string;
  secondary: string;
  secondaryInk: string;
  accent: string;
  accentLine: string;
  accentInk: string;
  accentShade: string;
  highlight: string;
  plate: string;
};

export type BadgeKit = {
  id: string;
  frame: number;
  state: BadgeState;
  text: string;
  palette: GridPalette;
  measure: Measure;
  ornaments: boolean;
  twinkle: number;
};

export type Fit = { size: number; width: number };

export const fitText = (
  kit: BadgeKit,
  face: FaceKey,
  base: number,
  maxWidth: number,
  tracking = 0,
): Fit => {
  const unit = Math.max(0.01, kit.measure(kit.text, face, tracking));
  const size = Math.min(base, maxWidth / unit);
  return { size, width: unit * size };
};

const WipeMask = (props: {
  id: string;
  left: number;
  right: number;
  top: number;
  height: number;
  edge: number;
  soft: number;
  keepBefore: boolean;
  children: ReactNode;
}) => {
  const near = props.keepBefore ? '#ffffff' : '#000000';
  const far = props.keepBefore ? '#000000' : '#ffffff';
  const x = props.left - props.soft * 2;
  const width = props.right - props.left + props.soft * 4;
  return (
    <>
      <defs>
        <linearGradient
          id={`${props.id}-g`}
          gradientUnits="userSpaceOnUse"
          x1={props.edge - props.soft}
          y1={0}
          x2={props.edge}
          y2={0}
        >
          <stop offset="0" stopColor={near} />
          <stop offset="1" stopColor={far} />
        </linearGradient>
        <mask
          id={props.id}
          maskUnits="userSpaceOnUse"
          x={x}
          y={props.top}
          width={width}
          height={props.height}
        >
          <rect
            x={x}
            y={props.top}
            width={width}
            height={props.height}
            fill={`url(#${props.id}-g)`}
          />
        </mask>
      </defs>
      <g mask={`url(#${props.id})`}>{props.children}</g>
    </>
  );
};

export const WipeText = (props: {
  kit: BadgeKit;
  name: string;
  face: FaceKey;
  fit: Fit;
  x?: number;
  y?: number;
  fill: string;
  tracking?: number;
}) => {
  const { kit, fit } = props;
  const x = props.x ?? 0;
  const y = props.y ?? 0;
  const face = FACES[props.face];
  const soft = fit.size * 0.45;
  const left = x - fit.width / 2;
  const right = x + fit.width / 2;
  const top = y - fit.size * 1.2;
  const height = fit.size * 1.8;
  const { write, unwrite } = kit.state;
  if (write <= 0 || unwrite >= 1) {
    return null;
  }
  const body = (
    <text
      x={x + ((props.tracking ?? 0) * fit.size) / 2}
      y={y}
      textAnchor="middle"
      fill={props.fill}
      fontSize={fit.size}
      letterSpacing={props.tracking === undefined ? undefined : `${props.tracking}em`}
      style={{ fontFamily: `"${face.family}"`, fontWeight: face.weight }}
    >
      {kit.text}
    </text>
  );
  const written =
    write < 1 ? (
      <WipeMask
        id={`${kit.id}-${props.name}-w`}
        left={left}
        right={right}
        top={top}
        height={height}
        edge={lerp(left, right + soft, write)}
        soft={soft}
        keepBefore
      >
        {body}
      </WipeMask>
    ) : (
      body
    );
  if (unwrite <= 0) {
    return written;
  }
  return (
    <WipeMask
      id={`${kit.id}-${props.name}-e`}
      left={left}
      right={right}
      top={top}
      height={height}
      edge={lerp(left, right + soft, unwrite)}
      soft={soft}
      keepBefore={false}
    >
      {written}
    </WipeMask>
  );
};

export const Stroke = (props: {
  d: string;
  amount: number;
  color: string;
  width: number;
  opacity?: number;
}) => {
  if (props.amount <= 0.002) {
    return null;
  }
  return (
    <path
      d={props.d}
      pathLength={1}
      fill="none"
      stroke={props.color}
      strokeWidth={props.width}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="1 2"
      strokeDashoffset={1 - Math.min(1, props.amount)}
      opacity={Math.min(1, props.amount * 10) * (props.opacity ?? 1)}
    />
  );
};

const starPath = (r: number) => {
  const k = 0.18 * r;
  return `M 0 ${-r} Q ${k} ${-k} ${r} 0 Q ${k} ${k} 0 ${r} Q ${-k} ${k} ${-r} 0 Q ${-k} ${-k} 0 ${-r} Z`;
};

export const Sparkle = (props: {
  kit: BadgeKit;
  x: number;
  y: number;
  r: number;
  color: string;
  phase: number;
}) => {
  const { kit } = props;
  if (!kit.ornaments) {
    return null;
  }
  const wave = Math.sin((2 * Math.PI * kit.frame) / 42 + props.phase);
  const scale = kit.state.ornament * (1 + 0.22 * kit.twinkle * kit.state.live * wave);
  if (scale <= 0.002) {
    return null;
  }
  const turn =
    14 * kit.twinkle * kit.state.live * Math.sin((2 * Math.PI * kit.frame) / 105 + props.phase);
  return (
    <path
      d={starPath(props.r)}
      fill={props.color}
      transform={`translate(${props.x} ${props.y}) rotate(${turn.toFixed(3)}) scale(${scale.toFixed(4)})`}
    />
  );
};

export const breathe = (kit: BadgeKit, period: number, phase: number) =>
  kit.twinkle * kit.state.live * Math.sin((2 * Math.PI * kit.frame) / period + phase);
