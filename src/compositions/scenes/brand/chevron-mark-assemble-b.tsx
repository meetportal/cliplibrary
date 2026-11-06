import { Composition } from 'remotion';
import {
  type ChevronMarkAssembleBProps,
  chevronMarkAssembleBDefaults,
  chevronMarkAssembleBMeta,
  chevronMarkAssembleBSchema,
} from '@/schemas';
import { ChevronMarkAssemble } from '../../brand/chevron-mark-assemble/chevron-mark-assemble';
import type { SceneModule } from '../../scene-module';

const ChevronMarkAssembleB = (props: ChevronMarkAssembleBProps) => (
  <ChevronMarkAssemble {...props} />
);

export const chevronMarkAssembleBScene: SceneModule = {
  id: 'chevron-mark-assemble-b',
  component: ChevronMarkAssembleB,
  render: (key) => (
    <Composition
      key={key}
      id="chevron-mark-assemble-b"
      component={ChevronMarkAssembleB}
      schema={chevronMarkAssembleBSchema}
      defaultProps={chevronMarkAssembleBDefaults}
      durationInFrames={chevronMarkAssembleBMeta.durationInFrames}
      fps={chevronMarkAssembleBMeta.fps}
      width={chevronMarkAssembleBMeta.width}
      height={chevronMarkAssembleBMeta.height}
    />
  ),
};
