import type { ClipMeta } from '../../registry';
import {
  WORD_PICKER_ITEMS,
  type WordPickerProps,
  wordPickerMeta,
  wordPickerSchema,
} from '../../word-picker-common';

export const wordPickerBSchema = wordPickerSchema;

export type WordPickerBProps = WordPickerProps;

export const wordPickerBDefaults: WordPickerBProps = {
  logo: '{{Logo}}',
  companyName: '{{Company Name}}',
  items: WORD_PICKER_ITEMS,
  colors: {
    primary: '#ff6a3d',
    text: '#f3f1ec',
    secondary: '#6e6e75',
    background: '#0f1012',
    surface: '#f3f1ec',
  },
  showBackground: true,
  layout: 'stacked',
  brand: { logoSize: 116, plate: true, nameSize: 60, nameFont: 'serif-italic' },
  type: {
    listFont: 'serif-italic',
    pickFont: 'serif-italic',
    pickSize: 156,
    size: 84,
    pitch: 180,
    reach: 2.7,
  },
  selection: {
    style: 'bar',
    width: 900,
    height: 172,
    fillStrength: 0.1,
    lineWidth: 3.5,
    corners: true,
    counter: false,
  },
  glow: { strength: 0.5, drift: 0.5 },
  steps: { count: 4, firstAt: 33, every: 33, moveFrames: 20 },
  entrance: { drawFrames: 22, wordsAt: 12, stagger: 6 },
};

export const wordPickerBMeta: ClipMeta = wordPickerMeta('b', {
  id: 'word-picker-b',
  title: 'Word Picker B',
  description:
    'On a dark stage under your logo and name, a list of words scrolls up through a solid coral bar one word at a time, each word turning dark on coral as it crosses the bar, all set in a serif italic, ending held on the last pick.',
  theme: 'dark',
  source: 'src/compositions/scenes/list-pickers/word-picker-b.tsx',
});
