import { Composition } from 'remotion';
import {
  type TextRingsAProps,
  textRingsADefaults,
  textRingsAMeta,
  textRingsASchema,
} from '@/schemas';
import { TextRings } from '../../kinetic-type/text-rings/text-rings';
import type { SceneModule } from '../../scene-module';

const TextRingsA = (props: TextRingsAProps) => <TextRings {...props} />;

export const textRingsAScene: SceneModule = {
  id: 'text-rings-a',
  component: TextRingsA,
  render: (key) => (
    <Composition
      key={key}
      id="text-rings-a"
      component={TextRingsA}
      schema={textRingsASchema}
      defaultProps={textRingsADefaults}
      durationInFrames={textRingsAMeta.durationInFrames}
      fps={textRingsAMeta.fps}
      width={textRingsAMeta.width}
      height={textRingsAMeta.height}
    />
  ),
};
