import { Composition } from 'remotion';
import {
  type BotanicalSaveTheDateCProps,
  botanicalSaveTheDateCDefaults,
  botanicalSaveTheDateCMeta,
  botanicalSaveTheDateCSchema,
} from '@/schemas';
import { BotanicalSaveTheDate } from '../../invitations/botanical-save-the-date/botanical-save-the-date';
import type { SceneModule } from '../../scene-module';

const BotanicalSaveTheDateC = (props: BotanicalSaveTheDateCProps) => (
  <BotanicalSaveTheDate {...props} />
);

export const botanicalSaveTheDateCScene: SceneModule = {
  id: 'botanical-save-the-date-c',
  component: BotanicalSaveTheDateC,
  render: (key) => (
    <Composition
      key={key}
      id="botanical-save-the-date-c"
      component={BotanicalSaveTheDateC}
      schema={botanicalSaveTheDateCSchema}
      defaultProps={botanicalSaveTheDateCDefaults}
      durationInFrames={botanicalSaveTheDateCMeta.durationInFrames}
      fps={botanicalSaveTheDateCMeta.fps}
      width={botanicalSaveTheDateCMeta.width}
      height={botanicalSaveTheDateCMeta.height}
    />
  ),
};
