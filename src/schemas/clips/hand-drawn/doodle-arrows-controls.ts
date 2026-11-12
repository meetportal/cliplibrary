import { defineControls } from '../../control-layout';
import type { DoodleArrowsProps } from './doodle-arrows';

export const doodleArrowsControls = defineControls<DoodleArrowsProps>({
  sections: [
    {
      title: 'Note',
      fields: [
        {
          path: 'headline',
          label: 'Headline',
          hint: 'The handwritten line both arrows point at; it wraps to two lines and shrinks to fit',
        },
        {
          path: 'companyName',
          label: 'Company name',
          hint: 'Printed beside the logo under the headline; long names shrink to fit',
        },
      ],
      more: [
        {
          path: 'type.headlineSize',
          label: 'Headline size',
          hint: 'Largest size in pixels; longer headlines shrink below it and headlines of 12 characters or fewer grow up to 30% past it',
        },
        {
          path: 'type.nameSize',
          label: 'Name size',
          hint: 'Largest size in pixels; long names shrink below it',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          path: 'colors.primary',
          label: 'Primary color',
          hint: 'The straight arrow and the underline; darkened if it would not show on the paper and moved away from the text color if the two are too close',
        },
        {
          path: 'colors.pencil',
          label: 'Secondary color',
          hint: 'The wavy pencil arrow',
        },
        {
          path: 'colors.text',
          label: 'Text color',
          hint: 'The headline and the company name; darkened if it would not read on the paper',
        },
        {
          path: 'colors.paper',
          label: 'Background color',
          hint: 'The notebook paper',
        },
      ],
      more: [
        { path: 'colors.rules', label: 'Rule color', hint: 'The ruled lines on the paper' },
        {
          path: 'showBackground',
          label: 'Show background',
          hint: 'Turn off to draw the arrows and the note over another clip',
        },
      ],
    },
    {
      title: 'Logo',
      fields: [
        { path: 'logo', label: 'Logo', hint: 'Wide, square or round; sits left of the name' },
        {
          path: 'lockup.logoHeight',
          label: 'Logo height',
          hint: 'Height in pixels; wide logos stop at 300 pixels wide',
        },
      ],
      more: [
        {
          path: 'lockup.showPlate',
          label: 'Logo plate',
          hint: 'A rounded plate behind the logo, for a light logo on light paper',
        },
        { path: 'colors.plate', label: 'Logo plate color' },
      ],
    },
    {
      title: 'Arrows',
      fields: [
        {
          path: 'arrows.drawFrames',
          label: 'Draw time',
          hint: 'Frames the wavy arrow takes to draw; the straight arrow, the headline and the underline follow it',
        },
        {
          path: 'arrows.strokeWidth',
          label: 'Pencil width',
          hint: 'Line width of both arrows and the underline, in pixels',
        },
        {
          path: 'arrows.showUnderline',
          label: 'Underline',
          hint: 'A pencil stroke in the Primary color under the last headline line',
        },
      ],
      more: [
        { path: 'arrows.headSize', label: 'Arrowhead size', hint: 'Length of each barb in pixels' },
        {
          path: 'arrows.wobble',
          label: 'Hand wobble',
          hint: 'How shaky the pencil lines are; 0 draws them clean',
        },
      ],
    },
    {
      title: 'Paper',
      fields: [
        {
          path: 'paper.showRules',
          label: 'Ruled lines',
          hint: 'Notebook lines across the paper',
        },
        {
          path: 'paper.lightDrift',
          label: 'Light drift',
          hint: 'How strongly a soft light drifts across the paper; 0 holds it still',
        },
      ],
      more: [
        {
          path: 'paper.ruleSpacing',
          label: 'Rule spacing',
          hint: 'Pixels between the ruled lines',
        },
      ],
    },
  ],
});
