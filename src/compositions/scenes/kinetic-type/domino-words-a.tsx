import { Composition } from 'remotion';
import {
  type DominoWordsAProps,
  dominoWordsADefaults,
  dominoWordsAMeta,
  dominoWordsASchema,
} from '@/schemas';
import { DominoWords } from '../../kinetic-type/domino-words/domino-words';
import type { SceneModule } from '../../scene-module';

const DominoWordsA = (props: DominoWordsAProps) => <DominoWords {...props} />;

export const dominoWordsAScene: SceneModule = {
  id: 'domino-words-a',
  component: DominoWordsA,
  render: (key) => (
    <Composition
      key={key}
      id="domino-words-a"
      component={DominoWordsA}
      schema={dominoWordsASchema}
      defaultProps={dominoWordsADefaults}
      durationInFrames={dominoWordsAMeta.durationInFrames}
      fps={dominoWordsAMeta.fps}
      width={dominoWordsAMeta.width}
      height={dominoWordsAMeta.height}
    />
  ),
};
