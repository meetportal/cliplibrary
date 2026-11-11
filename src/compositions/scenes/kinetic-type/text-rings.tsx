import { Composition } from 'remotion';
import { textRingsDefaults, textRingsMeta, textRingsSchema } from '@/schemas';
import { TextRings } from '../../kinetic-type/text-rings/text-rings';
import type { SceneModule } from '../../scene-module';

export const textRingsScene: SceneModule = {
  id: 'text-rings',
  component: TextRings,
  render: (key) => (
    <Composition
      key={key}
      id="text-rings"
      component={TextRings}
      schema={textRingsSchema}
      defaultProps={textRingsDefaults}
      durationInFrames={textRingsMeta.durationInFrames}
      fps={textRingsMeta.fps}
      width={textRingsMeta.width}
      height={textRingsMeta.height}
    />
  ),
};
