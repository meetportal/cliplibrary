import { Composition } from 'remotion';
import { ctaEndCardDefaults, ctaEndCardMeta, ctaEndCardSchema } from '@/schemas';
import { CtaEndCard } from '../../brand/cta-end-card/cta-end-card';
import type { SceneModule } from '../../scene-module';

export const ctaEndCardScene: SceneModule = {
  id: 'cta-end-card',
  component: CtaEndCard,
  render: (key) => (
    <Composition
      key={key}
      id="cta-end-card"
      component={CtaEndCard}
      schema={ctaEndCardSchema}
      defaultProps={ctaEndCardDefaults}
      durationInFrames={ctaEndCardMeta.durationInFrames}
      fps={ctaEndCardMeta.fps}
      width={ctaEndCardMeta.width}
      height={ctaEndCardMeta.height}
    />
  ),
};
