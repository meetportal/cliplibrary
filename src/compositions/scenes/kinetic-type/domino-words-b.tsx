import { Composition } from 'remotion';
import {
  type DominoWordsBProps,
  dominoWordsBDefaults,
  dominoWordsBMeta,
  dominoWordsBSchema,
} from '@/schemas';
import { DominoWords } from '../../kinetic-type/domino-words/domino-words';
import type { SceneModule } from '../../scene-module';

const DominoWordsB = (props: DominoWordsBProps) => <DominoWords {...props} />;

export const dominoWordsBScene: SceneModule = {
  id: 'domino-words-b',
  component: DominoWordsB,
  render: (key) => (
    <Composition
      key={key}
      id="domino-words-b"
      component={DominoWordsB}
      schema={dominoWordsBSchema}
      defaultProps={dominoWordsBDefaults}
      durationInFrames={dominoWordsBMeta.durationInFrames}
      fps={dominoWordsBMeta.fps}
      width={dominoWordsBMeta.width}
      height={dominoWordsBMeta.height}
    />
  ),
};
