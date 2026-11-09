import { Composition } from 'remotion';
import {
  type WordPickerAProps,
  wordPickerADefaults,
  wordPickerAMeta,
  wordPickerASchema,
} from '@/schemas';
import { WordPicker } from '../../list-pickers/word-picker/word-picker';
import type { SceneModule } from '../../scene-module';

const WordPickerA = (props: WordPickerAProps) => <WordPicker {...props} />;

export const wordPickerAScene: SceneModule = {
  id: 'word-picker-a',
  component: WordPickerA,
  render: (key) => (
    <Composition
      key={key}
      id="word-picker-a"
      component={WordPickerA}
      schema={wordPickerASchema}
      defaultProps={wordPickerADefaults}
      durationInFrames={wordPickerAMeta.durationInFrames}
      fps={wordPickerAMeta.fps}
      width={wordPickerAMeta.width}
      height={wordPickerAMeta.height}
    />
  ),
};
