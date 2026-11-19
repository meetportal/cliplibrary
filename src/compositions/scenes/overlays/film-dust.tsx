import { Composition } from 'remotion';
import { filmDustDefaults, filmDustMeta, filmDustSchema } from '@/schemas';
import { FilmDust } from '../../overlays/film-dust/film-dust';
import type { SceneModule } from '../../scene-module';

export const filmDustScene: SceneModule = {
  id: 'film-dust',
  component: FilmDust,
  render: (key) => (
    <Composition
      key={key}
      id="film-dust"
      component={FilmDust}
      schema={filmDustSchema}
      defaultProps={filmDustDefaults}
      durationInFrames={filmDustMeta.durationInFrames}
      fps={filmDustMeta.fps}
      width={filmDustMeta.width}
      height={filmDustMeta.height}
    />
  ),
};
