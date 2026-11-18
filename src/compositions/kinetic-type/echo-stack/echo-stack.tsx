import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useCurrentScale,
  useRemotionEnvironment,
  useVideoConfig,
} from 'remotion';
import type { EchoStackProps } from '@/schemas';
import { Backdrop } from './backdrop';
import { type Face, LINE_FACES, type LineMetrics, useLineMetrics } from './fonts';
import { buildPalette } from './palette';
import { drawBand, drawSprite, lineBox, makeSprite, prepareCanvas } from './sprite';
import { buildPlan, driftAt, echoState, heroScale } from './timeline';

const SIDE_MARGIN = 60;
const BAND_SIDES = 1.6;
const CLEARANCE = 0.1;
const OVERSAMPLE = 2;
const MAX_RATIO = 2;
const MIN_RATIO = 0.5;
const NARROW_BAND = 0.7;
const SHORTEST_END = 0.4;

const useBackingRatio = () => {
  const { isClientSideRendering } = useRemotionEnvironment();
  const scale = useCurrentScale({ dontThrowIfOutsideOfRemotion: true });
  const device = typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1;
  const output = isClientSideRendering ? 1 : scale * device;
  return Math.min(MAX_RATIO, Math.max(MIN_RATIO, output * OVERSAMPLE));
};

type Fitted = { size: number; pitch: number; padY: number; padX: number };

const fitLine = (props: EchoStackProps, metrics: LineMetrics, frameWidth: number): Fitted => {
  const padding = props.band.show ? props.band.padding : 0;
  const room = Math.min(props.type.maxWidth, frameWidth - 2 * SIDE_MARGIN);
  const perSize = metrics.width + 2 * BAND_SIDES * padding;
  const size = perSize > 0 ? Math.min(props.type.size, room / perSize) : props.type.size;
  return {
    size,
    pitch: props.stack.spacing * Math.sqrt(size * props.type.size),
    padY: padding * size,
    padX: BAND_SIDES * padding * size,
  };
};

const blurFilter = (blur: number, ratio: number) =>
  blur > 0.05 ? `blur(${(blur * ratio).toFixed(2)}px)` : 'none';

export const EchoStack = (props: EchoStackProps) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const ref = useRef<HTMLCanvasElement>(null);
  const ratio = useBackingRatio();
  const palette = useMemo(() => buildPalette(props.colors), [props.colors]);
  const face: Face = LINE_FACES[props.type.font];
  const tracking = props.type.tracking;
  const text = props.type.caps ? props.line.trim().toUpperCase() : props.line.trim();
  const metrics = useLineMetrics(text, face, tracking);
  const lines = Math.max(1, Math.round(props.stack.lines));
  const fitted = fitLine(props, metrics, width);
  const size = fitted.size;
  const box = useMemo(
    () => lineBox(metrics, size, props.motion.exitBlur),
    [metrics, size, props.motion.exitBlur],
  );
  const heroInk = props.band.show ? palette.bandInk : palette.heroText;
  const echoSprite = useMemo(
    () =>
      text === ''
        ? null
        : makeSprite({ text, face, size, tracking, metrics, box, color: palette.text, ratio }),
    [text, face, size, tracking, metrics, box, palette.text, ratio],
  );
  const heroSprite = useMemo(
    () =>
      text === ''
        ? null
        : makeSprite({ text, face, size, tracking, metrics, box, color: heroInk, ratio }),
    [text, face, size, tracking, metrics, box, heroInk, ratio],
  );
  useEffect(() => {
    const canvas = ref.current;
    return () => {
      if (canvas !== null) {
        canvas.width = 0;
        canvas.height = 0;
      }
    };
  }, []);
  const inkHalf = ((metrics.ascent + metrics.descent) / 2) * size;
  const bandWidth = metrics.width * size + 2 * fitted.padX;
  const bandHeight = 2 * inkHalf + 2 * fitted.padY;
  const endShare = Math.min(1, Math.max(SHORTEST_END, bandWidth / (NARROW_BAND * width)));
  const plan = useMemo(
    () => buildPlan(lines, props.motion, durationInFrames, endShare),
    [lines, props.motion, durationInFrames, endShare],
  );
  const heroReach = (bandHeight / 2) * (1 + props.band.pulse) + CLEARANCE * size;
  const centerY = height / 2 + driftAt(frame, plan, props.motion.drift);
  const lineY = (at: number) => centerY + (at - plan.hero) * fitted.pitch;
  const room = (at: number) =>
    at < plan.hero
      ? Math.max(0, (plan.hero - at) * fitted.pitch - inkHalf - heroReach)
      : Number.POSITIVE_INFINITY;
  const echoes = plan.enter
    .map((_, at) => ({ at, state: echoState(frame, at, plan, props.motion, room(at)) }))
    .filter((echo) => echo.at !== plan.hero && echo.state.visible);
  const scale = heroScale(frame, plan, props.motion, props.band);
  useLayoutEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext('2d');
    if (!(canvas && context)) {
      return;
    }
    prepareCanvas(canvas, context, width, height, ratio);
    if (echoSprite !== null) {
      for (const { at, state } of echoes) {
        context.globalAlpha = state.opacity * props.stack.echoOpacity;
        context.filter = blurFilter(state.blur, ratio);
        drawSprite(context, echoSprite, width / 2, lineY(at) + state.shift, inkHalf);
      }
    }
    context.globalAlpha = 1;
    context.filter = 'none';
    if (heroSprite === null) {
      return;
    }
    context.save();
    context.translate(width / 2, lineY(plan.hero));
    context.scale(scale, scale);
    if (props.band.show) {
      drawBand(context, bandWidth, bandHeight, props.band.radius, palette.band);
    }
    drawSprite(context, heroSprite, 0, 0, inkHalf);
    context.restore();
  });
  return (
    <AbsoluteFill>
      {props.showBackground ? (
        <Backdrop
          center={palette.background}
          edge={palette.backgroundEdge}
          width={width}
          height={height}
        />
      ) : null}
      <canvas
        ref={ref}
        aria-label={text}
        style={{ position: 'absolute', left: 0, top: 0, width, height }}
      />
    </AbsoluteFill>
  );
};
