import { Composition } from 'remotion';
import {
  type MagnifierCaptionBProps,
  magnifierCaptionBDefaults,
  magnifierCaptionBMeta,
  magnifierCaptionBSchema,
} from '@/schemas';
import type { SceneModule } from '../../scene-module';
import { MagnifierCaption } from '../../text-reveals/magnifier-caption/magnifier-caption';

const MagnifierCaptionB = (props: MagnifierCaptionBProps) => <MagnifierCaption {...props} />;

export const magnifierCaptionBScene: SceneModule = {
  id: 'magnifier-caption-b',
  component: MagnifierCaptionB,
  render: (key) => (
    <Composition
      key={key}
      id="magnifier-caption-b"
      component={MagnifierCaptionB}
      schema={magnifierCaptionBSchema}
      defaultProps={magnifierCaptionBDefaults}
      durationInFrames={magnifierCaptionBMeta.durationInFrames}
      fps={magnifierCaptionBMeta.fps}
      width={magnifierCaptionBMeta.width}
      height={magnifierCaptionBMeta.height}
    />
  ),
};
