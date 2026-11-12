import { useId } from 'react';
import { lerp } from '../../kit/motion';
import { ChalkFilter } from './chalk-filter';
import { Dust } from './dust';
import type { Face } from './fonts';
import { type BadgeLayout, project, type Sparkle, WIPE } from './layout';
import { Halos, type SparkleDrawing, Stars } from './sparkles';
import type { BadgeState } from './timeline';

type BadgeProps = {
  layout: BadgeLayout;
  state: BadgeState;
  frame: number;
  text: string;
  face: Face;
  chalk: string;
  sparkle: string;
  showSwoosh: boolean;
  showSparkles: boolean;
  thickness: number;
  twinkle: number;
  grain: number;
  dust: number;
  width: number;
  height: number;
};

const UNIT = Math.hypot(WIPE.x, WIPE.y);
const dx = WIPE.x / UNIT;
const dy = WIPE.y / UNIT;

const Wipe = (props: { id: string; edge: number; soft: number; keep: 'before' | 'after' }) => {
  const near = props.keep === 'before' ? '#ffffff' : '#000000';
  const far = props.keep === 'before' ? '#000000' : '#ffffff';
  return (
    <linearGradient
      id={props.id}
      gradientUnits="userSpaceOnUse"
      x1={dx * (props.edge - props.soft)}
      y1={dy * (props.edge - props.soft)}
      x2={dx * props.edge}
      y2={dy * props.edge}
    >
      <stop offset="0" stopColor={near} />
      <stop offset="1" stopColor={far} />
    </linearGradient>
  );
};

export const Badge = (props: BadgeProps) => {
  const id = useId().replace(/:/g, '');
  const { layout, state, width, height } = props;
  const u = layout.size;
  const soft = 0.9 * u;
  const writeEdge = lerp(layout.wordSpan[0], layout.wordSpan[1] + soft, state.write);
  const eraseEdge = lerp(layout.badgeSpan[0], layout.badgeSpan[1] + soft, state.erase);
  const passed = (s: Sparkle) =>
    1 - Math.max(0, Math.min(1, (eraseEdge - project(s.x, s.y) + 0.2 * soft) / (0.6 * soft)));
  const [big, small] = layout.sparkles;
  const twinkle = props.twinkle * state.twinkle;
  const stars: SparkleDrawing[] = props.showSparkles
    ? [
        { sparkle: big, grow: state.sparkles[0] * passed(big), phase: 0 },
        { sparkle: small, grow: state.sparkles[1] * passed(small), phase: Math.PI / 2 },
      ]
    : [];
  return (
    <svg
      aria-hidden="true"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: 'absolute', inset: 0 }}
    >
      <defs>
        <ChalkFilter id={`${id}-chalk`} grain={props.grain} />
        <Wipe id={`${id}-write`} edge={writeEdge} soft={soft} keep="before" />
        <Wipe id={`${id}-erase`} edge={eraseEdge} soft={soft} keep="after" />
        <mask
          id={`${id}-write-mask`}
          maskUnits="userSpaceOnUse"
          x={0}
          y={0}
          width={width}
          height={height}
        >
          <rect width={width} height={height} fill={`url(#${id}-write)`} />
        </mask>
        <mask
          id={`${id}-erase-mask`}
          maskUnits="userSpaceOnUse"
          x={0}
          y={0}
          width={width}
          height={height}
        >
          <rect width={width} height={height} fill={`url(#${id}-erase)`} />
        </mask>
      </defs>
      <g mask={state.erase > 0 ? `url(#${id}-erase-mask)` : undefined}>
        <Halos
          id={`${id}-halo`}
          items={stars}
          frame={props.frame}
          twinkle={twinkle}
          color={props.sparkle}
        />
        <g filter={`url(#${id}-chalk)`}>
          <g mask={state.write < 1 ? `url(#${id}-write-mask)` : undefined}>
            <text
              x={layout.left}
              y={layout.baseline}
              fill={props.chalk}
              style={{ fontFamily: `"${props.face.family}"`, fontWeight: props.face.weight }}
              fontSize={u}
            >
              {props.text}
            </text>
          </g>
          {props.showSwoosh && state.swoosh > 0 ? (
            <path
              d={layout.swoosh}
              pathLength={1}
              fill="none"
              stroke={props.chalk}
              strokeWidth={props.thickness * u}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="1 2"
              strokeDashoffset={1 - state.swoosh}
              opacity={Math.min(1, state.swoosh * 14)}
            />
          ) : null}
          <g fill={props.sparkle}>
            <Stars items={stars} frame={props.frame} twinkle={twinkle} />
          </g>
        </g>
        <Dust
          layout={layout}
          frame={props.frame}
          level={state.dust * props.dust}
          color={props.chalk}
        />
      </g>
    </svg>
  );
};
