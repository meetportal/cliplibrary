import { defineControls } from '../../control-layout';
import type { CrumpledPaperRevealProps } from './crumpled-paper-reveal';

export const crumpledPaperRevealControls = defineControls<CrumpledPaperRevealProps>({
  sections: [
    {
      title: 'Sheet copy',
      fields: [
        {
          path: 'headline',
          label: 'Headline',
          hint: 'The big serif line printed in the middle of the sheet; long headlines wrap to three lines and shrink to fit',
        },
        {
          path: 'tagline',
          label: 'Tagline',
          hint: 'Spaced capitals under the short rule, in the Primary color',
        },
        {
          path: 'companyName',
          label: 'Company name',
          hint: 'Small spaced capitals along the bottom of the sheet; long names shrink to fit',
        },
      ],
      more: [
        {
          path: 'type.headlineSize',
          label: 'Headline size',
          hint: 'Largest size in pixels on a sheet 900 wide; longer headlines shrink below it, and headlines of 8 characters or fewer may grow to 220',
        },
        {
          path: 'type.headlineCaps',
          label: 'Headline in capitals',
          hint: 'Off prints the headline as typed',
        },
        {
          path: 'type.taglineSize',
          label: 'Tagline size',
          hint: 'Largest size in pixels; long taglines shrink to fit',
        },
        { path: 'type.nameSize', label: 'Name size', hint: 'Largest size in pixels' },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          path: 'colors.primary',
          label: 'Primary color',
          hint: 'The short rule and the tagline; darkened if it would not read on the paper and shifted away from the text color if the two are too close',
        },
        {
          path: 'colors.text',
          label: 'Text color',
          hint: 'The headline and the company name; darkened or lifted if it would not read on the paper',
        },
        {
          path: 'colors.paper',
          label: 'Surface color',
          hint: 'The sheet of paper; its creases are lighter and darker shades of it',
        },
        {
          path: 'colors.wall',
          label: 'Background color',
          hint: 'The wall behind the paper; the window shadows and the paper shadow are darker shades of it',
        },
      ],
      more: [
        {
          path: 'showBackground',
          label: 'Show background',
          hint: 'Turn off to float the paper over another clip',
        },
      ],
    },
    {
      title: 'Logo',
      fields: [
        {
          path: 'logo',
          label: 'Logo',
          hint: 'Wide, square or round; printed at the top of the sheet',
        },
        {
          path: 'lockup.logoHeight',
          label: 'Logo height',
          hint: 'Height of square and round logos in pixels; wide logos stop at 440 pixels wide',
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
      title: 'Crumple',
      fields: [
        {
          path: 'paper.wrinkles',
          label: 'Creases',
          hint: 'How deep the creases stay once the sheet is flat; 0 is a smooth sheet',
        },
        {
          path: 'paper.ballSize',
          label: 'Ball size',
          hint: 'Size of the paper ball as a share of the sheet width',
        },
      ],
      more: [
        {
          path: 'paper.spin',
          label: 'Ball turn',
          hint: 'Degrees the paper turns as it crumples; it turns back as it opens',
        },
        {
          path: 'paper.tilt',
          label: 'Sheet tilt',
          hint: 'Degrees the flat sheet is turned; negative lifts the right side',
        },
      ],
    },
    {
      title: 'Light',
      fields: [
        {
          path: 'light.drift',
          label: 'Light drift',
          hint: 'How far the window light wanders, moving the creases and the window shadows; 0 holds it still',
        },
        {
          path: 'light.windowShadow',
          label: 'Window shadows',
          hint: 'How dark the window frame shadows on the wall are; 0 turns them off',
        },
      ],
    },
  ],
});
