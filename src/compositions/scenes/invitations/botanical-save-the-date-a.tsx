import { Composition } from 'remotion';
import {
  type BotanicalSaveTheDateAProps,
  botanicalSaveTheDateADefaults,
  botanicalSaveTheDateAMeta,
  botanicalSaveTheDateASchema,
} from '@/schemas';
import { BotanicalSaveTheDate } from '../../invitations/botanical-save-the-date/botanical-save-the-date';
import type { SceneModule } from '../../scene-module';

const BotanicalSaveTheDateA = (props: BotanicalSaveTheDateAProps) => (
  <BotanicalSaveTheDate {...props} />
);

export const botanicalSaveTheDateAScene: SceneModule = {
  id: 'botanical-save-the-date-a',
  component: BotanicalSaveTheDateA,
  render: (key) => (
    <Composition
      key={key}
      id="botanical-save-the-date-a"
      component={BotanicalSaveTheDateA}
      schema={botanicalSaveTheDateASchema}
      defaultProps={botanicalSaveTheDateADefaults}
      durationInFrames={botanicalSaveTheDateAMeta.durationInFrames}
      fps={botanicalSaveTheDateAMeta.fps}
      width={botanicalSaveTheDateAMeta.width}
      height={botanicalSaveTheDateAMeta.height}
    />
  ),
};
