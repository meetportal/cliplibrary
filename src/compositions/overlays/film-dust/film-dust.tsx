import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useCurrentScale,
  useRemotionEnvironment,
  useVideoConfig,
} from 'remotion';
import type { FilmDustProps } from '@/schemas';
import { legibleOn } from '../../kit/lab-color';
import { accentColor, markInks } from './accent';
import { drawFilm } from './draw';
import { buildMarks } from './dust';
import { useTitleFonts } from './fonts';
import { buildPlate } from './plate';
import { buildTitleSprite } from './title';

const NAME_CONTRAST = 4.5;

export const FilmDust = (props: FilmDustProps) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const ref = useRef<HTMLCanvasElement>(null);
  const ready = useTitleFonts();
  const { isClientSideRendering } = useRemotionEnvironment();
  const scale = useCurrentScale({ dontThrowIfOutsideOfRemotion: true });
  const device = typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1;
  const ratio = isClientSideRendering ? 1 : Math.min(2, scale * device);
  const marks = useMemo(
    () => buildMarks(durationInFrames, props.dust),
    [durationInFrames, props.dust],
  );
  const ink = legibleOn(props.colors.text, props.colors.background, NAME_CONTRAST);
  const accent = accentColor(props.colors.primary, props.colors.background, ink);
  const sprite = useMemo(
    () => (ready && props.title.show ? buildTitleSprite(props, ink, accent, ratio) : null),
    [ready, props, ink, accent, ratio],
  );
  const wide = Math.max(1, Math.round(width * ratio));
  const high = Math.max(1, Math.round(height * ratio));
  const { background, backgroundEdge } = props.colors;
  const inks = markInks(props.colors.dust, background, backgroundEdge);
  const plate = useMemo(
    () => (props.showBackground ? buildPlate(background, backgroundEdge, wide, high) : null),
    [props.showBackground, background, backgroundEdge, wide, high],
  );
  const turn = (2 * Math.PI * frame) / durationInFrames;
  const weave = {
    x: props.weave.radius * Math.sin(turn),
    y: props.weave.radius * (Math.cos(turn) - 1),
    scale: 1 + props.weave.breathing * Math.sin(turn),
  };
  useEffect(() => {
    const canvas = ref.current;
    return () => {
      if (canvas !== null) {
        canvas.width = 0;
        canvas.height = 0;
      }
    };
  }, []);
  useLayoutEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext('2d');
    if (!(canvas && context && ready)) {
      return;
    }
    if (canvas.width !== wide || canvas.height !== high) {
      canvas.width = wide;
      canvas.height = high;
    }
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, wide, high);
    context.setTransform(wide / width, 0, 0, high / height, 0, 0);
    drawFilm(
      context,
      props,
      plate,
      sprite,
      inks,
      marks,
      { width, height, frame, frames: durationInFrames },
      weave,
    );
  });
  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent' }}>
      <canvas
        ref={ref}
        aria-label={props.title.show ? `${props.companyName} ${props.tagline}` : 'Film dust'}
        style={{ position: 'absolute', left: 0, top: 0, width, height }}
      />
    </AbsoluteFill>
  );
};
