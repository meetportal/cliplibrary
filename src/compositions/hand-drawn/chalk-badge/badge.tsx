import { useId } from 'react';
import { lerp } from '../../kit/motion';
import { ChalkFilter } from './chalk-filter';
import { Dust } from './dust';
import { type BadgeLayout, type Point, WIPE } from './layout';
import { SoftStroke } from './soft-stroke';
import { Halos, type SparkleDrawing, Stars } from './sparkles';
import { paced } from './swoosh';
import type { BadgeState } from './timeline';
import type { WordImage } from './word-image';

type BadgeProps = {
  layout: BadgeLayout;
  state: BadgeState;
  frame: number;
  word: WordImage | null;
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
  focus: Point;
  scale: number;
};

const UNIT = Math.hypot(WIPE.x, WIPE.y);
const MIN_WRITE_SOFT = 150;
const MIN_ERASE_SOFT = 220;
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
  const soft = Math.max(0.9 * u, MIN_WRITE_SOFT);
  const writeEdge = lerp(layout.wordSpan[0] + soft, layout.wordSpan[1] + soft, state.write);
  const eraseSoft = Math.max(1.3 * u, MIN_ERASE_SOFT);
  const eraseEdge = lerp(layout.wordSpan[0], layout.wordSpan[1] + eraseSoft, state.erase);
  const [big, small] = layout.sparkles;
  const twinkle = props.twinkle * state.twinkle;
  const shrink = 1 - state.sparkleErase;
  const stars: SparkleDrawing[] = props.showSparkles
    ? [
        { sparkle: big, grow: state.sparkles[0] * shrink, phase: 0 },
        { sparkle: small, grow: state.sparkles[1] * shrink, phase: Math.PI / 2 },
      ]
    : [];
  const { x: fx, y: fy } = props.focus;
  const push = `translate(${fx.toFixed(2)} ${fy.toFixed(2)}) scale(${props.scale.toFixed(6)}) translate(${(-fx).toFixed(2)} ${(-fy).toFixed(2)})`;
  const erased = state.erase > 0 ? `url(#${id}-erase-mask)` : undefined;
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
        <Wipe id={`${id}-erase`} edge={eraseEdge} soft={eraseSoft} keep="after" />
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
      <g transform={push}>
        <Halos
          id={`${id}-halo`}
          items={stars}
          frame={props.frame}
          twinkle={twinkle}
          color={props.sparkle}
        />
      </g>
      <g filter={`url(#${id}-chalk)`}>
        <g transform={push}>
          <g mask={erased}>
            <g mask={state.write < 1 ? `url(#${id}-write-mask)` : undefined}>
              {props.word === null ? null : (
                <image
                  href={props.word.href}
                  x={props.word.x}
                  y={props.word.y}
                  width={props.word.w}
                  height={props.word.h}
                  preserveAspectRatio="none"
                />
              )}
            </g>
          </g>
          {props.showSwoosh ? (
            <SoftStroke
              d={layout.swoosh.d}
              drawn={paced(layout.swoosh.pace, state.swoosh)}
              undrawn={state.swooshErase}
              soft={layout.swoosh.soft}
              color={props.chalk}
              width={props.thickness * u}
            />
          ) : null}
          <g fill={props.sparkle}>
            <Stars items={stars} frame={props.frame} twinkle={twinkle} />
          </g>
        </g>
      </g>
      <g transform={push}>
        <g mask={erased}>
          <Dust
            layout={layout}
            frame={props.frame}
            level={state.dust * props.dust}
            color={props.chalk}
          />
        </g>
      </g>
    </svg>
  );
};
