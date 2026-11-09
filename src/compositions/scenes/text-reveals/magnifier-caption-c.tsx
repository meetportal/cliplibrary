import { Composition } from 'remotion';
import {
  type MagnifierCaptionCProps,
  magnifierCaptionCDefaults,
  magnifierCaptionCMeta,
  magnifierCaptionCSchema,
} from '@/schemas';
import type { SceneModule } from '../../scene-module';
import { MagnifierCaption } from '../../text-reveals/magnifier-caption/magnifier-caption';

const MagnifierCaptionC = (props: MagnifierCaptionCProps) => <MagnifierCaption {...props} />;

export const magnifierCaptionCScene: SceneModule = {
  id: 'magnifier-caption-c',
  component: MagnifierCaptionC,
  render: (key) => (
    <Composition
      key={key}
      id="magnifier-caption-c"
      component={MagnifierCaptionC}
      schema={magnifierCaptionCSchema}
      defaultProps={magnifierCaptionCDefaults}
      durationInFrames={magnifierCaptionCMeta.durationInFrames}
      fps={magnifierCaptionCMeta.fps}
      width={magnifierCaptionCMeta.width}
      height={magnifierCaptionCMeta.height}
    />
  ),
};
