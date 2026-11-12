import { Composition } from 'remotion';
import { colorPillsDefaults, colorPillsMeta, colorPillsSchema } from '@/schemas';
import { ColorPills } from '../../list-pickers/color-pills/color-pills';
import type { SceneModule } from '../../scene-module';

export const colorPillsScene: SceneModule = {
  id: 'color-pills',
  component: ColorPills,
  render: (key) => (
    <Composition
      key={key}
      id="color-pills"
      component={ColorPills}
      schema={colorPillsSchema}
      defaultProps={colorPillsDefaults}
      durationInFrames={colorPillsMeta.durationInFrames}
      fps={colorPillsMeta.fps}
      width={colorPillsMeta.width}
      height={colorPillsMeta.height}
    />
  ),
};
