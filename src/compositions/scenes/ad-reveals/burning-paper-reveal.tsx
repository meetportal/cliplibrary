import { Composition } from 'remotion';
import {
  burningPaperRevealDefaults,
  burningPaperRevealMeta,
  burningPaperRevealSchema,
} from '@/schemas';
import { BurningPaperReveal } from '../../ad-reveals/burning-paper-reveal/burning-paper-reveal';
import type { SceneModule } from '../../scene-module';

export const burningPaperRevealScene: SceneModule = {
  id: 'burning-paper-reveal',
  component: BurningPaperReveal,
  render: (key) => (
    <Composition
      key={key}
      id="burning-paper-reveal"
      component={BurningPaperReveal}
      schema={burningPaperRevealSchema}
      defaultProps={burningPaperRevealDefaults}
      durationInFrames={burningPaperRevealMeta.durationInFrames}
      fps={burningPaperRevealMeta.fps}
      width={burningPaperRevealMeta.width}
      height={burningPaperRevealMeta.height}
    />
  ),
};
