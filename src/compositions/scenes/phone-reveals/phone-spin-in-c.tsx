import { Composition } from 'remotion';
import {
  type PhoneSpinInCProps,
  phoneSpinInCDefaults,
  phoneSpinInCMeta,
  phoneSpinInCSchema,
} from '@/schemas';
import { PhoneSpinIn } from '../../phone-reveals/phone-spin-in/phone-spin-in';
import type { SceneModule } from '../../scene-module';

const PhoneSpinInC = (props: PhoneSpinInCProps) => <PhoneSpinIn {...props} />;

export const phoneSpinInCScene: SceneModule = {
  id: 'phone-spin-in-c',
  component: PhoneSpinInC,
  render: (key) => (
    <Composition
      key={key}
      id="phone-spin-in-c"
      component={PhoneSpinInC}
      schema={phoneSpinInCSchema}
      defaultProps={phoneSpinInCDefaults}
      durationInFrames={phoneSpinInCMeta.durationInFrames}
      fps={phoneSpinInCMeta.fps}
      width={phoneSpinInCMeta.width}
      height={phoneSpinInCMeta.height}
    />
  ),
};
