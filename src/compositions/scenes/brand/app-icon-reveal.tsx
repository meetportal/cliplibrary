import { Composition } from 'remotion';
import { appIconRevealDefaults, appIconRevealMeta, appIconRevealSchema } from '@/schemas';
import { AppIconReveal } from '../../brand/app-icon-reveal/app-icon-reveal';
import type { SceneModule } from '../../scene-module';

export const appIconRevealScene: SceneModule = {
  id: 'app-icon-reveal',
  component: AppIconReveal,
  render: (key) => (
    <Composition
      key={key}
      id="app-icon-reveal"
      component={AppIconReveal}
      schema={appIconRevealSchema}
      defaultProps={appIconRevealDefaults}
      durationInFrames={appIconRevealMeta.durationInFrames}
      fps={appIconRevealMeta.fps}
      width={appIconRevealMeta.width}
      height={appIconRevealMeta.height}
    />
  ),
};
