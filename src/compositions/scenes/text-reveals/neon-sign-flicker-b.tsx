import { Composition } from 'remotion';
import {
  type NeonSignFlickerBProps,
  neonSignFlickerBDefaults,
  neonSignFlickerBMeta,
  neonSignFlickerBSchema,
} from '@/schemas';
import type { SceneModule } from '../../scene-module';
import { NeonSignFlicker } from '../../text-reveals/neon-sign-flicker/neon-sign-flicker';

const NeonSignFlickerB = (props: NeonSignFlickerBProps) => <NeonSignFlicker {...props} />;

export const neonSignFlickerBScene: SceneModule = {
  id: 'neon-sign-flicker-b',
  component: NeonSignFlickerB,
  render: (key) => (
    <Composition
      key={key}
      id="neon-sign-flicker-b"
      component={NeonSignFlickerB}
      schema={neonSignFlickerBSchema}
      defaultProps={neonSignFlickerBDefaults}
      durationInFrames={neonSignFlickerBMeta.durationInFrames}
      fps={neonSignFlickerBMeta.fps}
      width={neonSignFlickerBMeta.width}
      height={neonSignFlickerBMeta.height}
    />
  ),
};
