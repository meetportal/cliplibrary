import { defineControls } from '../../control-layout';
import type { ChevronMarkAssembleProps } from './chevron-mark-assemble';

const ONE_OF_TWO = 'The squares swap between these two as the background flips';

export const chevronMarkAssembleControls = defineControls<ChevronMarkAssembleProps>({
  sections: [
    {
      title: 'Logo and name',
      fields: [
        { path: 'brand.logo', label: 'Logo', hint: 'Wide, square or round; it sits on the plate' },
        { path: 'brand.name', label: 'Company name', hint: 'Shrinks and wraps to two lines' },
        { path: 'brand.nameFont', label: 'Name font' },
      ],
      more: [
        { path: 'brand.nameSize', label: 'Largest name size', hint: 'In pixels, for short names' },
        {
          path: 'brand.logoSize',
          label: 'Logo size',
          hint: 'Side of a square logo in pixels; wide logos keep the same area',
        },
        { path: 'brand.logoEntrance', label: 'Logo entrance' },
        { path: 'plate.show', label: 'Logo plate', hint: 'A card behind the logo' },
        {
          path: 'plate.roundness',
          label: 'Plate roundness',
          hint: '100 makes a pill, or a circle for a square or round logo',
        },
        { path: 'plate.padding', label: 'Plate padding', hint: 'In pixels around the logo' },
      ],
    },
    {
      title: 'Colors',
      fields: [
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
      more: [
        { path: 'colors.lightField', label: 'Light background', hint: ONE_OF_TWO },
        { path: 'colors.darkField', label: 'Dark background', hint: ONE_OF_TWO },
      ],
    },
    {
      title: 'Falling squares',
      fields: [
        { path: 'mark.cell', label: 'Mark size', hint: 'One grid cell of the chevron, in pixels' },
        { path: 'mark.tumble', label: 'Tumble', hint: 'Half turns each square spins as it falls' },
        { path: 'flips.style', label: 'Background flip' },
      ],
      more: [
        {
          path: 'mark.pieceScale',
          label: 'Square size',
          hint: 'Share of a grid cell; smaller opens the gap inside the chevron',
        },
        {
          path: 'mark.keystone',
          label: 'Accent keystone',
          hint: 'Fills the top diamond with the primary color once it locks',
        },
        { path: 'flips.frames', label: 'Flip length', hint: 'In frames' },
      ],
    },
    {
      title: 'Ending',
      fields: [
        { path: 'ending.style', label: 'Final background change' },
        { path: 'mark.emblem', label: 'Emblem size', hint: 'Share of the mark size at the end' },
      ],
      more: [
        { path: 'ending.frames', label: 'Final change length', hint: 'In frames' },
        {
          path: 'timing.speed',
          label: 'Build speed',
          hint: 'Above 1 builds faster and holds the end frame longer',
        },
      ],
    },
  ],
});
