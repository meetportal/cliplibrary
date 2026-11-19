import { useEffect, useLayoutEffect, useRef } from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useCurrentScale,
  useRemotionEnvironment,
  useVideoConfig,
} from 'remotion';
import type { FloatingCardsProps } from '@/schemas';
import { type BackdropLayer, backdropLayer } from './backdrop';
import { type CardSprite, cardSprite } from './card-face';
import { drawCard } from './draw-card';
import { fontFamilyOf, LABEL_WEIGHT, useFontReady, VALUE_WEIGHT } from './fonts';
import { cardPalette } from './palette';
import { cardMotion, dipProgress } from './timeline';

const MIN_RATIO = 0.25;
const MAX_RATIO = 2;

const useOutputRatio = () => {
  const { isClientSideRendering } = useRemotionEnvironment();
  const scale = useCurrentScale({ dontThrowIfOutsideOfRemotion: true });
  const device = typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1;
  return isClientSideRendering ? 1 : Math.min(MAX_RATIO, Math.max(MIN_RATIO, scale * device));
};

export const FloatingCards = (props: FloatingCardsProps) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const ready = useFontReady(props.type.font);
  const ratio = useOutputRatio();
  const ref = useRef<HTMLCanvasElement>(null);
  const sprites = useRef(new Map<number, CardSprite>());
  const backdrop = useRef<BackdropLayer | undefined>(undefined);
  useEffect(() => {
    const canvas = ref.current;
    const cached = sprites.current;
    return () => {
      const layers = [...cached.values()].map((item) => item.canvas);
      const plate = backdrop.current?.canvas;
      for (const sprite of layers.concat(canvas ?? [], plate ?? [])) {
        sprite.width = 0;
        sprite.height = 0;
      }
      cached.clear();
      backdrop.current = undefined;
    };
  }, []);
  useLayoutEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext('2d');
    if (!(canvas && context)) {
      return;
    }
    const wide = Math.max(1, Math.round(width * ratio));
    const high = Math.max(1, Math.round(height * ratio));
    if (canvas.width !== wide || canvas.height !== high) {
      canvas.width = wide;
      canvas.height = high;
    }
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, wide, high);
    context.setTransform(wide / width, 0, 0, high / height, 0, 0);
    if (!ready) {
      return;
    }
    const { colors } = props;
    if (props.showBackground) {
      const layer = backdropLayer(
        { width, height, wide, high },
        colors.background,
        colors.backgroundEdge,
        backdrop.current,
      );
      backdrop.current = layer;
      context.drawImage(layer.canvas, 0, 0, width, height);
    }
    const palette = cardPalette(props);
    const face = {
      family: fontFamilyOf(props.type.font),
      label: LABEL_WEIGHT,
      value: VALUE_WEIGHT,
    };
    props.cards.forEach((card, index) => {
      const sprite = cardSprite(
        context,
        card,
        props,
        palette,
        face,
        ratio,
        sprites.current.get(index),
      );
      sprites.current.set(index, sprite);
      drawCard(
        context,
        card,
        sprite,
        cardMotion(props, index, frame, durationInFrames),
        props,
        palette,
        ratio,
      );
    });
    const dip = props.showBackground ? dipProgress(props, frame, durationInFrames) : 0;
    if (dip > 0) {
      context.globalAlpha = dip;
      context.fillStyle = colors.fade;
      context.fillRect(0, 0, width, height);
      context.globalAlpha = 1;
    }
  });
  return (
    <AbsoluteFill>
      <canvas
        ref={ref}
        aria-label={props.cards.map((card) => `${card.label} ${card.value}`).join(', ')}
        style={{ position: 'absolute', left: 0, top: 0, width, height }}
      />
    </AbsoluteFill>
  );
};
