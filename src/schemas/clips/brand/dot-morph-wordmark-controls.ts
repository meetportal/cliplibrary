import { defineControls } from '../../control-layout';
import type { DotMorphWordmarkProps } from './dot-morph-wordmark';

export const dotMorphWordmarkControls = defineControls<DotMorphWordmarkProps>({
  sections: [
    {
      title: 'Name',
      fields: [
        {
          path: 'companyName',
          label: 'Company name',
          hint: 'The dots turn into these letters; long names shrink to fit one line',
        },
        {
          path: 'logo',
          label: 'Logo',
          hint: 'Settles in above the name as the letters close up; wide, square and round logos all fit',
        },
        { path: 'name.font', label: 'Name font' },
        {
          path: 'name.fullStop',
          label: 'Full stop',
          hint: 'The last colored dot leaves a full stop after the name',
        },
      ],
      more: [
        {
          path: 'name.size',
          label: 'Name size',
          hint: 'Largest size in pixels; long names shrink',
        },
        {
          path: 'name.tracking',
          label: 'Final letter spacing',
          hint: 'Share of the name size, once the name has settled',
        },
        {
          path: 'name.openTracking',
          label: 'Open letter spacing',
          hint: 'Share of the name size as the letters land, before they close up; long names open less',
        },
        {
          path: 'layout.offsetY',
          label: 'Move up or down',
          hint: 'In pixels; negative moves the name and logo up',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          link: ['colors.primary', 'colors.primaryEnd'],
          label: 'Primary color',
          hint: 'The gradient dots and the full stop. Scroll to More options to set each end of the gradient',
        },
        {
          link: ['colors.text', 'colors.dots'],
          label: 'Text color',
          hint: 'The letters and the plain dots',
        },
        { path: 'colors.background', label: 'Background color' },
      ],
      more: [
        { path: 'colors.primary', label: 'Gradient top' },
        { path: 'colors.primaryEnd', label: 'Gradient bottom' },
        { path: 'colors.text', label: 'Letter color' },
        { path: 'colors.dots', label: 'Plain dot color' },
        {
          path: 'colors.plate',
          label: 'Logo plate color',
          hint: 'The rounded plate behind the logo; shows when Logo plate is on',
        },
        {
          path: 'showBackground',
          label: 'Show background',
          hint: 'Turn off to layer the wordmark over another clip',
        },
      ],
    },
    {
      title: 'Logo',
      fields: [
        {
          path: 'mark.show',
          label: 'Show logo',
          hint: 'Turn off for the name alone; an empty logo hides it too',
        },
        {
          path: 'mark.plate',
          label: 'Logo plate',
          hint: 'A soft rounded plate behind the logo, so a dark logo reads on a dark background',
        },
      ],
      more: [
        {
          path: 'mark.height',
          label: 'Logo height',
          hint: 'Tallest the logo may be, in pixels, plate included; it keeps its shape',
        },
        {
          path: 'mark.width',
          label: 'Logo width',
          hint: 'Widest the logo may be, in pixels, plate included; wide logos stop here',
        },
        { path: 'mark.gap', label: 'Space above the name', hint: 'In pixels, under the logo' },
        { path: 'mark.padding', label: 'Plate padding', hint: 'In pixels around the logo' },
      ],
    },
    {
      title: 'Dots',
      fields: [
        {
          path: 'dots.count',
          label: 'Number of dots',
          hint: 'Each dot becomes a run of letters; a shorter name uses one dot per letter',
        },
        { path: 'dots.size', label: 'Dot size', hint: 'Diameter in pixels in the row' },
        {
          path: 'morph.style',
          label: 'Dot to letters',
          hint: 'Bloom grows the letters out of each dot as it lands; Underline spreads each dot into a line the letters rise from, and the last line pulls into the full stop',
        },
      ],
      more: [
        {
          path: 'dots.hop',
          label: 'Hop height',
          hint: 'How high each dot jumps before it drops onto the name, in dot sizes; 0 slides it across',
        },
        {
          path: 'dots.squash',
          label: 'Squash and stretch',
          hint: 'How much the dots flatten in the row and stretch as they jump and fall; 0 keeps them round',
        },
        {
          path: 'morph.tint',
          label: 'Letter tint',
          hint: 'Frames each new letter keeps the color of its dot before it turns the letter color; 0 is off',
        },
      ],
    },
    {
      title: 'Timing',
      fields: [
        {
          path: 'timing.pace',
          label: 'Pace',
          hint: 'Stretches or tightens the whole dance; 1 is the designed pace',
        },
        {
          path: 'timing.tighten',
          label: 'Close up length',
          hint: 'In frames, as the open letters close up; 0 lands them at the final spacing',
        },
      ],
      more: [
        { path: 'timing.start', label: 'First dot', hint: 'Frame the first dot appears' },
        {
          path: 'timing.stagger',
          label: 'Dot stagger',
          hint: 'In frames between one dot turning into letters and the next',
        },
      ],
    },
  ],
});
