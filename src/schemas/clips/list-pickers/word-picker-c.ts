import type { ClipMeta } from '../../registry';
import {
  WORD_PICKER_ITEMS,
  type WordPickerProps,
  wordPickerMeta,
  wordPickerSchema,
} from '../../word-picker-common';

export const wordPickerCSchema = wordPickerSchema;

export type WordPickerCProps = WordPickerProps;

export const wordPickerCDefaults: WordPickerCProps = {
  logo: '{{Logo}}',
  companyName: '{{Company Name}}',
  items: WORD_PICKER_ITEMS,
  colors: {
    primary: '#c2410c',
    text: '#1c1917',
    secondary: '#a39b91',
    background: '#f4efe7',
    surface: '#fffdf9',
  },
  showBackground: true,
  layout: 'split',
  brand: { logoSize: 230, plate: false, nameSize: 64, nameFont: 'serif' },
  type: {
    listFont: 'geometric',
    pickFont: 'geometric',
    pickSize: 124,
    size: 70,
    pitch: 156,
    reach: 2.7,
  },
  selection: {
    style: 'bracket',
    width: 860,
    height: 176,
    fillStrength: 0.1,
    lineWidth: 3.5,
    corners: true,
    counter: true,
  },
  glow: { strength: 0.55, drift: 0.5 },
  steps: { count: 4, firstAt: 33, every: 33, moveFrames: 20 },
  entrance: { drawFrames: 22, wordsAt: 6, stagger: 6 },
};

export const wordPickerCMeta: ClipMeta = wordPickerMeta('c', {
  id: 'word-picker-c',
  title: 'Word Picker C',
  description:
    'Your logo and name hold a column on the left while a numbered list of words steps up on the right, each pick landing in a bracket frame with a counter that rolls from 01 to the last pick.',
  theme: 'light',
  source: 'src/compositions/scenes/list-pickers/word-picker-c.tsx',
});
