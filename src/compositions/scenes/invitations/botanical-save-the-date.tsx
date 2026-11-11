import { Composition } from 'remotion';
import {
  botanicalSaveTheDateDefaults,
  botanicalSaveTheDateMeta,
  botanicalSaveTheDateSchema,
} from '@/schemas';
import { BotanicalSaveTheDate } from '../../invitations/botanical-save-the-date/botanical-save-the-date';
import type { SceneModule } from '../../scene-module';

export const botanicalSaveTheDateScene: SceneModule = {
  id: 'botanical-save-the-date',
  component: BotanicalSaveTheDate,
  render: (key) => (
    <Composition
      key={key}
      id="botanical-save-the-date"
      component={BotanicalSaveTheDate}
      schema={botanicalSaveTheDateSchema}
      defaultProps={botanicalSaveTheDateDefaults}
      durationInFrames={botanicalSaveTheDateMeta.durationInFrames}
      fps={botanicalSaveTheDateMeta.fps}
      width={botanicalSaveTheDateMeta.width}
      height={botanicalSaveTheDateMeta.height}
    />
  ),
};
