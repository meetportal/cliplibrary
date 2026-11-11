import { Composition } from 'remotion';
import { magnifierCaptionDefaults, magnifierCaptionMeta, magnifierCaptionSchema } from '@/schemas';
import type { SceneModule } from '../../scene-module';
import { MagnifierCaption } from '../../text-reveals/magnifier-caption/magnifier-caption';

export const magnifierCaptionScene: SceneModule = {
  id: 'magnifier-caption',
  component: MagnifierCaption,
  render: (key) => (
    <Composition
      key={key}
      id="magnifier-caption"
      component={MagnifierCaption}
      schema={magnifierCaptionSchema}
      defaultProps={magnifierCaptionDefaults}
      durationInFrames={magnifierCaptionMeta.durationInFrames}
      fps={magnifierCaptionMeta.fps}
      width={magnifierCaptionMeta.width}
      height={magnifierCaptionMeta.height}
    />
  ),
};
