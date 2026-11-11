import { Composition } from 'remotion';
import { dominoWordsDefaults, dominoWordsMeta, dominoWordsSchema } from '@/schemas';
import { DominoWords } from '../../kinetic-type/domino-words/domino-words';
import type { SceneModule } from '../../scene-module';

export const dominoWordsScene: SceneModule = {
  id: 'domino-words',
  component: DominoWords,
  render: (key) => (
    <Composition
      key={key}
      id="domino-words"
      component={DominoWords}
      schema={dominoWordsSchema}
      defaultProps={dominoWordsDefaults}
      durationInFrames={dominoWordsMeta.durationInFrames}
      fps={dominoWordsMeta.fps}
      width={dominoWordsMeta.width}
      height={dominoWordsMeta.height}
    />
  ),
};
