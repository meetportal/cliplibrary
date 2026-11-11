import { Composition } from 'remotion';
import { brandingIsTickerDefaults, brandingIsTickerMeta, brandingIsTickerSchema } from '@/schemas';
import { BrandingIsTicker } from '../../kinetic-type/branding-is-ticker/branding-is-ticker';
import type { SceneModule } from '../../scene-module';

export const brandingIsTickerScene: SceneModule = {
  id: 'branding-is-ticker',
  component: BrandingIsTicker,
  render: (key) => (
    <Composition
      key={key}
      id="branding-is-ticker"
      component={BrandingIsTicker}
      schema={brandingIsTickerSchema}
      defaultProps={brandingIsTickerDefaults}
      durationInFrames={brandingIsTickerMeta.durationInFrames}
      fps={brandingIsTickerMeta.fps}
      width={brandingIsTickerMeta.width}
      height={brandingIsTickerMeta.height}
    />
  ),
};
