import { Composition } from 'remotion';
import { echoStackDefaults, echoStackMeta, echoStackSchema } from '@/schemas';
import { EchoStack } from '../../kinetic-type/echo-stack/echo-stack';
import type { SceneModule } from '../../scene-module';

export const echoStackScene: SceneModule = {
  id: 'echo-stack',
  component: EchoStack,
  render: (key) => (
    <Composition
      key={key}
      id="echo-stack"
      component={EchoStack}
      schema={echoStackSchema}
      defaultProps={echoStackDefaults}
      durationInFrames={echoStackMeta.durationInFrames}
      fps={echoStackMeta.fps}
      width={echoStackMeta.width}
      height={echoStackMeta.height}
    />
  ),
};
