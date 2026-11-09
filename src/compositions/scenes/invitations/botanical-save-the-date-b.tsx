import { Composition } from 'remotion';
import {
  type BotanicalSaveTheDateBProps,
  botanicalSaveTheDateBDefaults,
  botanicalSaveTheDateBMeta,
  botanicalSaveTheDateBSchema,
} from '@/schemas';
import { BotanicalSaveTheDate } from '../../invitations/botanical-save-the-date/botanical-save-the-date';
import type { SceneModule } from '../../scene-module';

const BotanicalSaveTheDateB = (props: BotanicalSaveTheDateBProps) => (
  <BotanicalSaveTheDate {...props} />
);

export const botanicalSaveTheDateBScene: SceneModule = {
  id: 'botanical-save-the-date-b',
  component: BotanicalSaveTheDateB,
  render: (key) => (
    <Composition
      key={key}
      id="botanical-save-the-date-b"
      component={BotanicalSaveTheDateB}
      schema={botanicalSaveTheDateBSchema}
      defaultProps={botanicalSaveTheDateBDefaults}
      durationInFrames={botanicalSaveTheDateBMeta.durationInFrames}
      fps={botanicalSaveTheDateBMeta.fps}
      width={botanicalSaveTheDateBMeta.width}
      height={botanicalSaveTheDateBMeta.height}
    />
  ),
};
