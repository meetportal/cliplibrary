import { Composition } from 'remotion';
import {
  type TextRingsBProps,
  textRingsBDefaults,
  textRingsBMeta,
  textRingsBSchema,
} from '@/schemas';
import { TextRings } from '../../kinetic-type/text-rings/text-rings';
import type { SceneModule } from '../../scene-module';

const TextRingsB = (props: TextRingsBProps) => <TextRings {...props} />;

export const textRingsBScene: SceneModule = {
  id: 'text-rings-b',
  component: TextRingsB,
  render: (key) => (
    <Composition
      key={key}
      id="text-rings-b"
      component={TextRingsB}
      schema={textRingsBSchema}
      defaultProps={textRingsBDefaults}
      durationInFrames={textRingsBMeta.durationInFrames}
      fps={textRingsBMeta.fps}
      width={textRingsBMeta.width}
      height={textRingsBMeta.height}
    />
  ),
};
