import { Composition } from 'remotion';
import {
  type TextRingsCProps,
  textRingsCDefaults,
  textRingsCMeta,
  textRingsCSchema,
} from '@/schemas';
import { TextRings } from '../../kinetic-type/text-rings/text-rings';
import type { SceneModule } from '../../scene-module';

const TextRingsC = (props: TextRingsCProps) => <TextRings {...props} />;

export const textRingsCScene: SceneModule = {
  id: 'text-rings-c',
  component: TextRingsC,
  render: (key) => (
    <Composition
      key={key}
      id="text-rings-c"
      component={TextRingsC}
      schema={textRingsCSchema}
      defaultProps={textRingsCDefaults}
      durationInFrames={textRingsCMeta.durationInFrames}
      fps={textRingsCMeta.fps}
      width={textRingsCMeta.width}
      height={textRingsCMeta.height}
    />
  ),
};
