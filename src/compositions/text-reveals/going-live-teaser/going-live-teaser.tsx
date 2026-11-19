import { useLayoutEffect, useMemo, useRef } from 'react';
import { AbsoluteFill, useCurrentFrame, useCurrentScale, useRemotionEnvironment } from 'remotion';
import type { GoingLiveTeaserProps } from '@/schemas';
import {
  drawArcs,
  drawBackdrop,
  drawBar,
  drawDashboard,
  drawPulse,
  drawSheets,
  drawSignal,
  drawSmoke,
  drawWipe,
} from './draw-decor';
import { drawEndText, drawName, drawPlate, type LogoImage } from './draw-end';
import {
  drawGlitch,
  drawLight,
  drawOpener,
  drawPunch,
  drawStandard,
  type Scene,
} from './draw-words';
import { useTeaserFonts } from './fonts';
import { buildLayout, type Layout } from './layout';
import { buildPalette, type Palette } from './palette';
import { FRAME } from './text-fit';
import { BEATS, DECOR, END, progress, smooth, tailAdvance } from './timeline';
import { useLogoImage } from './use-logo-image';

const MIN_RATIO = 0.5;
const END_PUSH_MAX = 0.05;
const MAX_RATIO = 2;

const useBackingRatio = () => {
  const { isClientSideRendering } = useRemotionEnvironment();
  const scale = useCurrentScale({ dontThrowIfOutsideOfRemotion: true });
  const device = typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1;
  const output = isClientSideRendering ? 1 : scale * device;
  return Math.min(MAX_RATIO, Math.max(MIN_RATIO, output));
};

const paint = (
  context: CanvasRenderingContext2D,
  frame: number,
  props: GoingLiveTeaserProps,
  layout: Layout,
  palette: Palette,
  logo: LogoImage,
  ratio: number,
) => {
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.clearRect(0, 0, FRAME.width, FRAME.height);
  if (props.showBackground) {
    drawBackdrop(context, palette, frame);
  }
  drawPulse(context, palette, frame, props.effects.pulse);
  if (props.effects.arcs) {
    drawArcs(context, palette, frame, ratio);
  }
  drawDashboard(context, palette, frame, ratio);
  if (props.effects.sheets) {
    drawSheets(context, palette, frame);
  }
  const scene: Scene = { context, frame, ratio, y: props.layout.wordY, push: props.effects.push };
  drawSmoke(context, palette, frame, {
    amount: props.effects.smoke,
    halfWidth: layout.light.width / 2,
    y: props.layout.wordY,
    size: layout.light.size,
    scale: ratio,
  });
  drawOpener(scene, layout);
  drawGlitch(scene, layout, props.effects.glitch);
  drawStandard(scene, layout.bridge, BEATS.bridge);
  drawStandard(scene, layout.panel, BEATS.panel);
  drawLight(scene, layout);
  drawPunch(scene, layout.punchOne, BEATS.punchOne, props.effects.echoGap);
  drawPunch(scene, layout.punchTwo, BEATS.punchTwo, props.effects.echoGap);
  drawName(scene, layout);
  drawBar(context, palette, frame);
  drawWipe(context, palette, frame);
  const advance = tailAdvance(layout.name.timing);
  const push =
    1 +
    Math.min(props.effects.push, END_PUSH_MAX) *
      smooth(progress(frame, { from: DECOR.plate.from - advance, to: END }));
  const tail: Scene = { ...scene, frame: frame + advance };
  const pivot = (props.layout.logoY + props.layout.contactsY) / 2;
  context.save();
  context.translate(FRAME.centerX, pivot);
  context.scale(push, push);
  context.translate(-FRAME.centerX, -pivot);
  if (props.effects.arcs) {
    drawSignal(context, palette, frame, { y: props.layout.logoY, scale: ratio });
  }
  drawPlate(tail, layout, palette, logo, { plate: props.endCard.plate, y: props.layout.logoY });
  drawEndText(tail, layout, palette, props.endCard.icons);
  context.restore();
};

export const GoingLiveTeaser = (props: GoingLiveTeaserProps) => {
  const frame = useCurrentFrame();
  const ref = useRef<HTMLCanvasElement>(null);
  const ratio = useBackingRatio();
  const faces = useTeaserFonts(props.type.font);
  const logo = useLogoImage(props.logo);
  const palette = useMemo(() => buildPalette(props.colors), [props.colors]);
  const layout = useMemo(
    () => (faces === null ? null : buildLayout(props, faces, palette, logo?.box ?? null, ratio)),
    [props, faces, palette, logo, ratio],
  );
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
    paint(context, frame, props, layout, palette, logo, ratio);
  });
  return (
    <AbsoluteFill>
      <canvas ref={ref} style={{ width: FRAME.width, height: FRAME.height, display: 'block' }} />
    </AbsoluteFill>
  );
};
