import { Composition } from 'remotion';
import { neonSignFlickerDefaults, neonSignFlickerMeta, neonSignFlickerSchema } from '@/schemas';
import type { SceneModule } from '../../scene-module';
import { NeonSignFlicker } from '../../text-reveals/neon-sign-flicker/neon-sign-flicker';

export const neonSignFlickerScene: SceneModule = {
  id: 'neon-sign-flicker',
  component: NeonSignFlicker,
  render: (key) => (
    <Composition
      key={key}
      id="neon-sign-flicker"
      component={NeonSignFlicker}
      schema={neonSignFlickerSchema}
      defaultProps={neonSignFlickerDefaults}
      durationInFrames={neonSignFlickerMeta.durationInFrames}
      fps={neonSignFlickerMeta.fps}
      width={neonSignFlickerMeta.width}
      height={neonSignFlickerMeta.height}
    />
  ),
};
