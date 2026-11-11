import { Composition } from 'remotion';
import { brandRevealDefaults, brandRevealMeta, brandRevealSchema } from '@/schemas';
import { BrandReveal } from '../../brand/brand-reveal/brand-reveal';
import type { SceneModule } from '../../scene-module';

export const brandRevealScene: SceneModule = {
  id: 'brand-reveal',
  component: BrandReveal,
  render: (key) => (
    <Composition
      key={key}
      id="brand-reveal"
      component={BrandReveal}
      schema={brandRevealSchema}
      defaultProps={brandRevealDefaults}
      durationInFrames={brandRevealMeta.durationInFrames}
      fps={brandRevealMeta.fps}
      width={brandRevealMeta.width}
      height={brandRevealMeta.height}
    />
  ),
};
