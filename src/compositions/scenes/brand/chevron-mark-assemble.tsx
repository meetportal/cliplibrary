import { Composition } from 'remotion';
import {
  chevronMarkAssembleDefaults,
  chevronMarkAssembleMeta,
  chevronMarkAssembleSchema,
} from '@/schemas';
import { ChevronMarkAssemble } from '../../brand/chevron-mark-assemble/chevron-mark-assemble';
import type { SceneModule } from '../../scene-module';

export const chevronMarkAssembleScene: SceneModule = {
  id: 'chevron-mark-assemble',
  component: ChevronMarkAssemble,
  render: (key) => (
    <Composition
      key={key}
      id="chevron-mark-assemble"
      component={ChevronMarkAssemble}
      schema={chevronMarkAssembleSchema}
      defaultProps={chevronMarkAssembleDefaults}
      durationInFrames={chevronMarkAssembleMeta.durationInFrames}
      fps={chevronMarkAssembleMeta.fps}
      width={chevronMarkAssembleMeta.width}
      height={chevronMarkAssembleMeta.height}
    />
  ),
};
