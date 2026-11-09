import type { ClipMeta } from '../../registry';
import {
  WORD_PICKER_ITEMS,
  type WordPickerProps,
  wordPickerMeta,
  wordPickerSchema,
} from '../../word-picker-common';

export const wordPickerASchema = wordPickerSchema;

export type WordPickerAProps = WordPickerProps;

export const wordPickerADefaults: WordPickerAProps = {
  logo: '{{Logo}}',
  companyName: '{{Company Name}}',
  items: WORD_PICKER_ITEMS,
  colors: {
    primary: '#0f766e',
    text: '#121417',
    secondary: '#8b9196',
    background: '#f5f7f7',
    surface: '#ffffff',
  },
  showBackground: true,
  layout: 'stacked',
  brand: { logoSize: 112, plate: true, nameSize: 54, nameFont: 'grotesk' },
  type: {
    listFont: 'grotesk',
    pickFont: 'grotesk',
    pickSize: 136,
    size: 76,
    pitch: 160,
    reach: 2.7,
  },
  selection: {
    style: 'bracket',
    width: 940,
    height: 176,
    fillStrength: 0.1,
    lineWidth: 3.5,
    corners: true,
    counter: false,
  },
  glow: { strength: 0.6, drift: 0.5 },
  steps: { count: 4, firstAt: 33, every: 33, moveFrames: 20 },
  entrance: { drawFrames: 22, wordsAt: 6, stagger: 6 },
};

export const wordPickerAMeta: ClipMeta = wordPickerMeta('a', {
  id: 'word-picker-a',
  title: 'Word Picker A',
  description:
    'Your logo and name sit above a centered list of words that steps up one word at a time, each pick growing into a tinted frame with corner lines and dots, ending held on the last pick.',
  theme: 'light',
  source: 'src/compositions/scenes/list-pickers/word-picker-a.tsx',
});
