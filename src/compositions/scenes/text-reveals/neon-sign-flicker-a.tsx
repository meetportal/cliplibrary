import { Composition } from 'remotion';
import {
  type NeonSignFlickerAProps,
  neonSignFlickerADefaults,
  neonSignFlickerAMeta,
  neonSignFlickerASchema,
} from '@/schemas';
import type { SceneModule } from '../../scene-module';
import { NeonSignFlicker } from '../../text-reveals/neon-sign-flicker/neon-sign-flicker';

const NeonSignFlickerA = (props: NeonSignFlickerAProps) => <NeonSignFlicker {...props} />;

export const neonSignFlickerAScene: SceneModule = {
  id: 'neon-sign-flicker-a',
  component: NeonSignFlickerA,
  render: (key) => (
    <Composition
      key={key}
      id="neon-sign-flicker-a"
      component={NeonSignFlickerA}
      schema={neonSignFlickerASchema}
      defaultProps={neonSignFlickerADefaults}
      durationInFrames={neonSignFlickerAMeta.durationInFrames}
      fps={neonSignFlickerAMeta.fps}
      width={neonSignFlickerAMeta.width}
      height={neonSignFlickerAMeta.height}
    />
  ),
};
