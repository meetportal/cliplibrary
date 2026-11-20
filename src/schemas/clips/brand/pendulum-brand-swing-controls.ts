import { defineControls } from '../../control-layout';
import type { PendulumBrandSwingProps } from './pendulum-brand-swing';

const FITS = 'Shrinks or wraps so the string always clears it';

export const pendulumBrandSwingControls = defineControls<PendulumBrandSwingProps>({
  sections: [
    {
      title: 'Swinging copy',
      fields: [
        {
          path: 'companyName',
          label: 'Company name',
          hint: `The first line the string wipes in, and the small name at the top. ${FITS}`,
        },
        {
          path: 'headline',
          label: 'Headline',
          hint: `Wiped in on every other pass, one line per row. ${FITS}`,
        },
        {
          path: 'tagline',
          label: 'Tagline',
          hint: `The third line, with its first words in the Primary color. ${FITS}`,
        },
      ],
      more: [
        {
          path: 'type.accentWords',
          label: 'Tagline accent words',
          hint: 'How many leading words of the tagline use the Primary color; 0 for none',
        },
        {
          path: 'type.lightMiddle',
          label: 'Light middle lines',
          hint: 'Sets the second and fourth headline lines in a light weight',
        },
      ],
    },
    {
      title: 'Colors',
      fields: [
        {
          path: 'colors.primary',
          label: 'Primary color',
          hint: 'The string, the ring around the logo, the tagline accent, the first letter of the name and the website',
        },
        {
          path: 'colors.text',
          label: 'Text color',
          hint: 'The swinging copy, the name at the top and the services',
        },
        {
          path: 'colors.surface',
          label: 'Surface color',
          hint: 'The plate inside the ring that holds the logo',
        },
        {
          link: ['colors.background', 'colors.backgroundEdge'],
          label: 'Background color',
          hint: 'The plate behind everything, its soft centre glow and its edges together',
        },
      ],
      more: [
        {
          path: 'colors.background',
          label: 'Glow centre',
          hint: 'The lighter middle of the plate',
        },
        { path: 'colors.backgroundEdge', label: 'Plate edge', hint: 'The darker corners' },
        {
          path: 'showBackground',
          label: 'Show background',
          hint: 'Turn off to swing over another clip',
        },
      ],
    },
    {
      title: 'Pendulum',
      fields: [
        {
          path: 'logo',
          label: 'Logo',
          hint: 'Rides the bob: square and round logos sit in a disc, wide ones in a capsule',
        },
        {
          path: 'pendulum.swing',
          label: 'Swing width',
          hint: 'Share of the widest swing that keeps the bob inside the frame; 1 reaches the edge',
        },
        { path: 'pendulum.bobSize', label: 'Bob size', hint: 'Height of the logo bob in pixels' },
      ],
      more: [
        {
          path: 'pendulum.dwell',
          label: 'Pause at each end',
          hint: 'Lingers longer at the ends and passes the middle faster; 0 is an even swing. Eased off on wide, long swings so the bob never rushes',
        },
        {
          path: 'pendulum.length',
          label: 'String length',
          hint: 'From the pivot above the frame to the bob centre, in pixels',
        },
        { path: 'pendulum.string', label: 'String width', hint: 'In pixels' },
        {
          path: 'pendulum.trail',
          label: 'Motion trail',
          hint: 'Soft echoes behind the bob while it moves fast; 0 for none',
        },
        { path: 'pendulum.shadow', label: 'Bob shadow', hint: 'Strength of the soft drop shadow' },
      ],
    },
    {
      title: 'Footer',
      fields: [
        {
          path: 'services',
          label: 'Services',
          hint: 'What you offer, up to three rows; shrinks or wraps to fit',
        },
        { path: 'website', label: 'Website', hint: 'Last line, in the Primary color' },
      ],
      more: [
        { path: 'type.servicesSize', label: 'Services size', hint: 'Largest size in pixels' },
        { path: 'type.websiteSize', label: 'Website size', hint: 'Largest size in pixels' },
        {
          path: 'layout.footer',
          label: 'Footer height',
          hint: '0 sits just under the bob, 1 at the bottom edge; the website follows the services',
        },
      ],
    },
    {
      title: 'Type',
      fields: [
        { path: 'type.font', label: 'Font' },
        {
          path: 'type.copySize',
          label: 'Swinging copy size',
          hint: 'Largest size in pixels; long copy shrinks below it',
        },
      ],
      more: [
        { path: 'type.brandSize', label: 'Top name size', hint: 'Largest size in pixels' },
        {
          path: 'type.accentInitial',
          label: 'Accent first letter',
          hint: 'Sets the first letter of the top name in the Primary color',
        },
        { path: 'layout.brandY', label: 'Top name height', hint: 'From the top, in pixels' },
        {
          path: 'layout.copyY',
          label: 'Swinging copy height',
          hint: 'Centre of the swinging copy from the top, in pixels',
        },
      ],
    },
  ],
});
