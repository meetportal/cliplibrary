import { Composition } from 'remotion';
import {
  type PhoneSpinInAProps,
  phoneSpinInADefaults,
  phoneSpinInAMeta,
  phoneSpinInASchema,
} from '@/schemas';
import { PhoneSpinIn } from '../../phone-reveals/phone-spin-in/phone-spin-in';
import type { SceneModule } from '../../scene-module';

const PhoneSpinInA = (props: PhoneSpinInAProps) => <PhoneSpinIn {...props} />;

export const phoneSpinInAScene: SceneModule = {
  id: 'phone-spin-in-a',
  component: PhoneSpinInA,
  render: (key) => (
    <Composition
      key={key}
      id="phone-spin-in-a"
      component={PhoneSpinInA}
      schema={phoneSpinInASchema}
      defaultProps={phoneSpinInADefaults}
      durationInFrames={phoneSpinInAMeta.durationInFrames}
      fps={phoneSpinInAMeta.fps}
      width={phoneSpinInAMeta.width}
      height={phoneSpinInAMeta.height}
    />
  ),
};
