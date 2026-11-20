import { Composition } from 'remotion';
import {
  pillStickerCollageDefaults,
  pillStickerCollageMeta,
  pillStickerCollageSchema,
} from '@/schemas';
import { PillStickerCollage } from '../../kinetic-type/pill-sticker-collage/pill-sticker-collage';
import type { SceneModule } from '../../scene-module';

export const pillStickerCollageScene: SceneModule = {
  id: 'pill-sticker-collage',
  component: PillStickerCollage,
  render: (key) => (
    <Composition
      key={key}
      id="pill-sticker-collage"
      component={PillStickerCollage}
      schema={pillStickerCollageSchema}
      defaultProps={pillStickerCollageDefaults}
      durationInFrames={pillStickerCollageMeta.durationInFrames}
      fps={pillStickerCollageMeta.fps}
      width={pillStickerCollageMeta.width}
      height={pillStickerCollageMeta.height}
    />
  ),
};
