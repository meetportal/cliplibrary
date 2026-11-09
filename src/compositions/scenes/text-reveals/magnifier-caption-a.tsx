import { Composition } from 'remotion';
import {
  type MagnifierCaptionAProps,
  magnifierCaptionADefaults,
  magnifierCaptionAMeta,
  magnifierCaptionASchema,
} from '@/schemas';
import type { SceneModule } from '../../scene-module';
import { MagnifierCaption } from '../../text-reveals/magnifier-caption/magnifier-caption';

const MagnifierCaptionA = (props: MagnifierCaptionAProps) => <MagnifierCaption {...props} />;

export const magnifierCaptionAScene: SceneModule = {
  id: 'magnifier-caption-a',
  component: MagnifierCaptionA,
  render: (key) => (
    <Composition
      key={key}
      id="magnifier-caption-a"
      component={MagnifierCaptionA}
      schema={magnifierCaptionASchema}
      defaultProps={magnifierCaptionADefaults}
      durationInFrames={magnifierCaptionAMeta.durationInFrames}
      fps={magnifierCaptionAMeta.fps}
      width={magnifierCaptionAMeta.width}
      height={magnifierCaptionAMeta.height}
    />
  ),
};
