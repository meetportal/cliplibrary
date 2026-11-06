import {
  CHEVRON_FIELD_COLORS,
  chevronMarkAssembleControls,
} from '../../chevron-mark-assemble-common';

export const chevronMarkAssembleAControls = chevronMarkAssembleControls(
  [
    {
      path: 'colors.primary',
      label: 'Primary color',
      hint: 'Fills the keystone diamond at the top of the mark',
    },
    {
      path: 'colors.endField',
      label: 'Background color',
      hint: 'The final background behind the logo and name',
    },
    { path: 'colors.plate', label: 'Surface color', hint: 'The plate behind the logo' },
  ],
  CHEVRON_FIELD_COLORS,
);
