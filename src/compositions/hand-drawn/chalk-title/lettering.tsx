import { useId } from 'react';
import { useCurrentScale, useRemotionEnvironment } from 'remotion';
import { clamp01, lerp } from '../../kit/motion';
import { ChalkGrain, ChalkRough, chalkCoverage, type Region } from './chalk-filter';
import { AirDust, type Stroke, TipDust } from './dust';
import type { Face } from './fonts';
import { GRAIN_TILE } from './grain-tile';
import { type Piece, project, type TitleLayout } from './layout';
import { phaseBlur } from './phase-blur';
import { Halos, type SparkleDrawing, Stars } from './sparkles';
import {
  AMP_SOFT,
  type Edges,
  faceStyle,
  grow,
  Ink,
  PAD,
  softOf,
  WipeDefs,
  WORD_SOFT,
  type Written,
  writeEdge,
} from './wipes';

export type LetteringState = {
  start: number;
  amp: number;
  end: number;
  byline: number;
  rise: { start: number; amp: number; end: number; byline: number };
  sparkles: number[];
  twinkle: number;
  erase: number;
  smear: number;
  tipDust: number;
  airDust: number;
  drift: { x: number; y: number };
  smearAt: { x: number; y: number };
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

const EDGE_MARGIN = 120;
const STAR_REGION = { x: -200, y: -200, width: 400, height: 400 };

export const Lettering = (props: LetteringProps) => {
  const id = useId().replace(/:/g, '');
  const { layout, state, width, height } = props;
  const { start, amp, end, byline } = layout;
  const softs = {
    start: softOf(start, WORD_SOFT),
    amp: softOf(amp, AMP_SOFT),
    end: softOf(end, WORD_SOFT),
    byline: byline === null ? 1 : softOf(byline, 2.4),
    erase: Math.max(2.2 * layout.wordSize + 150, 0.4 * (layout.all[1] - layout.all[0])),
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
  const title = (piece: Piece, face: Face, fill: string) => (
    <text x={piece.x} y={piece.baseline} fontSize={piece.size} fill={fill} style={faceStyle(face)}>
      {piece.text}
    </text>
  );
  const write = (piece: Piece, soft: number, done: number) => ({
    edge: writeEdge(piece, soft, done),
    soft,
    keep: 'before' as const,
  });
  const smearEdge = { edge: eraseEdge, soft: softs.erase, keep: 'after' as const };
  const edges: Edges = {
    start: write(start, softs.start, state.start),
    amp: write(amp, softs.amp, state.amp),
    end: write(end, softs.end, state.end),
    ...(byline === null ? {} : { byline: write(byline, softs.byline, state.byline) }),
    erase: { edge: eraseEdge, soft: softs.erase, keep: 'before' },
  };
  const drop = 0.032 * amp.size;
  const smearBlur = `${(0.11 * layout.wordSize).toFixed(1)} ${(0.05 * layout.wordSize).toFixed(1)}`;
  const area = {
    x0: start.box.x0,
    x1: end.box.x1,
    y0: amp.box.y0 - 0.3 * amp.size,
    y1: Math.max(start.box.y1, end.box.y1, amp.box.y1),
  };
  const wide = { x: -PAD, y: -PAD, width: width + 2 * PAD, height: height + 2 * PAD };
  const grain = `${id}-grain-wide`;
  const pieces: Written[] = [
    {
      name: 'start',
      rough: `${id}-rough-start`,
      done: state.start,
      transform: grow(start, state.rise.start, 0.1, 0.94, 'left'),
      grain,
      content: title(start, props.script, props.chalk),
    },
    {
      name: 'amp',
      rough: `${id}-rough-amp`,
      done: state.amp,
      transform: grow(amp, state.rise.amp, 0.05, 0.88, 'center'),
      grain,
      content: (
        <>
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
        </>
      ),
    },
    {
      name: 'end',
      rough: `${id}-rough-end`,
      done: state.end,
      transform: grow(end, state.rise.end, 0.1, 0.94, 'left'),
      grain,
      content: title(end, props.script, props.chalk),
    },
    ...(byline === null
      ? []
      : [
          {
            name: 'byline',
            rough: `${id}-rough-byline`,
            done: state.byline,
            transform: grow(byline, state.rise.byline, 0.7, 1, 'center'),
            grain: `${id}-fine-wide`,
            content: (
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
            ),
          },
        ]),
  ];
  const sheet = {
    width,
    height,
    viewBox: `0 0 ${width} ${height}`,
    style: { position: 'absolute', inset: 0 },
  } as const;
  const { isClientSideRendering } = useRemotionEnvironment();
  const scale = useCurrentScale({ dontThrowIfOutsideOfRemotion: true });
  const device = typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1;
  const ratio = isClientSideRendering ? 1 : scale * device;
  const soften = phaseBlur(
    { x: Number(state.drift.x.toFixed(3)), y: Number(state.drift.y.toFixed(3)) },
    ratio,
  );
  const tile = GRAIN_TILE / Math.sqrt(ratio);
  const layer = {
    transform: `translate(${state.drift.x.toFixed(3)}px, ${state.drift.y.toFixed(3)}px)${ratio >= 1 && !isClientSideRendering ? ' rotate(0.001deg)' : ''}`,
    willChange: 'transform',
    filter: 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.32))',
  };
  const around = (box: Piece['box'], margin: number): Region => ({
    x: box.x0 - margin,
    y: box.y0 - margin,
    width: box.x1 - box.x0 + 2 * margin,
    height: box.y1 - box.y0 + 2 * margin,
  });
  const starBox = layout.sparkles.reduce(
    (box, s) => ({
      x0: Math.min(box.x0, s.x - 2 * s.r),
      y0: Math.min(box.y0, s.y - 2 * s.r),
      x1: Math.max(box.x1, s.x + 2 * s.r),
      y1: Math.max(box.y1, s.y + 2 * s.r),
    }),
    { x0: amp.box.x0, y0: amp.box.y0, x1: amp.box.x1, y1: amp.box.y0 },
  );
  const roughness = 3 + 3 * props.grain;
  const live = state.erase < 1;
  const ghost = `translate(${state.smearAt.x.toFixed(3)} ${state.smearAt.y.toFixed(3)})`;
  return (
    <>
      {state.smear > 0 ? (
        <svg aria-hidden="true" {...sheet}>
          <defs>
            <filter id={`${id}-smear-blur`} x="-20%" y="-40%" width="140%" height="180%">
              <feGaussianBlur stdDeviation={smearBlur} />
            </filter>
            <WipeDefs
              prefix={`${id}-ghost`}
              edges={{ smear: smearEdge }}
              width={width}
              height={height}
            />
          </defs>
          <g
            transform={ghost}
            opacity={state.smear.toFixed(4)}
            mask={state.erase > 0 && live ? `url(#${id}-ghost-smear)` : undefined}
          >
            <g filter={`url(#${id}-smear-blur)`}>
              {title(start, props.script, props.chalk)}
              {title(amp, props.ampFace, props.chalk)}
              {title(end, props.script, props.chalk)}
            </g>
          </g>
        </svg>
      ) : null}
      <div style={{ position: 'absolute', inset: 0, ...layer }}>
        <svg aria-hidden="true" {...sheet}>
          <defs>
            <ChalkGrain
              id={`${id}-grain`}
              coverage={chalkCoverage(props.grain)}
              tile={tile}
              regions={{ wide, star: STAR_REGION }}
            />
            <ChalkGrain
              id={`${id}-fine`}
              coverage={chalkCoverage(0.45 * props.grain)}
              tile={tile}
              regions={{ wide }}
            />
            <WipeDefs prefix={id} edges={edges} width={width} height={height} />
            {(['start', 'amp', 'end'] as const).map((name) => (
              <ChalkRough
                key={name}
                id={`${id}-rough-${name}`}
                scale={roughness}
                soften={soften}
                region={around(layout[name].box, 0.3 * layout[name].size)}
              />
            ))}
            {byline === null ? null : (
              <ChalkRough
                id={`${id}-rough-byline`}
                scale={3 + 1.35 * props.grain}
                soften={soften}
                region={around(byline.box, 0.6 * byline.size)}
              />
            )}
            <ChalkRough
              id={`${id}-rough-stars`}
              scale={roughness}
              soften={soften}
              region={around(starBox, 20)}
            />
          </defs>
          {live ? (
            <g>
              <g mask={`url(#${id}-erase)`}>
                <Halos
                  id={`${id}-halo`}
                  items={stars}
                  frame={props.frame}
                  twinkle={state.twinkle}
                  color={props.sparkle}
                />
                {pieces.map((piece) => (
                  <Ink key={piece.name} piece={piece} prefix={id} />
                ))}
                <g fill={props.sparkle} filter={`url(#${id}-rough-stars)`}>
                  <Stars
                    items={stars}
                    frame={props.frame}
                    twinkle={state.twinkle}
                    mask={`url(#${id}-grain-star)`}
                  />
                </g>
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
            </g>
          ) : null}
        </svg>
      </div>
    </>
  );
};
