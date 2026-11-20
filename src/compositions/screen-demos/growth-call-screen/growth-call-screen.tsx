import { useLayoutEffect, useMemo, useRef } from 'react';
import { AbsoluteFill, useCurrentFrame, useCurrentScale, useRemotionEnvironment } from 'remotion';
import type { GrowthCallScreenProps } from '@/schemas';
import { type BackdropLayer, backdropLayer, drawPlate, drawRipples, drawRun } from './draw-caller';
import {
  drawActions,
  drawBar,
  drawFill,
  drawGloss,
  drawKnob,
  drawKnobPulse,
  drawSlideLabel,
} from './draw-controls';
import { useCallFonts } from './fonts';
import { buildLayout, FRAME, type Layout } from './layout';
import { buildPalette, type Palette } from './palette';
import {
  answered,
  buildTimeline,
  ENTRANCE,
  glossAt,
  progress,
  RISE,
  type Span,
  settle,
  shimmerAt,
  type Timeline,
} from './timeline';
import { type LogoImage, useLogoImage } from './use-logo-image';

const MIN_RATIO = 0.5;
const MAX_RATIO = 2;
const PLATE_GROW = 0.1;
const CALM_AFTER_ANSWER = 0.2;
const CALM_PULSE = 0.4;
const DEFAULT_GLOW_Y = 420;

const useBackingRatio = () => {
  const { isClientSideRendering } = useRemotionEnvironment();
  const scale = useCurrentScale({ dontThrowIfOutsideOfRemotion: true });
  const device = typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1;
  const output = isClientSideRendering ? 1 : scale * device;
  return Math.min(MAX_RATIO, Math.max(MIN_RATIO, output));
};

const arrive = (frame: number, span: Span, rise: number) => {
  const t = progress(frame, span);
  return { alpha: 0.5 - 0.5 * Math.cos(Math.PI * t), dy: (1 - settle(t)) * rise };
};

type Paint = {
  frame: number;
  props: GrowthCallScreenProps;
  layout: Layout;
  palette: Palette;
  logo: LogoImage;
  line: Timeline;
  ratio: number;
  backdrop: BackdropLayer | null;
};

const paintCaller = (context: CanvasRenderingContext2D, paint: Paint, answer: number) => {
  const { frame, props, layout, palette, logo, line } = paint;
  const plate = layout.plate;
  if (plate !== null) {
    const shown = arrive(frame, ENTRANCE.plate, 0);
    drawRipples(
      context,
      plate,
      palette,
      {
        frame,
        start: line.rippleStart,
        every: line.every,
        count: Math.round(props.caller.ripples),
      },
      props.caller.rippleReach,
      shown.alpha * (1 - CALM_AFTER_ANSWER * answer),
    );
    drawPlate(context, plate, logo, palette, {
      alpha: shown.alpha,
      scale: 1 - PLATE_GROW + PLATE_GROW * settle(progress(frame, ENTRANCE.plate)),
      backing: props.caller.plate,
    });
  }
  const name = arrive(frame, ENTRANCE.name, RISE.name);
  drawRun(context, layout.name, palette.muted, name.alpha, name.dy);
  const lead = arrive(frame, ENTRANCE.lead, RISE.lines);
  drawRun(context, layout.lead, palette.lines, lead.alpha, lead.dy);
  const headline = arrive(frame, ENTRANCE.headline, RISE.lines);
  for (const run of layout.headline) {
    drawRun(context, run, palette.highlight, headline.alpha, headline.dy);
  }
  const trail = arrive(frame, ENTRANCE.trail, RISE.lines);
  drawRun(context, layout.trail, palette.lines, trail.alpha, trail.dy);
};

const paintBar = (context: CanvasRenderingContext2D, paint: Paint, answer: number) => {
  const { frame, props, layout, palette, line, ratio } = paint;
  const actions = arrive(frame, ENTRANCE.actions, RISE.actions);
  drawActions(context, layout, palette, actions.alpha, actions.dy);
  const bar = arrive(frame, ENTRANCE.bar, RISE.bar);
  if (bar.alpha <= 0) {
    return;
  }
  context.save();
  context.globalAlpha = bar.alpha;
  context.translate(0, bar.dy);
  drawBar(context, layout, palette);
  drawFill(context, layout, palette, answer);
  drawGloss(context, layout, palette, glossAt(frame, line));
  const site = line.website === null ? 0 : progress(frame, line.website);
  drawRun(
    context,
    layout.website,
    palette.websiteInk,
    0.5 - 0.5 * Math.cos(Math.PI * site),
    (1 - settle(site)) * RISE.website,
  );
  drawKnobPulse(context, layout, palette, {
    frame,
    every: line.every,
    strength: 1 - CALM_PULSE * answer,
    answered: answer,
  });
  drawSlideLabel(context, layout.slide, palette, {
    alpha: Math.max(0, 1 - answer * 2.5),
    shimmer: shimmerAt(frame, line),
    width: props.shimmer.width,
    ratio,
  });
  drawKnob(context, layout, palette, answer);
  context.restore();
};

const paintFrame = (context: CanvasRenderingContext2D, paint: Paint) => {
  context.setTransform(paint.ratio, 0, 0, paint.ratio, 0, 0);
  context.clearRect(0, 0, FRAME.width, FRAME.height);
  if (paint.backdrop !== null) {
    context.drawImage(paint.backdrop.canvas, 0, 0, FRAME.width, FRAME.height);
  }
  const answer = answered(paint.frame, paint.line);
  paintCaller(context, paint, answer);
  paintBar(context, paint, answer);
};

export const GrowthCallScreen = (props: GrowthCallScreenProps) => {
  const frame = useCurrentFrame();
  const ref = useRef<HTMLCanvasElement>(null);
  const backdropRef = useRef<BackdropLayer | undefined>(undefined);
  const ratio = useBackingRatio();
  const faces = useCallFonts(props.type.font);
  const logo = useLogoImage(props.logo);
  const palette = useMemo(() => buildPalette(props.colors), [props.colors]);
  const layout = useMemo(
    () => (faces === null ? null : buildLayout(props, faces, logo?.box ?? null)),
    [props, faces, logo],
  );
  const line = useMemo(() => buildTimeline(props), [props]);
  useLayoutEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext('2d');
    if (!(canvas && context && layout)) {
      return;
    }
    const width = Math.round(FRAME.width * ratio);
    const height = Math.round(FRAME.height * ratio);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    const glowY = layout.plate === null ? DEFAULT_GLOW_Y : layout.plate.y + layout.plate.h / 2;
    const backdrop = props.showBackground
      ? backdropLayer(palette, props.glow, glowY, ratio, backdropRef.current)
      : null;
    backdropRef.current = backdrop ?? backdropRef.current;
    paintFrame(context, { frame, props, layout, palette, logo, line, ratio, backdrop });
  });
  return (
    <AbsoluteFill>
      <canvas ref={ref} style={{ width: FRAME.width, height: FRAME.height, display: 'block' }} />
    </AbsoluteFill>
  );
};
