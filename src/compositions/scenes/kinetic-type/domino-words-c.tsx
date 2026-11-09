import { Composition } from 'remotion';
import {
  type DominoWordsCProps,
  dominoWordsCDefaults,
  dominoWordsCMeta,
  dominoWordsCSchema,
} from '@/schemas';
import { DominoWords } from '../../kinetic-type/domino-words/domino-words';
import type { SceneModule } from '../../scene-module';

const DominoWordsC = (props: DominoWordsCProps) => <DominoWords {...props} />;

export const dominoWordsCScene: SceneModule = {
  id: 'domino-words-c',
  component: DominoWordsC,
  render: (key) => (
    <Composition
      key={key}
      id="domino-words-c"
      component={DominoWordsC}
      schema={dominoWordsCSchema}
      defaultProps={dominoWordsCDefaults}
      durationInFrames={dominoWordsCMeta.durationInFrames}
      fps={dominoWordsCMeta.fps}
      width={dominoWordsCMeta.width}
      height={dominoWordsCMeta.height}
    />
  ),
};
