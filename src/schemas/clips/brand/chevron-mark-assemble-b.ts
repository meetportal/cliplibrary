import {
  type ChevronMarkAssembleProps,
  chevronMarkAssembleBase,
  chevronMarkAssembleMeta,
  chevronMarkAssembleSchema,
} from '../../chevron-mark-assemble-common';
import type { ClipMeta } from '../../registry';

export const chevronMarkAssembleBSchema = chevronMarkAssembleSchema;

export type ChevronMarkAssembleBProps = ChevronMarkAssembleProps;

export const chevronMarkAssembleBDefaults: ChevronMarkAssembleBProps = {
  ...chevronMarkAssembleBase,
  brand: {
    ...chevronMarkAssembleBase.brand,
    logo: '{{Logo}}',
    name: '{{Company Name}}',
    nameFont: 'serif',
    nameSize: 112,
  },
  plate: { show: true, roundness: 12, padding: 48 },
  colors: { ...chevronMarkAssembleBase.colors, primary: '#2343d6', endField: '#2343d6' },
};

export const chevronMarkAssembleBMeta: ClipMeta = chevronMarkAssembleMeta('b', {
  id: 'chevron-mark-assemble-b',
  title: 'Chevron Mark Assemble B',
  description:
    'Squares tumble on flipping black and white fields and lock into a chevron mark, then the field fades into the brand color under a serif name and the logo.',
  source: 'src/compositions/scenes/brand/chevron-mark-assemble-b.tsx',
  theme: 'dark',
  tags: ['logo', 'drop', 'flip', 'minimal', 'end-card'],
});
