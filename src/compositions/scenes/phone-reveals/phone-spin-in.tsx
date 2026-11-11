import { Composition } from 'remotion';
import { phoneSpinInDefaults, phoneSpinInMeta, phoneSpinInSchema } from '@/schemas';
import { PhoneSpinIn } from '../../phone-reveals/phone-spin-in/phone-spin-in';
import type { SceneModule } from '../../scene-module';

export const phoneSpinInScene: SceneModule = {
  id: 'phone-spin-in',
  component: PhoneSpinIn,
  render: (key) => (
    <Composition
      key={key}
      id="phone-spin-in"
      component={PhoneSpinIn}
      schema={phoneSpinInSchema}
      defaultProps={phoneSpinInDefaults}
      durationInFrames={phoneSpinInMeta.durationInFrames}
      fps={phoneSpinInMeta.fps}
      width={phoneSpinInMeta.width}
      height={phoneSpinInMeta.height}
    />
  ),
};
