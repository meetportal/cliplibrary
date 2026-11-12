import { defineControls } from '../../control-layout';
import type { ChunkyTypeStackProps } from './chunky-type-stack';

export const chunkyTypeStackControls = defineControls<ChunkyTypeStackProps>({
  sections: [
    {
      title: 'Words',
      fields: [
        {
          path: 'lines.first',
          label: 'Line 1',
          hint: 'Top line of the stack. Leave empty to drop it',
        },
        { path: 'lines.second', label: 'Line 2', hint: 'The biggest line, second from the top' },
        { path: 'lines.third', label: 'Line 3', hint: 'Third line, stepped further right' },
        {
          path: 'lines.fourth',
          label: 'Line 4',
          hint: 'Last line, smallest, with the underline drawn under it',
        },
        {
          path: 'companyName',
          label: 'Company name',
          hint: 'Pops in after the ampersand and holds to the end; long names shrink to fit',
        },
      ],
      more: [
        {
          path: 'stack.caps',
          label: 'Capitals',
          hint: 'Shows every line and the company name in capital letters',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          path: 'colors.primary',
          label: 'Primary color',
          hint: 'The underlines and the big ampersand; lifted lighter when too dark to read on the board',
        },
        {
          path: 'colors.text',
          label: 'Text color',
          hint: 'Every letter of the stack and the company name',
        },
        { path: 'colors.background', label: 'Background color', hint: 'The middle of the board' },
        { path: 'colors.surface', label: 'Surface color', hint: 'The plate behind the logo' },
      ],
      more: [
        {
          path: 'colors.backgroundEdge',
          label: 'Background edge color',
          hint: 'The darker corners of the board',
        },
        { path: 'colors.grid', label: 'Grid color', hint: 'The faint grid lines on the board' },
        {
          path: 'colors.shadow',
          label: 'Shadow color',
          hint: 'The soft drop shadow under the letters and the logo plate',
        },
        {
          path: 'showBackground',
          label: 'Show background',
          hint: 'Turn off to layer the type over another clip',
        },
        {
          path: 'motion.grain',
          label: 'Chalk dust',
          hint: 'Strength of the fine flickering chalk specks on the board; 0 turns them off',
        },
        {
          path: 'motion.lightDrift',
          label: 'Board light drift',
          hint: 'In pixels, how far the soft light on the board circles, twice per loop; 0 holds it still',
        },
      ],
    },
    {
      title: 'Logo',
      fields: [
        {
          path: 'logo',
          label: 'Logo',
          hint: 'Under the stack from the first frame to the last; wide, square and round logos all fit',
        },
        {
          path: 'brand.plate',
          label: 'Logo plate',
          hint: 'A Surface color plate behind the logo so a dark logo reads on the board',
        },
      ],
      more: [
        {
          path: 'brand.y',
          label: 'Logo position',
          hint: 'Centre of the logo, in pixels from the top',
        },
        { path: 'brand.logoHeight', label: 'Logo height', hint: 'In pixels for a square logo' },
        {
          path: 'brand.logoWidth',
          label: 'Logo width limit',
          hint: 'In pixels; wide logos stop growing at this width',
        },
      ],
    },
    {
      title: 'Stack',
      fields: [
        {
          path: 'stack.step',
          label: 'Staircase step',
          hint: 'In pixels, how far each line steps right of the one above; 0 lines them up on the left',
        },
        {
          path: 'underline.show',
          label: 'Underlines',
          hint: 'Draws a Primary bar under the last line and under the company name',
        },
        {
          path: 'ampersand.show',
          label: 'Ampersand',
          hint: 'The big Primary ampersand that pops between the stack and the company name',
        },
      ],
      more: [
        {
          path: 'stack.firstSize',
          label: 'Line 1 size',
          hint: 'In pixels; long lines shrink to fit',
        },
        {
          path: 'stack.secondSize',
          label: 'Line 2 size',
          hint: 'In pixels; long lines shrink to fit',
        },
        {
          path: 'stack.thirdSize',
          label: 'Line 3 size',
          hint: 'In pixels; long lines shrink to fit',
        },
        {
          path: 'stack.fourthSize',
          label: 'Line 4 size',
          hint: 'In pixels; long lines shrink to fit',
        },
        {
          path: 'stack.lineGap',
          label: 'Line spacing',
          hint: 'Gap between lines as a share of the letter height',
        },
        {
          path: 'stack.tilt',
          label: 'Letter wobble',
          hint: 'In degrees, how far each letter leans either way; 0 sets them straight',
        },
        {
          path: 'stack.maxWidth',
          label: 'Stack width limit',
          hint: 'In pixels; lines and the company name shrink to stay inside it',
        },
        {
          path: 'stack.centerY',
          label: 'Stack position',
          hint: 'Centre of the stack and the end card, in pixels from the top',
        },
        { path: 'underline.thickness', label: 'Underline thickness', hint: 'In pixels' },
        {
          path: 'underline.gap',
          label: 'Underline gap',
          hint: 'Space between the letters and the underline, as a share of the letter height',
        },
        { path: 'ampersand.size', label: 'Ampersand size', hint: 'In pixels at its biggest' },
        {
          path: 'endCard.nameSize',
          label: 'Company name size',
          hint: 'In pixels; long names shrink to fit the width limit',
        },
        {
          path: 'endCard.underline',
          label: 'Company name underline',
          hint: 'Draws the Primary bar under the company name on the end card',
        },
        {
          path: 'motion.typeFrames',
          label: 'Typing length',
          hint: 'In frames, from the first letter popping in to the last',
        },
        {
          path: 'motion.popFrames',
          label: 'Letter pop length',
          hint: 'In frames, how long each letter takes to grow and settle',
        },
      ],
    },
  ],
});
