import { Composition } from 'remotion';
import { archSaveTheDateDefaults, archSaveTheDateMeta, archSaveTheDateSchema } from '@/schemas';
import { ArchSaveTheDate } from '../../invitations/arch-save-the-date/arch-save-the-date';
import type { SceneModule } from '../../scene-module';

export const archSaveTheDateScene: SceneModule = {
  id: 'arch-save-the-date',
  component: ArchSaveTheDate,
  render: (key) => (
    <Composition
      key={key}
      id="arch-save-the-date"
      component={ArchSaveTheDate}
      schema={archSaveTheDateSchema}
      defaultProps={archSaveTheDateDefaults}
      durationInFrames={archSaveTheDateMeta.durationInFrames}
      fps={archSaveTheDateMeta.fps}
      width={archSaveTheDateMeta.width}
      height={archSaveTheDateMeta.height}
    />
  ),
};
