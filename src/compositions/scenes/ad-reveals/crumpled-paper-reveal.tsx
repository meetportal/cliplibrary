import { Composition } from 'remotion';
import {
  crumpledPaperRevealDefaults,
  crumpledPaperRevealMeta,
  crumpledPaperRevealSchema,
} from '@/schemas';
import { CrumpledPaperReveal } from '../../ad-reveals/crumpled-paper-reveal/crumpled-paper-reveal';
import type { SceneModule } from '../../scene-module';

export const crumpledPaperRevealScene: SceneModule = {
  id: 'crumpled-paper-reveal',
  component: CrumpledPaperReveal,
  render: (key) => (
    <Composition
      key={key}
      id="crumpled-paper-reveal"
      component={CrumpledPaperReveal}
      schema={crumpledPaperRevealSchema}
      defaultProps={crumpledPaperRevealDefaults}
      durationInFrames={crumpledPaperRevealMeta.durationInFrames}
      fps={crumpledPaperRevealMeta.fps}
      width={crumpledPaperRevealMeta.width}
      height={crumpledPaperRevealMeta.height}
    />
  ),
};
