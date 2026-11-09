import { Composition } from 'remotion';
import {
  type PhoneSpinInBProps,
  phoneSpinInBDefaults,
  phoneSpinInBMeta,
  phoneSpinInBSchema,
} from '@/schemas';
import { PhoneSpinIn } from '../../phone-reveals/phone-spin-in/phone-spin-in';
import type { SceneModule } from '../../scene-module';

const PhoneSpinInB = (props: PhoneSpinInBProps) => <PhoneSpinIn {...props} />;

export const phoneSpinInBScene: SceneModule = {
  id: 'phone-spin-in-b',
  component: PhoneSpinInB,
  render: (key) => (
    <Composition
      key={key}
      id="phone-spin-in-b"
      component={PhoneSpinInB}
      schema={phoneSpinInBSchema}
      defaultProps={phoneSpinInBDefaults}
      durationInFrames={phoneSpinInBMeta.durationInFrames}
      fps={phoneSpinInBMeta.fps}
      width={phoneSpinInBMeta.width}
      height={phoneSpinInBMeta.height}
    />
  ),
};
