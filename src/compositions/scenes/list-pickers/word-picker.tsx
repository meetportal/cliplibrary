import { Composition } from 'remotion';
import { wordPickerDefaults, wordPickerMeta, wordPickerSchema } from '@/schemas';
import { WordPicker } from '../../list-pickers/word-picker/word-picker';
import type { SceneModule } from '../../scene-module';

export const wordPickerScene: SceneModule = {
  id: 'word-picker',
  component: WordPicker,
  render: (key) => (
    <Composition
      key={key}
      id="word-picker"
      component={WordPicker}
      schema={wordPickerSchema}
      defaultProps={wordPickerDefaults}
      durationInFrames={wordPickerMeta.durationInFrames}
      fps={wordPickerMeta.fps}
      width={wordPickerMeta.width}
      height={wordPickerMeta.height}
    />
  ),
};
