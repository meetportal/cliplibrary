import {
  CHEVRON_FIELD_COLORS,
  chevronMarkAssembleControls,
} from '../../chevron-mark-assemble-common';

export const chevronMarkAssembleBControls = chevronMarkAssembleControls(
  [
    {
      link: ['colors.primary', 'colors.endField'],
      label: 'Primary color',
      hint: 'The final background and the keystone diamond; the mark and name pick black or white to stay readable',
    },
    { path: 'colors.plate', label: 'Surface color', hint: 'The plate behind the logo' },
  ],
  [
    { path: 'colors.primary', label: 'Keystone color', hint: 'Fills the top diamond of the mark' },
    { path: 'colors.endField', label: 'Final background' },
    ...CHEVRON_FIELD_COLORS,
  ],
);
