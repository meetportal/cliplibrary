import { Composition } from 'remotion';
import {
  type WordPickerCProps,
  wordPickerCDefaults,
  wordPickerCMeta,
  wordPickerCSchema,
} from '@/schemas';
import { WordPicker } from '../../list-pickers/word-picker/word-picker';
import type { SceneModule } from '../../scene-module';

const WordPickerC = (props: WordPickerCProps) => <WordPicker {...props} />;

export const wordPickerCScene: SceneModule = {
  id: 'word-picker-c',
  component: WordPickerC,
  render: (key) => (
    <Composition
      key={key}
      id="word-picker-c"
      component={WordPickerC}
      schema={wordPickerCSchema}
      defaultProps={wordPickerCDefaults}
      durationInFrames={wordPickerCMeta.durationInFrames}
      fps={wordPickerCMeta.fps}
      width={wordPickerCMeta.width}
      height={wordPickerCMeta.height}
    />
  ),
};
