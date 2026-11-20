import { Composition } from 'remotion';
import {
  techStackBranchesDefaults,
  techStackBranchesMeta,
  techStackBranchesSchema,
} from '@/schemas';
import { TechStackBranches } from '../../list-pickers/tech-stack-branches/tech-stack-branches';
import type { SceneModule } from '../../scene-module';

export const techStackBranchesScene: SceneModule = {
  id: 'tech-stack-branches',
  component: TechStackBranches,
  render: (key) => (
    <Composition
      key={key}
      id="tech-stack-branches"
      component={TechStackBranches}
      schema={techStackBranchesSchema}
      defaultProps={techStackBranchesDefaults}
      durationInFrames={techStackBranchesMeta.durationInFrames}
      fps={techStackBranchesMeta.fps}
      width={techStackBranchesMeta.width}
      height={techStackBranchesMeta.height}
    />
  ),
};
