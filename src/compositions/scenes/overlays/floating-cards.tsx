import { Composition } from 'remotion';
import { floatingCardsDefaults, floatingCardsMeta, floatingCardsSchema } from '@/schemas';
import { FloatingCards } from '../../overlays/floating-cards/floating-cards';
import type { SceneModule } from '../../scene-module';

export const floatingCardsScene: SceneModule = {
  id: 'floating-cards',
  component: FloatingCards,
  render: (key) => (
    <Composition
      key={key}
      id="floating-cards"
      component={FloatingCards}
      schema={floatingCardsSchema}
      defaultProps={floatingCardsDefaults}
      durationInFrames={floatingCardsMeta.durationInFrames}
      fps={floatingCardsMeta.fps}
      width={floatingCardsMeta.width}
      height={floatingCardsMeta.height}
    />
  ),
};
