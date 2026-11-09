import { Composition } from 'remotion';
import {
  type NeonSignFlickerCProps,
  neonSignFlickerCDefaults,
  neonSignFlickerCMeta,
  neonSignFlickerCSchema,
} from '@/schemas';
import type { SceneModule } from '../../scene-module';
import { NeonSignFlicker } from '../../text-reveals/neon-sign-flicker/neon-sign-flicker';

const NeonSignFlickerC = (props: NeonSignFlickerCProps) => <NeonSignFlicker {...props} />;

export const neonSignFlickerCScene: SceneModule = {
  id: 'neon-sign-flicker-c',
  component: NeonSignFlickerC,
  render: (key) => (
    <Composition
      key={key}
      id="neon-sign-flicker-c"
      component={NeonSignFlickerC}
      schema={neonSignFlickerCSchema}
      defaultProps={neonSignFlickerCDefaults}
      durationInFrames={neonSignFlickerCMeta.durationInFrames}
      fps={neonSignFlickerCMeta.fps}
      width={neonSignFlickerCMeta.width}
      height={neonSignFlickerCMeta.height}
    />
  ),
};
