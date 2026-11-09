import { Composition } from 'remotion';
import {
  type WordPickerBProps,
  wordPickerBDefaults,
  wordPickerBMeta,
  wordPickerBSchema,
} from '@/schemas';
import { WordPicker } from '../../list-pickers/word-picker/word-picker';
import type { SceneModule } from '../../scene-module';

const WordPickerB = (props: WordPickerBProps) => <WordPicker {...props} />;

export const wordPickerBScene: SceneModule = {
  id: 'word-picker-b',
  component: WordPickerB,
  render: (key) => (
    <Composition
      key={key}
      id="word-picker-b"
      component={WordPickerB}
      schema={wordPickerBSchema}
      defaultProps={wordPickerBDefaults}
      durationInFrames={wordPickerBMeta.durationInFrames}
      fps={wordPickerBMeta.fps}
      width={wordPickerBMeta.width}
      height={wordPickerBMeta.height}
    />
  ),
};
