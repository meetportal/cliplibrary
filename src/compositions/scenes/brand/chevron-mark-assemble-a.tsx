import { Composition } from 'remotion';
import {
  type ChevronMarkAssembleAProps,
  chevronMarkAssembleADefaults,
  chevronMarkAssembleAMeta,
  chevronMarkAssembleASchema,
} from '@/schemas';
import { ChevronMarkAssemble } from '../../brand/chevron-mark-assemble/chevron-mark-assemble';
import type { SceneModule } from '../../scene-module';

const ChevronMarkAssembleA = (props: ChevronMarkAssembleAProps) => (
  <ChevronMarkAssemble {...props} />
);

export const chevronMarkAssembleAScene: SceneModule = {
  id: 'chevron-mark-assemble-a',
  component: ChevronMarkAssembleA,
  render: (key) => (
    <Composition
      key={key}
      id="chevron-mark-assemble-a"
      component={ChevronMarkAssembleA}
      schema={chevronMarkAssembleASchema}
      defaultProps={chevronMarkAssembleADefaults}
      durationInFrames={chevronMarkAssembleAMeta.durationInFrames}
      fps={chevronMarkAssembleAMeta.fps}
      width={chevronMarkAssembleAMeta.width}
      height={chevronMarkAssembleAMeta.height}
    />
  ),
};
