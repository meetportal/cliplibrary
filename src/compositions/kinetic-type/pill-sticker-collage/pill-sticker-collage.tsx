import { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { type PillStickerCollageProps, pillStickerCollageMeta } from '@/schemas';
import { resolveCustom } from '../../kit/resolve-custom';
import { useLogoBox } from '../../kit/use-logo-box';
import { CollageBackdrop } from './backdrop';
import { planLockup } from './brand';
import { planCamera } from './camera';
import { composeEnd } from './compose';
import { STICKER_FACES, useStickerMeasure } from './fonts';
import { planCollage, splitWords } from './layout';
import { planPalette } from './palette';
import { type StickerLook, StickerView } from './sticker';

export const PillStickerCollage = (props: PillStickerCollageProps) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const face = STICKER_FACES[props.type.font];
  const measure = useStickerMeasure(face);
  const logoBox = useLogoBox(props.logo);
  const logoAspect = logoBox === null ? null : logoBox.aspect;
  const plan = useMemo(() => {
    const size = { width, height };
    const logoSlot = logoAspect === null ? null : { aspect: logoAspect };
    const collage = planCollage(props, splitWords(props.headline), measure, size, durationInFrames);
    const stage = composeEnd(
      props,
      collage,
      (usable, scale) => planLockup(props, logoSlot, measure, usable, scale),
      size,
      durationInFrames,
      pillStickerCollageMeta.posterFrame,
    );
    const camera = planCamera(collage, stage.cameraY, props.timing.settleFrames, durationInFrames);
    return { stickers: stage.stickers, camera };
  }, [props, measure, width, height, durationInFrames, logoAspect]);
  const palette = useMemo(() => planPalette(props), [props]);
  const look: StickerLook = {
    face,
    palette,
    outline: props.stickers.outline,
    shadow: props.stickers.shadow,
    popFrames: props.timing.popFrames,
    spin: props.timing.spin,
    logo: logoBox === null ? null : { src: resolveCustom(props.logo), box: logoBox },
  };
  const at = Math.max(0, Math.min(plan.camera.length - 1, Math.floor(frame)));
  const camera = plan.camera[at] ?? { x: 0, y: 0 };
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {props.showBackground ? (
        <CollageBackdrop
          width={width}
          height={height}
          background={palette.background}
          glow={palette.glow}
          reach={props.backdrop.reach}
          drift={props.backdrop.drift}
          dither={props.backdrop.dither}
          frame={frame}
        />
      ) : null}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 0,
          height: 0,
          transform: `translate(${width / 2 - camera.x}px, ${height / 2 - camera.y}px)`,
        }}
      >
        {plan.stickers.map((sticker) => (
          <StickerView key={sticker.key} sticker={sticker} frame={frame} look={look} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
