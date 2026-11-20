import { Composition } from 'remotion';
import { appScreensPromoDefaults, appScreensPromoMeta, appScreensPromoSchema } from '@/schemas';
import { AppScreensPromo } from '../../phone-layouts/app-screens-promo/app-screens-promo';
import type { SceneModule } from '../../scene-module';

export const appScreensPromoScene: SceneModule = {
  id: 'app-screens-promo',
  component: AppScreensPromo,
  render: (key) => (
    <Composition
      key={key}
      id="app-screens-promo"
      component={AppScreensPromo}
      schema={appScreensPromoSchema}
      defaultProps={appScreensPromoDefaults}
      durationInFrames={appScreensPromoMeta.durationInFrames}
      fps={appScreensPromoMeta.fps}
      width={appScreensPromoMeta.width}
      height={appScreensPromoMeta.height}
    />
  ),
};
