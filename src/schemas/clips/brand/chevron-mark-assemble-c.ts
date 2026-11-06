import {
  type ChevronMarkAssembleProps,
  chevronMarkAssembleBase,
  chevronMarkAssembleMeta,
  chevronMarkAssembleSchema,
} from '../../chevron-mark-assemble-common';
import type { ClipMeta } from '../../registry';

export const chevronMarkAssembleCSchema = chevronMarkAssembleSchema;

export type ChevronMarkAssembleCProps = ChevronMarkAssembleProps;

export const chevronMarkAssembleCDefaults: ChevronMarkAssembleCProps = {
  ...chevronMarkAssembleBase,
  brand: {
    ...chevronMarkAssembleBase.brand,
    logo: '{{Logo}}',
    name: '{{Company Name}}',
    logoEntrance: 'unfold',
  },
  plate: { show: true, roundness: 100, padding: 20 },
  colors: { ...chevronMarkAssembleBase.colors, primary: '#f2b51d' },
  flips: { style: 'diamond', frames: 14 },
  ending: { style: 'diamond', frames: 26 },
};

export const chevronMarkAssembleCMeta: ClipMeta = chevronMarkAssembleMeta('c', {
  id: 'chevron-mark-assemble-c',
  title: 'Chevron Mark Assemble C',
  description:
    'Squares tumble and lock into a chevron mark while each background flip bursts out of a square as a diamond, and the logo plate unfolds from a diamond.',
  source: 'src/compositions/scenes/brand/chevron-mark-assemble-c.tsx',
  theme: 'dark',
  tags: ['logo', 'drop', 'flip', 'reveal', 'end-card'],
});
