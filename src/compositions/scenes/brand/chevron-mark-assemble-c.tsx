import { Composition } from 'remotion';
import {
  type ChevronMarkAssembleCProps,
  chevronMarkAssembleCDefaults,
  chevronMarkAssembleCMeta,
  chevronMarkAssembleCSchema,
} from '@/schemas';
import { ChevronMarkAssemble } from '../../brand/chevron-mark-assemble/chevron-mark-assemble';
import type { SceneModule } from '../../scene-module';

const ChevronMarkAssembleC = (props: ChevronMarkAssembleCProps) => (
  <ChevronMarkAssemble {...props} />
);

export const chevronMarkAssembleCScene: SceneModule = {
  id: 'chevron-mark-assemble-c',
  component: ChevronMarkAssembleC,
  render: (key) => (
    <Composition
      key={key}
      id="chevron-mark-assemble-c"
      component={ChevronMarkAssembleC}
      schema={chevronMarkAssembleCSchema}
      defaultProps={chevronMarkAssembleCDefaults}
      durationInFrames={chevronMarkAssembleCMeta.durationInFrames}
      fps={chevronMarkAssembleCMeta.fps}
      width={chevronMarkAssembleCMeta.width}
      height={chevronMarkAssembleCMeta.height}
    />
  ),
};
