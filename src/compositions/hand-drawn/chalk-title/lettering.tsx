import type { CSSProperties, ReactNode } from 'react';
import { useId } from 'react';
import { clamp01, lerp } from '../../kit/motion';
import { ChalkFilter } from './chalk-filter';
import { AirDust, type Stroke, TipDust } from './dust';
import type { Face } from './fonts';
import { type Piece, project, type TitleLayout, WIPE } from './layout';
import { Halos, type SparkleDrawing, Stars } from './sparkles';

const UNIT = Math.hypot(WIPE.x, WIPE.y);
const dx = WIPE.x / UNIT;
const dy = WIPE.y / UNIT;

export type LetteringState = {
  start: number;
  amp: number;
  end: number;
  byline: number;
  sparkles: number[];
  twinkle: number;
  erase: number;
  smear: number;
  tipDust: number;
  airDust: number;
};

type LetteringProps = {
  layout: TitleLayout;
  state: LetteringState;
  strokes: Stroke[];
  frame: number;
  duration: number;
  script: Face;
  ampFace: Face;
  bylineFace: Face;
  tracking: number;
  chalk: string;
  sparkle: string;
  dropLine: boolean;
  grain: number;
  width: number;
  height: number;
};

export const WORD_SOFT = 1.3;
export const AMP_SOFT = 0.45;
const EDGE_MARGIN = 120;
const WRITE_MARGIN = 40;

export const softOf = (piece: Piece, share: number) =>
  Math.max(share * piece.size, 0.25 * (piece.span[1] - piece.span[0]));

export const writeEdge = (piece: Piece, soft: number, done: number) =>
  lerp(piece.span[0], piece.span[1] + soft + WRITE_MARGIN, done);

const Wipe = (props: { id: string; edge: number; soft: number; keep: 'before' | 'after' }) => (
  <linearGradient
    id={props.id}
    gradientUnits="userSpaceOnUse"
    x1={dx * (props.edge - props.soft)}
    y1={dy * (props.edge - props.soft)}
    x2={dx * props.edge}
    y2={dy * props.edge}
  >
    <stop offset="0" stopColor={props.keep === 'before' ? '#ffffff' : '#000000'} />
    <stop offset="1" stopColor={props.keep === 'before' ? '#000000' : '#ffffff'} />
  </linearGradient>
);

const Mask = (props: { id: string; width: number; height: number }) => (
  <mask
    id={props.id}
    maskUnits="userSpaceOnUse"
    x={0}
    y={0}
    width={props.width}
    height={props.height}
  >
    <rect width={props.width} height={props.height} fill={`url(#${props.id}-g)`} />
  </mask>
);

const faceStyle = (face: Face): CSSProperties => ({
  fontFamily: `"${face.family}"`,
  fontWeight: face.weight,
  fontStyle: face.style,
});

const Masked = (props: { id: string; done: number; children: ReactNode }) =>
  props.done <= 0 ? null : <g mask={`url(#${props.id})`}>{props.children}</g>;

export const Lettering = (props: LetteringProps) => {
  const id = useId().replace(/:/g, '');
  const { layout, state, width, height } = props;
  const { start, amp, end, byline } = layout;
  const softs = {
    start: softOf(start, WORD_SOFT),
    amp: softOf(amp, AMP_SOFT),
    end: softOf(end, WORD_SOFT),
    byline: byline === null ? 1 : softOf(byline, 2.4),
    erase: Math.max(2.2 * layout.wordSize + 150, 0.3 * (layout.all[1] - layout.all[0])),
  };
  const eraseEdge = lerp(
    layout.all[1] + EDGE_MARGIN + softs.erase,
    layout.all[0] - EDGE_MARGIN,
    state.erase,
  );
  const kept = (x: number, y: number) =>
    clamp01((eraseEdge - project(x, y) - 0.1 * softs.erase) / (1.3 * softs.erase));
  const stars: SparkleDrawing[] = layout.sparkles.map((sparkle, index) => ({
    sparkle,
    grow: (state.sparkles[index] ?? 0) * kept(sparkle.x, sparkle.y),
    phase: index * 2.1,
  }));
  const twinkle = state.twinkle;
  const title = (piece: Piece, face: Face, fill: string) => (
    <text x={piece.x} y={piece.baseline} fontSize={piece.size} fill={fill} style={faceStyle(face)}>
      {piece.text}
    </text>
  );
  const drop = 0.032 * amp.size;
  const smearBlur = `${(0.11 * layout.wordSize).toFixed(1)} ${(0.05 * layout.wordSize).toFixed(1)}`;
  const area = {
    x0: start.box.x0,
    x1: end.box.x1,
    y0: amp.box.y0 - 0.3 * amp.size,
    y1: Math.max(start.box.y1, end.box.y1, amp.box.y1),
  };
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
        <ChalkFilter id={`${id}-fine`} grain={0.45 * props.grain} />
        <filter id={`${id}-smear`} x="-20%" y="-40%" width="140%" height="180%">
          <feGaussianBlur stdDeviation={smearBlur} />
        </filter>
        <Wipe
          id={`${id}-start-g`}
          edge={writeEdge(start, softs.start, state.start)}
          soft={softs.start}
          keep="before"
        />
        <Wipe
          id={`${id}-amp-g`}
          edge={writeEdge(amp, softs.amp, state.amp)}
          soft={softs.amp}
          keep="before"
        />
        <Wipe
          id={`${id}-end-g`}
          edge={writeEdge(end, softs.end, state.end)}
          soft={softs.end}
          keep="before"
        />
        {byline === null ? null : (
          <Wipe
            id={`${id}-byline-g`}
            edge={writeEdge(byline, softs.byline, state.byline)}
            soft={softs.byline}
            keep="before"
          />
        )}
        <Wipe id={`${id}-erase-g`} edge={eraseEdge} soft={softs.erase} keep="before" />
        <Wipe id={`${id}-smear-g`} edge={eraseEdge} soft={softs.erase} keep="after" />
        {['start', 'amp', 'end', 'byline', 'erase', 'smear'].map((name) => (
          <Mask key={name} id={`${id}-${name}`} width={width} height={height} />
        ))}
      </defs>
      {state.smear > 0 ? (
        <g
          opacity={state.smear.toFixed(4)}
          mask={state.erase > 0 && state.erase < 1 ? `url(#${id}-smear)` : undefined}
        >
          <g filter={`url(#${id}-smear)`}>
            {title(start, props.script, props.chalk)}
            {title(amp, props.ampFace, props.chalk)}
            {title(end, props.script, props.chalk)}
          </g>
        </g>
      ) : null}
      {state.erase >= 1 ? null : (
        <g mask={`url(#${id}-erase)`}>
          <Halos
            id={`${id}-halo`}
            items={stars}
            frame={props.frame}
            twinkle={twinkle}
            color={props.sparkle}
          />
          <g filter={`url(#${id}-chalk)`}>
            <Masked id={`${id}-start`} done={state.start}>
              {title(start, props.script, props.chalk)}
            </Masked>
            <Masked id={`${id}-amp`} done={state.amp}>
              {props.dropLine ? (
                <text
                  x={amp.x + drop}
                  y={amp.baseline + drop}
                  fontSize={amp.size}
                  fill="none"
                  stroke={props.sparkle}
                  strokeWidth={0.01 * amp.size}
                  style={faceStyle(props.ampFace)}
                >
                  &amp;
                </text>
              ) : null}
              {title(amp, props.ampFace, props.chalk)}
            </Masked>
            <Masked id={`${id}-end`} done={state.end}>
              {title(end, props.script, props.chalk)}
            </Masked>
            <g fill={props.sparkle}>
              <Stars items={stars} frame={props.frame} twinkle={twinkle} />
            </g>
          </g>
          {byline === null ? null : (
            <g filter={`url(#${id}-fine)`}>
              <Masked id={`${id}-byline`} done={state.byline}>
                <text
                  x={byline.x}
                  y={byline.baseline}
                  fontSize={byline.size}
                  fill={props.chalk}
                  letterSpacing={props.tracking * byline.size}
                  style={faceStyle(props.bylineFace)}
                >
                  {byline.text}
                </text>
              </Masked>
            </g>
          )}
          <TipDust
            strokes={props.strokes}
            frame={props.frame}
            level={state.tipDust}
            color={props.chalk}
          />
          <AirDust
            area={area}
            frame={props.frame}
            level={state.airDust}
            color={props.chalk}
            duration={props.duration}
          />
        </g>
      )}
    </svg>
  );
};
